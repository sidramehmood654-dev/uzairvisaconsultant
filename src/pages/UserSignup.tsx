import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const UserSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/client/dashboard`,
        data: { full_name: form.fullName, phone: form.phone },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Redirecting to your dashboard..." });
    navigate("/client/dashboard");
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/client/dashboard" });
    if (result.error) {
      toast({ title: "Google sign-in failed", description: String(result.error), variant: "destructive" });
      return;
    }
    if (result.redirected) return;
    navigate("/client/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-[hsl(var(--gold-dark))] flex items-center justify-center">
              <span className="text-primary-foreground font-bold">U</span>
            </div>
            <span className="font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Uzair Visa Consultancy</span>
          </Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
            Already have an account? <span className="text-primary font-medium">Sign in</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-card border border-border rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Create Account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start your visa application with Uzair Visa Consultancy</p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</label>
              <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</label>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+92 300 0000000" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
                <Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Confirm</label>
                <Input type="password" value={form.confirm} onChange={(e) => update("confirm", e.target.value)} required />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground font-semibold">
              {loading ? "Creating..." : "Create Account"}
            </Button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or</span></div>
            </div>

            <Button type="button" variant="outline" onClick={google} className="w-full">
              Continue with Google
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
