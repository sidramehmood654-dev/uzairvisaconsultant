// Email copy + markup lives here ONLY. The send function never hardcodes content.
// Noir & Gold branding: deep black panel, gold accents, Playfair-style serif headings.

const GOLD = "#c9a227";
const NOIR = "#0d0d0d";
const PANEL = "#141414";
const TEXT = "#eaeaea";
const MUTED = "#a8a29e";

export const SITE_URL = "https://uzairvisaconsultant.vercel.app";
export const BRAND = "Uzair Visa Consultancy";

function shell(opts: { preview: string; heading: string; body: string; cta?: { label: string; url: string } }) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${NOIR};border:1px solid ${GOLD}33;border-radius:14px;overflow:hidden;">
    <tr><td style="padding:26px 30px;border-bottom:1px solid ${GOLD}33;text-align:center;">
      <div style="font-size:13px;letter-spacing:3px;color:${GOLD};text-transform:uppercase;">${BRAND}</div>
    </td></tr>
    <tr><td style="padding:32px 30px;background:${PANEL};">
      <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.3;color:${GOLD};font-weight:normal;">${esc(opts.heading)}</h1>
      <div style="font-size:15px;line-height:1.7;color:${TEXT};">${opts.body}</div>
      ${
        opts.cta
          ? `<div style="margin-top:28px;"><a href="${opts.cta.url}" style="display:inline-block;background:${GOLD};color:#111111;text-decoration:none;font-weight:bold;font-size:14px;padding:13px 26px;border-radius:8px;">${esc(opts.cta.label)}</a></div>`
          : ""
      }
    </td></tr>
    <tr><td style="padding:22px 30px;border-top:1px solid ${GOLD}33;text-align:center;color:${MUTED};font-size:12px;line-height:1.6;">
      ${BRAND} &middot; <a href="tel:+923426353166" style="color:${GOLD};text-decoration:none;">+92 342 6353166</a><br>
      <a href="${SITE_URL}" style="color:${GOLD};text-decoration:none;">${SITE_URL.replace("https://", "")}</a>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

function esc(v: unknown) {
  return String(v ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function rows(pairs: Array<[string, unknown]>) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;border-collapse:collapse;">${
    pairs
      .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 0;color:${MUTED};font-size:13px;width:42%;">${esc(k)}</td><td style="padding:8px 0;color:${TEXT};font-size:14px;">${esc(v)}</td></tr>`,
      )
      .join("")
  }</table>`;
}

export const STATUS_COPY: Record<string, { label: string; line: string }> = {
  pending: { label: "Pending", line: "Your application has been logged and is queued for review by our consultants." },
  under_review: { label: "Under Review", line: "One of our consultants is actively reviewing your application and documents." },
  docs_missing: { label: "Documents Required", line: "We need additional documents from you before we can continue. Please sign in to your portal and upload the requested files." },
  approved: { label: "Approved", line: "Congratulations — your application has been approved by our team. We will contact you with the next steps." },
  rejected: { label: "Rejected", line: "Unfortunately your application could not proceed at this stage. Please contact us so we can discuss your options." },
};

export type EmailType =
  | "application_confirmation"
  | "application_status"
  | "enquiry_confirmation"
  | "admin_alert";

export interface Rendered { subject: string; html: string }

export function renderEmail(type: EmailType, d: Record<string, any>): Rendered {
  switch (type) {
    case "application_confirmation": {
      const ref = String(d.id ?? "").slice(0, 8).toUpperCase();
      return {
        subject: `Application received — reference ${ref}`,
        html: shell({
          preview: `We've received your ${d.visa_type ?? "visa"} application.`,
          heading: `Thank you, ${d.full_name ?? "applicant"}`,
          body:
            `<p style="margin:0 0 8px;">We have received your visa application and it is now in our queue for review.</p>` +
            rows([
              ["Reference", ref],
              ["Destination", d.destination_country],
              ["Visa type", d.visa_type],
              ["Travel date", d.travel_date],
              ["Status", "Pending"],
            ]) +
            `<p style="margin:0;">You can track progress and upload documents any time from your applicant portal.</p>`,
          cta: { label: "Open my portal", url: `${SITE_URL}/portal` },
        }),
      };
    }

    case "application_status": {
      const ref = String(d.id ?? "").slice(0, 8).toUpperCase();
      const s = STATUS_COPY[String(d.status)] ?? { label: String(d.status ?? "Updated"), line: "Your application status has been updated." };
      return {
        subject: `Application ${ref} — status: ${s.label}`,
        html: shell({
          preview: `Your application is now ${s.label}.`,
          heading: `Your application is now ${s.label}`,
          body:
            `<p style="margin:0 0 8px;">Hello ${esc(d.full_name ?? "there")},</p>` +
            `<p style="margin:0 0 8px;">${esc(s.line)}</p>` +
            rows([
              ["Reference", ref],
              ["Destination", d.destination_country],
              ["Visa type", d.visa_type],
              ["New status", s.label],
            ]),
          cta: { label: "View my application", url: `${SITE_URL}/portal` },
        }),
      };
    }

    case "enquiry_confirmation": {
      return {
        subject: "We've received your enquiry",
        html: shell({
          preview: "Thanks for contacting Uzair Visa Consultancy.",
          heading: `Thank you, ${d.name ?? "there"}`,
          body:
            `<p style="margin:0 0 8px;">Your enquiry has reached our team. A consultant will get back to you shortly, usually within one business day.</p>` +
            rows([
              ["Country of interest", d.country],
              ["Visa type", d.visa_type],
              ["Your message", d.message],
            ]) +
            `<p style="margin:0;">Need to reach us sooner? Call or WhatsApp <strong style="color:${GOLD};">+92 342 6353166</strong>.</p>`,
          cta: { label: "Visit our website", url: SITE_URL },
        }),
      };
    }

    case "admin_alert": {
      const kind = d.kind === "enquiry" ? "enquiry" : "application";
      return {
        subject: `New ${kind}: ${d.name ?? d.full_name ?? "Unknown"}`,
        html: shell({
          preview: `A new ${kind} was submitted on the website.`,
          heading: `New ${kind} received`,
          body:
            rows(
              kind === "enquiry"
                ? [
                    ["Name", d.name],
                    ["Email", d.email],
                    ["Phone", d.phone],
                    ["Country", d.country],
                    ["Visa type", d.visa_type],
                    ["Message", d.message],
                  ]
                : [
                    ["Reference", String(d.id ?? "").slice(0, 8).toUpperCase()],
                    ["Applicant", d.full_name],
                    ["Email", d.email],
                    ["Destination", d.destination_country],
                    ["Visa type", d.visa_type],
                    ["Travel date", d.travel_date],
                    ["Passport", d.passport_number],
                  ],
            ),
          cta: { label: "Open admin portal", url: `${SITE_URL}/admin` },
        }),
      };
    }
  }
}
