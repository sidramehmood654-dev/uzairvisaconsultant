import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, User, Shield, Headphones, AlertCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
});

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("admin");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as any;

  useEffect(() => {
    if (location.state?.denied) {
      setError("Your account does not have access to that area.");
    }
  }, [location.state]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (signInError || !data.user) {
        setError("Invalid email or password.");
        return;
      }

      const { data: roleRows, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);

      if (roleError) {
        setError("Could not verify your role. Please try again.");
        await supabase.auth.signOut();
        return;
      }

      const userRoles = (roleRows ?? []).map((r: any) => r.role);
      if (!userRoles.includes(role)) {
        setError(`Your account is not authorised as ${role}.`);
        await supabase.auth.signOut();
        return;
      }

      toast.success(`Signed in as ${role}`);
      navigate(role === "admin" ? "/admin/dashboard" : "/staff", { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Internal Portal
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Uzair Visa Consultancy — Staff & Admin only</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground uppercase tracking-wider">Sign in as</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-all ${
                  role === "admin"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Shield className="w-5 h-5" />
                Admin (Owner)
              </button>
              <button
                type="button"
                onClick={() => setRole("staff")}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg border text-xs transition-all ${
                  role === "staff"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Headphones className="w-5 h-5" />
                Staff (Support)
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-xs text-destructive">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={role === "admin" ? "owner@uzairconsultancy.com" : "staff@uzairconsultancy.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                maxLength={255}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
                maxLength={128}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-gold text-primary-foreground font-semibold"
          >
            {submitting ? "Verifying…" : `Sign In as ${role === "admin" ? "Admin" : "Staff"}`}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Only accounts granted the {role} role in the database can access this area.
          </p>
          <Link to="/" className="block text-xs text-center text-muted-foreground hover:text-primary">
            ← Back to website
          </Link>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
