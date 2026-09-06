import { z } from "https://esm.sh/zod@3.23.8";
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

const FORM = "contact_enquiry";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long")
    .regex(/^[A-Za-z][A-Za-z\s.'-]+$/, "Name may only contain letters, spaces, . ' -"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[+0-9][0-9\s()-]{6,}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  country: z.string().trim().max(60).optional().or(z.literal("")),
  visa_type: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  captchaToken: z.string().min(1, "Captcha verification required"),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, 400);
    }
    const input = parsed.data;

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
      .from("contact_enquiries")
      .insert({
        user_id: null,
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        country: input.country || null,
        visa_type: input.visa_type || null,
        message: input.message || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert failed", error);
      return json({ error: "Could not save your enquiry. Please try again." }, 500);
    }

    await recordSubmission(supabase, FORM, ipHash);

    // Email triggers (do not affect the saved enquiry if they fail)
    await notify("enquiry_confirmation", { to: input.email, data: { ...input } });
    await notify("admin_alert", { data: { kind: "enquiry", ...input, id: data.id } });

    return json({ id: data.id });
  } catch (e) {
    console.error("submit-enquiry error", e);
    return json({ error: "Unexpected error. Please try again." }, 500);
  }
});
