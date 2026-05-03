import { useEffect, useState } from "react";
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
  Phone,
  Calendar,
  FileText,
  CheckCircle2,
  Clock,
  X,
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

type Status = "Under Review" | "Docs Missing" | "Approved" | "Submitted";

interface App {
  id: string;
  client: string;
  email: string;
  phone: string;
  country: string;
  flag: string;
  visa: string;
  travel: string;
  submitted: string;
  status: Status;
  documents: { name: string; status: "Received" | "Pending" | "Verified" }[];
  notes: string;
}

const initialApps: App[] = [
  {
    id: "APP-2026-127",
    client: "Fatima Malik",
    email: "fatima.malik@example.com",
    phone: "+92 300 1234567",
    country: "Italy",
    flag: "🇮🇹",
    visa: "Student",
    travel: "Sep 1, 2026",
    submitted: "Apr 12, 2026",
    status: "Under Review",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "Admission Letter", status: "Verified" },
      { name: "Bank Statement", status: "Received" },
      { name: "Police Clearance", status: "Received" },
    ],
    notes: "Strong applicant, admission to Sapienza University Rome confirmed.",
  },
  {
    id: "APP-2026-122",
    client: "Omar Khalid",
    email: "omar.k@example.com",
    phone: "+92 321 7654321",
    country: "Spain",
    flag: "🇪🇸",
    visa: "Work",
    travel: "Jul 15, 2026",
    submitted: "Mar 28, 2026",
    status: "Docs Missing",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "Employment Contract", status: "Verified" },
      { name: "Medical Certificate", status: "Pending" },
      { name: "Apostilled Degree", status: "Pending" },
    ],
    notes: "Awaiting medical certificate and apostilled degree from client.",
  },
  {
    id: "APP-2026-119",
    client: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+92 333 9988776",
    country: "Portugal",
    flag: "🇵🇹",
    visa: "Golden Visa",
    travel: "Aug 10, 2026",
    submitted: "Feb 18, 2026",
    status: "Approved",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "Investment Proof", status: "Verified" },
      { name: "Tax Records", status: "Verified" },
    ],
    notes: "Approved by SEF Portugal. Residence card scheduled for pickup.",
  },
  {
    id: "APP-2026-116",
    client: "Hira Sheikh",
    email: "hira.sheikh@example.com",
    phone: "+92 345 4561230",
    country: "Greece",
    flag: "🇬🇷",
    visa: "Tourist",
    travel: "Jun 20, 2026",
    submitted: "Apr 2, 2026",
    status: "Submitted",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "Hotel Booking", status: "Verified" },
      { name: "Travel Insurance", status: "Verified" },
      { name: "Bank Statement", status: "Verified" },
    ],
    notes: "Submitted to Greek consulate Islamabad. Awaiting decision.",
  },
  {
    id: "APP-2026-110",
    client: "Usman Raza",
    email: "usman.raza@example.com",
    phone: "+92 312 1122334",
    country: "Italy",
    flag: "🇮🇹",
    visa: "Family Reunion",
    travel: "Oct 5, 2026",
    submitted: "Mar 15, 2026",
    status: "Under Review",
    documents: [
      { name: "Marriage Certificate", status: "Verified" },
      { name: "Sponsor Income Proof", status: "Verified" },
      { name: "Housing Contract", status: "Received" },
    ],
    notes: "Sponsor based in Milan, all paperwork in order.",
  },
];

const statusStyles: Record<Status, string> = {
  "Under Review": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "Docs Missing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Submitted: "bg-primary/15 text-primary border-primary/30",
};

const docStatusStyles: Record<string, string> = {
  Verified: "bg-emerald-500/15 text-emerald-400",
  Received: "bg-sky-500/15 text-sky-400",
  Pending: "bg-amber-500/15 text-amber-400",
};

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "My Cases", icon: Briefcase, key: "cases" },
  { label: "Review Application", icon: FileSearch, key: "review" },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<App | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("uvc_role") !== "staff") {
      navigate("/admin");
    }
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("uvc_role");
    navigate("/admin");
  };

  const apps = initialApps.filter((a) => {
    const matchesStatus = filter === "all" || a.status === filter;
    const matchesQuery =
      !query ||
      a.client.toLowerCase().includes(query.toLowerCase()) ||
      a.id.toLowerCase().includes(query.toLowerCase()) ||
      a.country.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Different scopes per tab
  const visibleApps =
    active === "review"
      ? apps.filter((a) => a.status === "Under Review" || a.status === "Docs Missing")
      : active === "cases"
      ? apps
      : apps;

  const stats = [
    { label: "Assigned Cases", value: 22, hint: "This month", accent: "border-t-sky-500" },
    { label: "Approved", value: 14, hint: "63.6% success rate", accent: "border-t-emerald-500" },
    { label: "Under Review", value: 6, hint: "In progress", accent: "border-t-primary" },
    { label: "Action Needed", value: 3, hint: "Urgent", accent: "border-t-destructive" },
  ];

  const sectionTitle =
    active === "cases"
      ? "My Cases"
      : active === "review"
      ? "Applications to Review"
      : "Assigned Applications";

  const handleSubmitNote = () => {
    if (!reviewNote.trim()) {
      toast.error("Please add a note before submitting");
      return;
    }
    toast.success(`Note added to ${selected?.id}`);
    setReviewNote("");
    setSelected(null);
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-card border-r border-border flex flex-col">
        <div className="p-5 border-b border-border">
          <h2 className="text-base font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
            Uzair Visa
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
            Consultant Panel
          </p>
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
            <Globe className="w-4 h-4" />
            View Website
          </Link>
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-sm">
                SA
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium leading-tight">Sidra Mehmood</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto space-y-6">
          {active === "dashboard" && (
            <>
              <div>
                <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Hello, Sidra <span className="inline-block">👋</span>
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  You have 3 applications awaiting action today
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className={`bg-card border border-border border-t-2 ${s.accent} rounded-xl p-5 hover:bg-secondary/40 transition-colors`}
                  >
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                    <p className="text-4xl font-bold text-foreground mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {s.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">{s.hint}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 bg-destructive/10 border border-destructive/30 text-foreground rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm">
                  <span className="font-semibold text-destructive">3 applications</span>{" "}
                  require your immediate action — document requests pending client response.
                </p>
              </div>
            </>
          )}

          {active !== "dashboard" && (
            <div>
              <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {sectionTitle}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {active === "review"
                  ? "Click any row to open the full review panel."
                  : "Manage all applications assigned to you."}
              </p>
            </div>
          )}

          {/* Applications table */}
          <div className="bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                {sectionTitle}
              </h2>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-44 bg-secondary/60 border-border">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Docs Missing">Docs Missing</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
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
                    <th className="text-left font-medium px-5 py-3">Visa Type</th>
                    <th className="text-left font-medium px-5 py-3">Travel Date</th>
                    <th className="text-left font-medium px-5 py-3">Status</th>
                    <th className="text-left font-medium px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleApps.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer"
                      onClick={() => setSelected(a)}
                    >
                      <td className="px-5 py-4 text-primary font-medium">{a.id}</td>
                      <td className="px-5 py-4 text-foreground">{a.client}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        <span className="mr-1.5">{a.flag}</span>
                        {a.country}
                      </td>
                      <td className="px-5 py-4 text-foreground">{a.visa}</td>
                      <td className="px-5 py-4 text-muted-foreground">{a.travel}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(a);
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded-full border ${statusStyles[a.status]} hover:opacity-80 transition-opacity`}
                        >
                          {a.status}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(a);
                          }}
                          className={
                            a.status === "Docs Missing"
                              ? "bg-amber-500 hover:bg-amber-500/90 text-black h-8 rounded-full px-4"
                              : "bg-primary hover:bg-primary/90 text-primary-foreground h-8 rounded-full px-4"
                          }
                        >
                          {a.status === "Docs Missing" ? "Urgent" : "Review"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {visibleApps.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                        No applications match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Review modal */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle
                      className="text-2xl text-foreground"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {selected.client}
                    </DialogTitle>
                    <p className="text-xs text-primary mt-1 font-mono">{selected.id}</p>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full border ${statusStyles[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
              </DialogHeader>

              <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <div className="bg-secondary/40 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" /> {selected.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" /> {selected.phone}
                  </div>
                </div>
                <div className="bg-secondary/40 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" /> Travel: {selected.travel}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" /> Submitted: {selected.submitted}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-secondary/40 rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Country</p>
                  <p className="text-foreground mt-1 font-medium">
                    <span className="mr-1.5">{selected.flag}</span>
                    {selected.country}
                  </p>
                </div>
                <div className="bg-secondary/40 rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Visa Type</p>
                  <p className="text-foreground mt-1 font-medium">{selected.visa}</p>
                </div>
                <div className="bg-secondary/40 rounded-lg p-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Documents</p>
                  <p className="text-foreground mt-1 font-medium">
                    {selected.documents.filter((d) => d.status === "Verified").length}/
                    {selected.documents.length} verified
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Documents
                </h3>
                <div className="space-y-2">
                  {selected.documents.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center justify-between bg-secondary/40 rounded-lg px-4 py-2.5"
                    >
                      <span className="text-sm text-foreground">{d.name}</span>
                      <span className={`text-[11px] px-2.5 py-1 rounded-full ${docStatusStyles[d.status]}`}>
                        {d.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Case Notes</h3>
                <p className="text-sm text-muted-foreground bg-secondary/40 rounded-lg p-4 leading-relaxed">
                  {selected.notes}
                </p>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Add Review Note</h3>
                <Textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add an internal note, request a document, or update the client…"
                  className="bg-secondary/40 border-border min-h-24"
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                <Button
                  onClick={handleSubmitNote}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Note
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success(`Marked ${selected.id} as Approved`);
                    setSelected(null);
                  }}
                  className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                >
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.message(`Document request sent to ${selected.client}`);
                    setSelected(null);
                  }}
                  className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                >
                  Request Documents
                </Button>
                <Button variant="ghost" onClick={() => setSelected(null)} className="ml-auto">
                  <X className="w-4 h-4 mr-2" /> Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffDashboard;
