import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, CheckCircle2 } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const stepsList = ["Visa Details", "Personal Info", "Background", "Review"];

const ClientApply = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    country: "",
    visaType: "",
    travelDate: "",
    duration: "",
    fullName: "Sidra Mehmood",
    dob: "",
    passport: "",
    nationality: "Pakistani",
    address: "",
    occupation: "",
    employer: "",
    purpose: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = () => {
    toast.success("Application submitted (demo)", {
      description: "Your consultant will review it shortly.",
    });
    setTimeout(() => navigate("/client/track"), 800);
  };

  return (
    <ClientLayout title="New Visa Application" subtitle="Fill in the details — takes about 4 minutes">
      <div className="max-w-3xl">
        {/* Stepper pill */}
        <div className="flex bg-card border border-border rounded-full p-1.5 mb-8 max-w-2xl">
          {stepsList.map((label, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <button
                key={label}
                onClick={() => n <= step && setStep(n)}
                className={`flex-1 text-xs px-3 py-2 rounded-full transition-all ${
                  active
                    ? "bg-gradient-gold text-primary-foreground font-semibold"
                    : done
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {done ? <Check className="w-3 h-3 inline mr-1" /> : `${n}.`} {label}
              </button>
            );
          })}
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Visa Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Destination Country">
                  <select className="input-base" value={form.country} onChange={(e) => update("country", e.target.value)}>
                    <option value="">Select…</option>
                    <option>Italy</option>
                    <option>Portugal</option>
                    <option>Greece</option>
                    <option>Spain</option>
                  </select>
                </Field>
                <Field label="Visa Type">
                  <select className="input-base" value={form.visaType} onChange={(e) => update("visaType", e.target.value)}>
                    <option value="">Select…</option>
                    <option>Study Visa</option>
                    <option>Work Visa</option>
                    <option>Family Reunion</option>
                    <option>Tourist Visa</option>
                    <option>Business Visa</option>
                    <option>Residence Visa</option>
                  </select>
                </Field>
                <Field label="Intended Travel Date">
                  <Input type="date" value={form.travelDate} onChange={(e) => update("travelDate", e.target.value)} />
                </Field>
                <Field label="Duration of Stay">
                  <Input placeholder="e.g. 2 years" value={form.duration} onChange={(e) => update("duration", e.target.value)} />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Personal Information
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name"><Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
                <Field label="Date of Birth"><Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} /></Field>
                <Field label="Passport Number"><Input value={form.passport} onChange={(e) => update("passport", e.target.value)} placeholder="AB1234567" /></Field>
                <Field label="Nationality"><Input value={form.nationality} onChange={(e) => update("nationality", e.target.value)} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Current Address"><Textarea rows={2} value={form.address} onChange={(e) => update("address", e.target.value)} /></Field>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Background & Purpose
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Occupation"><Input value={form.occupation} onChange={(e) => update("occupation", e.target.value)} /></Field>
                <Field label="Employer / Institution"><Input value={form.employer} onChange={(e) => update("employer", e.target.value)} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Purpose of Travel"><Textarea rows={4} value={form.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="Briefly describe your reason for travel" /></Field>
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Review & Submit
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {Object.entries(form).map(([k, v]) => (
                  <div key={k} className="bg-secondary/40 rounded-lg p-3">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</p>
                    <p className="text-foreground mt-0.5">{v || <span className="text-muted-foreground italic">—</span>}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-foreground">
                  After submission, you'll be able to upload supporting documents in <strong>My Documents</strong>.
                </p>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            {step > 1 && (
              <Button variant="outline" onClick={back} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={next} className="flex-1 bg-gradient-gold text-primary-foreground font-semibold">
                Continue <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={submit} className="flex-1 bg-gradient-gold text-primary-foreground font-semibold">
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`.input-base{width:100%;height:2.5rem;padding:0 0.75rem;border-radius:0.375rem;background:hsl(var(--input));border:1px solid hsl(var(--border));color:hsl(var(--foreground));font-size:.875rem}`}</style>
    </ClientLayout>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</label>
    {children}
  </div>
);

export default ClientApply;
