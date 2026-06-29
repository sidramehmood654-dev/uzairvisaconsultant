import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, CheckCircle2, AlertCircle } from "lucide-react";
import { ZodError } from "zod";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createApplication, visaApplicationSchema } from "@/lib/applications";
import { useAuth } from "@/hooks/useAuth";

const stepsList = ["Visa Details", "Personal Info", "Background", "Review"];

const ClientApply = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    country: "",
    visaType: "",
    travelDate: "",
    duration: "",
    fullName: (user?.user_metadata as any)?.full_name || "",
    dob: "",
    passport: "",
    nationality: "Pakistani",
    address: "",
    occupation: "",
    employer: "",
    purpose: "",
  });

  const update = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  // Map zod field paths -> local form keys for inline error display
  const fieldMap: Record<string, string> = {
    full_name: "fullName",
    passport_number: "passport",
    destination_country: "country",
    visa_type: "visaType",
    travel_date: "travelDate",
  };

  const validateStep = (n: number): boolean => {
    const stepFields: Record<number, (keyof typeof form)[]> = {
      1: ["country", "visaType", "travelDate", "duration"],
      2: ["fullName", "dob", "passport", "nationality", "address"],
      3: ["occupation", "employer", "purpose"],
    };
    const payload = buildPayload();
    const result = visaApplicationSchema.safeParse(payload);
    if (result.success) {
      setErrors({});
      return true;
    }
    const newErrs: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const zodField = issue.path[0] as string;
      const formField = fieldMap[zodField] ?? zodField;
      if (stepFields[n]?.includes(formField as any)) {
        newErrs[formField] = issue.message;
      }
    }
    setErrors(newErrs);
    if (Object.keys(newErrs).length > 0) {
      toast.error("Please fix the highlighted fields");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, 4));
  };
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const buildPayload = () => ({
    full_name: form.fullName,
    passport_number: form.passport,
    destination_country: form.country,
    visa_type: form.visaType,
    travel_date: form.travelDate || null,
    duration: form.duration || null,
    dob: form.dob || null,
    nationality: form.nationality || null,
    address: form.address || null,
    occupation: form.occupation || null,
    employer: form.employer || null,
    purpose: form.purpose || null,
  });

  const submit = async () => {
    setSubmitting(true);
    try {
      await createApplication(buildPayload());
      toast.success("Application submitted", { description: "Your consultant will review it shortly." });
      navigate("/client/track");
    } catch (e: any) {
      if (e instanceof ZodError) {
        const newErrs: Record<string, string> = {};
        for (const issue of e.issues) {
          const formField = fieldMap[issue.path[0] as string] ?? (issue.path[0] as string);
          newErrs[formField] = issue.message;
        }
        setErrors(newErrs);
        toast.error("Please fix the highlighted fields");
      } else {
        toast.error("Submission failed", { description: e?.message ?? "Please try again." });
      }
    } finally {
      setSubmitting(false);
    }
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
                <Field label="Destination Country" error={errors.country}>
                  <select className="input-base" value={form.country} onChange={(e) => update("country", e.target.value)}>
                    <option value="">Select…</option>
                    <option>Italy</option>
                    <option>Portugal</option>
                    <option>Greece</option>
                    <option>Spain</option>
                  </select>
                </Field>
                <Field label="Visa Type" error={errors.visaType}>
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
                <Field label="Intended Travel Date" error={errors.travelDate}>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    max={`${new Date().getFullYear() + 5}-12-31`}
                    value={form.travelDate}
                    onChange={(e) => update("travelDate", e.target.value)}
                  />
                </Field>
                <Field label="Duration of Stay" error={errors.duration}>
                  <Input placeholder="e.g. 2 years" maxLength={60} value={form.duration} onChange={(e) => update("duration", e.target.value)} />
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
                <Field label="Full Name" error={errors.fullName}><Input maxLength={100} value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></Field>
                <Field label="Date of Birth" error={errors.dob}><Input type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} /></Field>
                <Field label="Passport Number" error={errors.passport}><Input maxLength={9} value={form.passport} onChange={(e) => update("passport", e.target.value.toUpperCase())} placeholder="AB1234567" /></Field>
                <Field label="Nationality" error={errors.nationality}><Input maxLength={60} value={form.nationality} onChange={(e) => update("nationality", e.target.value)} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Current Address" error={errors.address}><Textarea rows={2} maxLength={300} value={form.address} onChange={(e) => update("address", e.target.value)} /></Field>
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
                <Field label="Occupation" error={errors.occupation}><Input maxLength={100} value={form.occupation} onChange={(e) => update("occupation", e.target.value)} /></Field>
                <Field label="Employer / Institution" error={errors.employer}><Input maxLength={120} value={form.employer} onChange={(e) => update("employer", e.target.value)} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Purpose of Travel" error={errors.purpose}><Textarea rows={4} maxLength={1000} value={form.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="Briefly describe your reason for travel" /></Field>
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
              <Button onClick={submit} disabled={submitting} className="flex-1 bg-gradient-gold text-primary-foreground font-semibold">
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style>{`.input-base{width:100%;height:2.5rem;padding:0 0.75rem;border-radius:0.375rem;background:hsl(var(--input));border:1px solid hsl(var(--border));color:hsl(var(--foreground));font-size:.875rem}`}</style>
    </ClientLayout>
  );
};

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</label>
    {children}
    {error && <p className="text-[11px] text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
  </div>
);

export default ClientApply;
