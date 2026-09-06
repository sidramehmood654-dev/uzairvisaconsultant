import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const TESTS = [
  {
    type: "application_confirmation",
    label: "Application confirmation",
    data: {
      id: "test1234-0000-0000-0000-000000000000",
      full_name: "Sidra Mehmood",
      destination_country: "Italy",
      visa_type: "Study Visa",
      travel_date: "2026-11-20",
    },
  },
  {
    type: "application_status",
    label: "Application status update",
    data: {
      id: "test1234-0000-0000-0000-000000000000",
      full_name: "Sidra Mehmood",
      destination_country: "Italy",
      visa_type: "Study Visa",
      status: "under_review",
    },
  },
  {
    type: "enquiry_confirmation",
    label: "Enquiry confirmation",
    data: {
      name: "Sidra Mehmood",
      country: "Portugal",
      visa_type: "Work Visa",
      message: "I would like to know the document requirements.",
    },
  },
  {
    type: "admin_alert",
    label: "Admin alert (goes to uzairconsultancy@gmail.com)",
    data: {
      kind: "application",
      id: "test1234-0000-0000-0000-000000000000",
      full_name: "Sidra Mehmood",
      email: "sidra@example.com",
      destination_country: "Greece",
      visa_type: "Tourist Visa",
      travel_date: "2026-12-01",
      passport_number: "AB1234567",
    },
  },
] as const;

const EmailTestPanel = () => {
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const send = async (type: string, data: Record<string, unknown>) => {
    if (type !== "admin_alert" && !to.trim()) {
      toast.error("Enter a test recipient email first");
      return;
    }
    setBusy(type);
    try {
      const { data: res, error } = await supabase.functions.invoke("send-email", {
        body: { type, to: to.trim() || undefined, data },
      });
      if (error) throw error;
      toast.success(`Test sent`, { description: `${type} → ${(res as any)?.to}` });
    } catch (e: any) {
      toast.error("Send failed", { description: e?.message ?? "Unknown error" });
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg">Email Tests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Send test emails to</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {TESTS.map((t) => (
            <Button
              key={t.type}
              variant="outline"
              disabled={busy !== null}
              onClick={() => send(t.type, t.data as Record<string, unknown>)}
              className="justify-start h-auto py-3 text-left whitespace-normal"
            >
              {busy === t.type ? "Sending…" : t.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Test sends use sample data. The status-update test uses a fake reference, so it is
          delivered to the address above rather than a real applicant.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailTestPanel;
