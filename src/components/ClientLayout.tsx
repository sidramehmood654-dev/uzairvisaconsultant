import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FolderOpen,
  Activity,
  History,
  LogOut,
  Globe,
  Bell,
} from "lucide-react";
import logo from "@/assets/logo.jpg";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { to: "/client/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/client/apply", label: "New Application", icon: PlusCircle },
  { to: "/client/documents", label: "My Documents", icon: FolderOpen },
  { to: "/client/track", label: "Track Status", icon: Activity },
  { to: "/client/history", label: "History", icon: History },
];

const ClientLayout = ({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const logout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = (user?.user_metadata as any)?.full_name || user?.email?.split("@")[0] || "Applicant";
  const initials = displayName.split(" ").map((s: string) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 shrink-0 bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="Uzair Visa" className="h-9 w-9 rounded-full object-cover border border-primary/30" />
            <div>
              <p className="text-sm font-bold text-primary leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Uzair Visa
              </p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Client Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`
              }
            >
              <it.icon className="w-4 h-4" />
              {it.label}
            </NavLink>
          ))}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Globe className="w-4 h-4" />
            View Website
          </Link>
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
              {title}
            </h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center font-semibold text-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">{displayName}</p>
                <p className="text-[10px] text-muted-foreground">Applicant</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default ClientLayout;
