import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, FileSearch, LogOut, Globe, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { applications } from "@/data/mockApplications";

const statusBadge: Record<string, string> = {
  "Under Review": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "Docs Missing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Submitted: "bg-primary/15 text-primary border-primary/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const navItems = [
  { to: "/staff", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/applications", label: "All Applications", icon: Briefcase },
];

const StaffApplications = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (sessionStorage.getItem("uvc_role") !== "staff") navigate("/admin");
  }, [navigate]);

  const list = applications
    .filter((a) => a.consultant === "Sidra Mehmood")
    .filter((a) => {
      const ms = filter === "all" || a.status === filter;
      const mq = !q || a.client.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase()) || a.country.toLowerCase().includes(q.toLowerCase());
      return ms && mq;
    });

  const logout = () => {
    sessionStorage.removeItem("uvc_role");
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
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>All My Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Every case currently assigned to you.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Docs Missing">Docs Missing</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
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
              {list.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-5 py-4 text-primary font-medium">{a.id}</td>
                  <td className="px-5 py-4 text-foreground">{a.client}</td>
                  <td className="px-5 py-4 text-muted-foreground"><span className="mr-1.5">{a.flag}</span>{a.country}</td>
                  <td className="px-5 py-4 text-foreground">{a.visa}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.travel}</td>
                  <td className="px-5 py-4"><span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusBadge[a.status]}`}>{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StaffApplications;
