import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, User, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("admin");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "admin") {
      sessionStorage.setItem("admin_logged_in", "true");
      sessionStorage.setItem("uvc_role", "admin");
      navigate("/admin/dashboard");
    } else {
      sessionStorage.setItem("uvc_role", "staff");
      navigate("/staff");
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
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-gradient-gold text-primary-foreground font-semibold">
            Sign In as {role === "admin" ? "Admin" : "Staff"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Demo: any credentials work. Real role-based auth coming via Lovable Cloud.
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
