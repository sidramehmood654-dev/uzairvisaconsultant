import { Link } from "react-router-dom";
import { User, Shield, Briefcase, ArrowRight } from "lucide-react";

const roles = [
  {
    icon: Briefcase,
    title: "Continue as Guest",
    desc: "Browse the website freely — services, destinations & details. No account needed.",
    primary: "Explore Website",
    primaryTo: "/home",
    secondary: "Contact Us",
    secondaryTo: "/contact",
    badge: "Recommended",
  },
  {
    icon: User,
    title: "I'm an Applicant",
    desc: "Create an account to submit applications, save forms and track your visa progress.",
    primary: "Create Account",
    primaryTo: "/signup",
    secondary: "Sign In",
    secondaryTo: "/login",
    badge: null,
  },
  {
    icon: Shield,
    title: "Administrator",
    desc: "Internal access for managing enquiries, settings, and dashboards.",
    primary: "Admin Login",
    primaryTo: "/admin",
    secondary: null,
    secondaryTo: null,
    badge: null,
  },
];

const PortalSelect = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* gold radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-5">
            <span className="text-xs tracking-widest text-primary font-semibold uppercase">
              Uzair Visa Consultancy
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Welcome — How would you like to <span className="text-primary">continue?</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Browse freely as a guest, or create an account when you're ready to submit a visa application.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div
              key={r.title}
              className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.3)]"
            >
              {r.badge && (
                <span className="absolute top-4 right-4 text-[10px] uppercase tracking-widest bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                  {r.badge}
                </span>
              )}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <r.icon className="w-7 h-7 text-primary" />
              </div>
              <h3
                className="text-xl font-bold text-foreground mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {r.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 min-h-[60px]">{r.desc}</p>

              <div className="space-y-2">
                <Link
                  to={r.primaryTo}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-[hsl(var(--gold-light))] text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  {r.primary} <ArrowRight className="w-4 h-4" />
                </Link>
                {r.secondary && (
                  <Link
                    to={r.secondaryTo!}
                    className="flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-border text-foreground text-sm hover:bg-secondary transition-colors"
                  >
                    {r.secondary}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()} Uzair Visa Consultancy. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PortalSelect;
