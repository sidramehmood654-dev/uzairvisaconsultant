import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

const UserLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back", description: "Redirecting..." });
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
            <span className="font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              Uzair Visa Consultancy
            </span>
          </Link>
          <Link to="/signup" className="text-sm text-muted-foreground hover:text-primary">
            New here? <span className="text-primary font-medium">Create account</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-foreground mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground mb-6">Sign in to continue your visa journey</p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground font-semibold">
              {loading ? "Signing in..." : "Sign In"}
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

export default UserLogin;
