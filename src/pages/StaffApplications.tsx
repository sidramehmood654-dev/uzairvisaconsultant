import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, LogOut, Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listAllApplications } from "@/lib/applications";
import { useAuth } from "@/hooks/useAuth";

const statusBadge: Record<string, string> = {
  under_review: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  docs_missing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending: "bg-primary/15 text-primary border-primary/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const navItems = [
  { to: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/applications", label: "All Applications", icon: Briefcase },
];

const StaffApplications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAllApplications()
      .then(setApps)
      .catch((e) => console.error("Failed to load applications", e))
      .finally(() => setLoading(false));
  }, []);

  const list = apps.filter((a) => {
    const ms = filter === "all" || a.status === filter;
    const mq =
      !q ||
      a.full_name?.toLowerCase().includes(q.toLowerCase()) ||
      a.id.toLowerCase().includes(q.toLowerCase()) ||
      a.destination_country?.toLowerCase().includes(q.toLowerCase());
    return ms && mq;
  });

  const logout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 shrink-0 bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>Uzair Visa</h2>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Consultant Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                location.pathname === it.to
                  ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <it.icon className="w-4 h-4" /> {it.label}
            </Link>
          ))}
          <Link to="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <Globe className="w-4 h-4" /> View Website
          </Link>
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>All Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Every case submitted by clients across the agency.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID or country…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="docs_missing">Docs Missing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="text-left font-medium px-5 py-3">App ID</th>
                <th className="text-left font-medium px-5 py-3">Client</th>
                <th className="text-left font-medium px-5 py-3">Country</th>
                <th className="text-left font-medium px-5 py-3">Visa</th>
                <th className="text-left font-medium px-5 py-3">Travel</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">Loading…</td></tr>
              )}
              {!loading && list.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-5 py-4 text-primary font-medium">{a.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4 text-foreground">{a.full_name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.destination_country}</td>
                  <td className="px-5 py-4 text-foreground">{a.visa_type}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.travel_date ? new Date(a.travel_date).toLocaleDateString() : "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusBadge[a.status] ?? statusBadge.pending}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">No applications match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StaffApplications;
