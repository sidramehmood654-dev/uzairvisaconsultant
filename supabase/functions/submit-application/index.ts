import { z } from "https://esm.sh/zod@3.23.8";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import {
  checkRateLimit,
  clientIp,
  corsHeaders,
  hashIp,
  json,
  recordSubmission,
  serviceClient,
  verifyTurnstile,
} from "../_shared/guard.ts";
import { notify } from "../_shared/notify.ts";

const FORM = "visa_application";

const schema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long")
    .regex(/^[A-Za-z][A-Za-z\s.'-]+$/, "Full name may only contain letters, spaces, . ' -"),
  passport_number: z
    .string()
    .trim()
    .min(6, "Passport number must be 6–9 characters")
    .max(9, "Passport number must be 6–9 characters")
    .regex(/^[A-Z0-9]+$/i, "Passport number may only contain letters and digits"),
  destination_country: z.enum(["Italy", "Portugal", "Greece", "Spain"]),
  visa_type: z.enum([
    "Study Visa",
    "Work Visa",
    "Family Reunion",
    "Tourist Visa",
    "Business Visa",
    "Residence Visa",
  ]),
  travel_date: z.string().nullable().optional(),
  duration: z.string().trim().max(60).nullable().optional(),
  dob: z.string().nullable().optional(),
  nationality: z.string().trim().max(60).nullable().optional(),
  address: z.string().trim().max(300).nullable().optional(),
  occupation: z.string().trim().max(100).nullable().optional(),
  employer: z.string().trim().max(120).nullable().optional(),
  purpose: z.string().trim().max(1000).nullable().optional(),
  captchaToken: z.string().min(1, "Captcha verification required"),
});

function validDates(input: z.infer<typeof schema>): string | null {
  if (input.travel_date) {
    const d = new Date(input.travel_date);
    const today = new Date(new Date().toDateString());
    if (isNaN(d.getTime()) || d < today || d.getFullYear() > new Date().getFullYear() + 5) {
      return "Travel date must be today or in the future (within the next 5 years)";
    }
  }
  if (input.dob) {
    const d = new Date(input.dob);
    if (isNaN(d.getTime())) return "Invalid date of birth";
    const age = (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    if (age < 16 || age > 100) {
      return "Date of birth must make the applicant between 16 and 100 years old";
    }
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    // The applicant must be signed in — resolve them from their own JWT.
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Not authenticated" }, 401);

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, 400);
    }
    const input = parsed.data;

    const dateError = validDates(input);
    if (dateError) return json({ error: dateError }, 400);

    const ip = clientIp(req);
    const ipHash = await hashIp(ip);

    if (!(await verifyTurnstile(input.captchaToken, ip))) {
      return json({ error: "Captcha verification failed. Please try again." }, 403);
    }

    const supabase = serviceClient();

    if (!(await checkRateLimit(supabase, FORM, ipHash))) {
      return json(
        { error: "Too many submissions. Please try again in an hour." },
        429,
      );
    }

    const { data, error } = await supabase
      .from("visa_applications")
      .insert({
        user_id: user.id,
        full_name: input.full_name,
        passport_number: input.passport_number.toUpperCase(),
        destination_country: input.destination_country,
        visa_type: input.visa_type,
        travel_date: input.travel_date ?? null,
        duration: input.duration ?? null,
        dob: input.dob ?? null,
        nationality: input.nationality ?? null,
        address: input.address ?? null,
        occupation: input.occupation ?? null,
        employer: input.employer ?? null,
        purpose: input.purpose ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert failed", error);
      return json({ error: "Could not save your application. Please try again." }, 500);
    }

    await recordSubmission(supabase, FORM, ipHash);

    // Email triggers (do not affect the saved application if they fail)
    if (user.email) {
      await notify("application_confirmation", { to: user.email, data });
    }
    await notify("admin_alert", { data: { kind: "application", ...data, email: user.email } });

    return json(data);
  } catch (e) {
    console.error("submit-application error", e);
    return json({ error: "Unexpected error. Please try again." }, 500);
  }
});
