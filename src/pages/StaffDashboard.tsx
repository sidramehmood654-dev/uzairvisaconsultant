import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileSearch,
  LogOut,
  AlertCircle,
  Globe,
  Search,
  Bell,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { listAllApplications, updateApplicationStatus } from "@/lib/applications";
import { useAuth } from "@/hooks/useAuth";

type DbStatus = "pending" | "under_review" | "docs_missing" | "approved" | "rejected";

const STATUS_OPTIONS: { value: DbStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "docs_missing", label: "Docs Missing" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const statusStyles: Record<string, string> = {
  under_review: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  docs_missing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending: "bg-primary/15 text-primary border-primary/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const labelFor = (s: string) =>
  STATUS_OPTIONS.find((o) => o.value === s)?.label ?? s.replace("_", " ");

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "My Cases", icon: Briefcase, key: "cases" },
  { label: "Review Applications", icon: FileSearch, key: "review" },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [active, setActive] = useState("dashboard");
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await listAllApplications();
      setApps(rows);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load applications", { description: e?.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    await signOut();
    navigate("/admin");
  };

  const filtered = useMemo(
    () =>
      apps.filter((a) => {
        const ms = filter === "all" || a.status === filter;
        const mq =
          !query ||
          a.full_name?.toLowerCase().includes(query.toLowerCase()) ||
          a.id.toLowerCase().includes(query.toLowerCase()) ||
          a.destination_country?.toLowerCase().includes(query.toLowerCase());
        return ms && mq;
      }),
    [apps, filter, query],
  );

  const visibleApps =
    active === "review"
      ? filtered.filter((a) => a.status === "under_review" || a.status === "docs_missing" || a.status === "pending")
      : filtered;

  const counts = useMemo(() => {
    const c = { total: apps.length, approved: 0, under_review: 0, action: 0 };
    for (const a of apps) {
      if (a.status === "approved") c.approved++;
      if (a.status === "under_review" || a.status === "pending") c.under_review++;
      if (a.status === "docs_missing" || a.status === "rejected") c.action++;
    }
    return c;
  }, [apps]);

  const stats = [
    { label: "Total Cases", value: counts.total, hint: "All applications", accent: "border-t-sky-500" },
    { label: "Approved", value: counts.approved, hint: counts.total ? `${Math.round((counts.approved / counts.total) * 100)}% success rate` : "—", accent: "border-t-emerald-500" },
    { label: "In Progress", value: counts.under_review, hint: "Pending / Under Review", accent: "border-t-primary" },
    { label: "Action Needed", value: counts.action, hint: "Docs missing / rejected", accent: "border-t-destructive" },
  ];

  const sectionTitle =
    active === "cases" ? "My Cases" : active === "review" ? "Applications to Review" : "All Applications";

  const changeStatus = async (id: string, status: DbStatus) => {
    setSavingId(id);
    try {
      const updated = await updateApplicationStatus(id, status);
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
      if (selected?.id === id) setSelected((s: any) => ({ ...s, ...updated }));
      toast.success(`Status updated to ${labelFor(status)}`);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to update status", { description: e?.message });
    } finally {
      setSavingId(null);
    }
  };

  const submitNote = () => {
    if (!reviewNote.trim()) {
      toast.error("Please add a note before submitting");
      return;
    }
    toast.success(`Note added to ${selected?.id?.slice(0, 8).toUpperCase()}`);
    setReviewNote("");
  };

  const firstName = (user?.user_metadata as any)?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-60 shrink-0 bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
            Uzair Visa
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Consultant Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
                  setFilter("all");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/15 text-primary font-semibold border-l-2 border-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Globe className="w-4 h-4" /> View Website
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
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search cases, clients, countries…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-secondary/60 border-border"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              {counts.action > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto space-y-6">
          {active === "dashboard" && (
            <>
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Hello, {firstName} <span className="inline-block">👋</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {counts.action > 0
                    ? `You have ${counts.action} application${counts.action > 1 ? "s" : ""} requiring action today`
                    : "All caught up. Nice work."}
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className={`bg-card border border-border border-t-2 ${s.accent} rounded-xl p-5`}>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                    <p className="text-4xl font-bold mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-3">{s.hint}</p>
                  </div>
                ))}
              </div>

              {counts.action > 0 && (
                <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                  <p className="text-sm">
                    <span className="font-semibold text-destructive">{counts.action} application(s)</span>{" "}
                    need attention — missing documents or rejected.
                  </p>
                </div>
              )}
            </>
          )}

          {active !== "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{sectionTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {active === "review" ? "Click any row to open the full review panel." : "Manage every client application."}
              </p>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>{sectionTitle}</h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-44 bg-secondary/60 border-border"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                    <th className="text-left font-medium px-5 py-3">App ID</th>
                    <th className="text-left font-medium px-5 py-3">Client</th>
                    <th className="text-left font-medium px-5 py-3">Country</th>
                    <th className="text-left font-medium px-5 py-3">Visa</th>
                    <th className="text-left font-medium px-5 py-3">Travel</th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                    <th className="text-left font-medium px-5 py-3">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Loading…</td></tr>
                  )}
                  {!loading && visibleApps.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40 cursor-pointer" onClick={() => setSelected(a)}>
                      <td className="px-5 py-4 text-primary font-medium">{a.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-5 py-4">{a.full_name}</td>
                      <td className="px-5 py-4 text-muted-foreground">{a.destination_country}</td>
                      <td className="px-5 py-4">{a.visa_type}</td>
                      <td className="px-5 py-4 text-muted-foreground">{a.travel_date ? new Date(a.travel_date).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusStyles[a.status] ?? statusStyles.pending}`}>
                          {labelFor(a.status)}
                        </span>
                      </td>
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <Select value={a.status} onValueChange={(v) => changeStatus(a.id, v as DbStatus)} disabled={savingId === a.id}>
                          <SelectTrigger className="w-36 h-8 bg-secondary/60 border-border text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                  {!loading && visibleApps.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No applications match your filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selected.full_name}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  App ID: <span className="text-primary">{selected.id.slice(0, 8).toUpperCase()}</span> ·
                  Submitted {new Date(selected.created_at).toLocaleDateString()}
                </p>
              </DialogHeader>

              <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
                <Info icon={<Calendar className="w-3.5 h-3.5" />} label="Travel Date" value={selected.travel_date ? new Date(selected.travel_date).toLocaleDateString() : "—"} />
                <Info icon={<FileText className="w-3.5 h-3.5" />} label="Visa Type" value={selected.visa_type} />
                <Info icon={<Mail className="w-3.5 h-3.5" />} label="Passport" value={selected.passport_number} />
                <Info icon={<Mail className="w-3.5 h-3.5" />} label="Country" value={selected.destination_country} />
                <Info icon={<Mail className="w-3.5 h-3.5" />} label="Nationality" value={selected.nationality || "—"} />
                <Info icon={<Mail className="w-3.5 h-3.5" />} label="Occupation" value={selected.occupation || "—"} />
              </div>

              {selected.purpose && (
                <div className="mt-4 bg-secondary/40 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Purpose</p>
                  <p className="text-sm mt-1">{selected.purpose}</p>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-border">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Update Status</label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {STATUS_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => changeStatus(selected.id, o.value)}
                      disabled={savingId === selected.id}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        selected.status === o.value
                          ? statusStyles[o.value]
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Internal Note</label>
                <Textarea rows={3} value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} placeholder="Add a note about this application…" className="mt-2" />
                <Button onClick={submitNote} className="mt-3 bg-gradient-gold text-primary-foreground font-semibold">Save Note</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Info = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-secondary/40 rounded-lg p-3">
    <p className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1">{icon} {label}</p>
    <p className="text-sm mt-1">{value}</p>
  </div>
);

export default StaffDashboard;
