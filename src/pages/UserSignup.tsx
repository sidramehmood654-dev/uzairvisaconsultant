import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const steps = ["Personal Info", "Visa Details", "Account"];

const UserSignup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    visaType: "",
    password: "",
    confirm: "",
  });

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("uvc_user", "1");
    toast({ title: "Account created (demo)", description: "Redirecting to your dashboard..." });
    setTimeout(() => navigate("/client/dashboard"), 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* top bar */}
      <header className="border-b border-border bg-card/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--gold-dark))] flex items-center justify-center">
              <span className="text-primary-foreground font-bold">U</span>
            </div>
            <span className="font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Uzair Visa Consultancy
            </span>
          </Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
            Already have an account? <span className="text-primary font-medium">Sign in</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-card border border-border rounded-2xl p-8">
          <h1
            className="text-3xl font-bold text-foreground mb-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Create Account
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Join Uzair Visa Consultancy and start your visa application today
          </p>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const active = n === step;
              return (
                <div key={label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors ${
                        done
                          ? "bg-primary text-primary-foreground border-primary"
                          : active
                          ? "bg-primary/20 text-primary border-primary"
                          : "bg-secondary text-muted-foreground border-border"
                      }`}
                    >
                      {done ? <Check className="w-4 h-4" /> : n}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1.5 hidden sm:block uppercase tracking-wider">
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-2 ${
                        done ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {step === 1 && (
              <>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">
                  Personal Information
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</label>
                  <Input
                    placeholder="Sidra Mehmood"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</label>
                    <Input
                      placeholder="+92 300 0000000"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">Visa Preference</p>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Destination Country</label>
                  <select
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground text-sm"
                    value={form.country}
                    onChange={(e) => update("country", e.target.value)}
                    required
                  >
                    <option value="">Select country</option>
                    <option>Italy</option>
                    <option>Portugal</option>
                    <option>Greece</option>
                    <option>Spain</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Visa Type</label>
                  <select
                    className="w-full h-10 px-3 rounded-md bg-input border border-border text-foreground text-sm"
                    value={form.visaType}
                    onChange={(e) => update("visaType", e.target.value)}
                    required
                  >
                    <option value="">Select visa type</option>
                    <option>Study Visa</option>
                    <option>Work Visa</option>
                    <option>Family Reunion</option>
                    <option>Tourist Visa</option>
                    <option>Business Visa</option>
                    <option>Residence Visa</option>
                  </select>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold">Account Security</p>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={(e) => update("confirm", e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={back} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={next}
                  className="flex-1 bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground font-semibold"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground font-semibold"
                >
                  Create Account
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
