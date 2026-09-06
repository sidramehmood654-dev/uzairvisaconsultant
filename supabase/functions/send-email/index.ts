// Single reusable sender. Contains NO email copy — all content lives in
// ../_shared/email-templates.ts. Sends through the Resend connector gateway.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import { renderEmail, type EmailType } from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-internal-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Set the EMAIL_FROM secret to your verified sender once your domain is verified in Resend,
// e.g. "Uzair Visa Consultancy <noreply@yourdomain.com>".
// Until then we fall back to Resend's shared test sender, which only delivers
// to the email address that owns the Resend account.
const FROM =
  Deno.env.get("EMAIL_FROM") ?? "Uzair Visa Consultancy <onboarding@resend.dev>";
const ADMIN_EMAIL = "uzairconsultancy@gmail.com";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const TYPES: EmailType[] = [
  "application_confirmation",
  "application_status",
  "enquiry_confirmation",
  "admin_alert",
];

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function sendViaResend(to: string, subject: string, html: string) {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !resendKey) {
    throw new Error("[500]: Email credentials are not configured");
  }
  const res = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": resendKey,
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Resend request failed [${res.status}]: ${text}`);
    throw new Error(`[${res.status}]: ${text}`);
  }
  return text;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const internal = req.headers.get("x-internal-key") === serviceKey;

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey, {
      auth: { persistSession: false },
    });

    // Callers must be either another edge function (internal key) or a signed-in
    // staff/admin user. This keeps the sender from being used as an open relay.
    if (!internal) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await admin.auth.getUser(token);
      if (!user) return json({ error: "Not authenticated" }, 401);
      const { data: roles } = await admin
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const allowed = (roles ?? []).some((r: any) => r.role === "admin" || r.role === "staff");
      if (!allowed) return json({ error: "Not authorised" }, 403);
    }

    const body = await req.json();
    const type = body?.type as EmailType;
    if (!TYPES.includes(type)) return json({ error: "Unknown email type" }, 400);

    const data: Record<string, any> = body?.data ?? {};
    let to: string | undefined = type === "admin_alert" ? ADMIN_EMAIL : body?.to;

    // Resolve the real recipient server-side where we can, so callers can't
    // redirect a client email to an arbitrary address.
    if (type === "application_status" && data.id) {
      const { data: app } = await admin
        .from("visa_applications")
        .select("*")
        .eq("id", data.id)
        .maybeSingle();
      if (app) {
        Object.assign(data, app, { status: data.status ?? app.status });
        const { data: u } = await admin.auth.admin.getUserById(app.user_id);
        if (u?.user?.email) to = u.user.email;
      }
    }
    if (!to) return json({ error: "No recipient" }, 400);

    const { subject, html } = renderEmail(type, data);
    await sendViaResend(to, subject, html);
    console.log(`Sent ${type} to ${to}`);
    return json({ ok: true, type, to });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("send-email error", msg);
    const match = msg.match(/^\[(\d{3})\]:/);
    return json({ error: msg }, match ? Number(match[1]) : 500);
  }
});
