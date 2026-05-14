import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { applications } from "@/data/mockApplications";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const statusBadge: Record<string, string> = {
  "Under Review": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "Docs Missing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Submitted: "bg-primary/15 text-primary border-primary/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const AdminApplications = () => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const list = applications.filter((a) => {
    const ms = filter === "all" || a.status === filter;
    const mq = !q || a.client.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase()) || a.country.toLowerCase().includes(q.toLowerCase());
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
            <Input placeholder="Search by client, ID, country…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Docs Missing">Docs Missing</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
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
                <th className="text-left font-medium px-5 py-3">Consultant</th>
                <th className="text-left font-medium px-5 py-3">Submitted</th>
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
                  <td className="px-5 py-4 text-muted-foreground">{a.consultant}</td>
                  <td className="px-5 py-4 text-muted-foreground">{a.submitted}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusBadge[a.status]}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">No applications match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
