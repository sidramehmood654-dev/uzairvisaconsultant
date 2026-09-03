// Shared spam-protection helpers: Turnstile verification + per-IP rate limiting.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? "unknown";
}

export async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Verifies a Cloudflare Turnstile token. Returns true when the token is valid. */
export async function verifyTurnstile(
  token: string | undefined | null,
  ip: string,
): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not configured");
    return false;
  }
  if (!token || typeof token !== "string") return false;

  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip && ip !== "unknown") body.append("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = await res.json();
    if (!data.success) console.warn("Turnstile rejected:", data["error-codes"]);
    return data.success === true;
  } catch (e) {
    console.error("Turnstile verification failed", e);
    return false;
  }
}

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_PER_WINDOW = 5;

/** Returns true when the caller is still within the allowed submission rate. */
export async function checkRateLimit(
  supabase: ReturnType<typeof serviceClient>,
  form: string,
  ipHash: string,
): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count, error } = await supabase
    .from("form_submission_log")
    .select("id", { count: "exact", head: true })
    .eq("form", form)
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if (error) {
    console.error("Rate limit lookup failed", error);
    return false; // fail closed
  }
  return (count ?? 0) < MAX_PER_WINDOW;
}

export async function recordSubmission(
  supabase: ReturnType<typeof serviceClient>,
  form: string,
  ipHash: string,
) {
  const { error } = await supabase
    .from("form_submission_log")
    .insert({ form, ip_hash: ipHash });
  if (error) console.error("Failed to record submission", error);
}
