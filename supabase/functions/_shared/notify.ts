// Fire-and-forget helper so submit functions can trigger emails without
// changing their existing form/database behaviour.
export async function notify(
  type: "application_confirmation" | "application_status" | "enquiry_confirmation" | "admin_alert",
  payload: { to?: string; data: Record<string, unknown> },
) {
  try {
    const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-key": Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      },
      body: JSON.stringify({ type, ...payload }),
    });
    if (!res.ok) console.error(`notify ${type} failed [${res.status}]: ${await res.text()}`);
  } catch (e) {
    console.error(`notify ${type} threw`, e);
  }
}
