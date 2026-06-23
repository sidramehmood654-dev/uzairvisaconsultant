import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { listAllApplications } from "@/lib/applications";

const statusBadge: Record<string, string> = {
  under_review: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  docs_missing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending: "bg-primary/15 text-primary border-primary/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const AdminApplications = () => {
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            All Applications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Every visa application across the agency.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by name, ID, country…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
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
                <th className="text-left font-medium px-5 py-3">Passport</th>
                <th className="text-left font-medium px-5 py-3">Submitted</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">Loading…</td></tr>
              )}
              {!loading && list.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                  <td className="px-5 py-4 text-primary font-medium">{a.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4 text-foreground">{a.full_name}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.destination_country}</td>
                  <td className="px-5 py-4 text-foreground">{a.visa_type}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.passport_number}</td>
                  <td className="px-5 py-4 text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusBadge[a.status] ?? statusBadge.pending}`}>
                      {a.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && list.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No applications yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
