import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";
import { Input } from "@/components/ui/input";
import { listMyApplications } from "@/lib/applications";

const statusBadge: Record<string, string> = {
  pending: "bg-primary/15 text-primary border-primary/30",
  under_review: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  docs_missing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const ClientTrack = () => {
  const [q, setQ] = useState("");
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyApplications()
      .then(setApps)
      .finally(() => setLoading(false));
  }, []);

  const filtered = apps.filter(
    (a) => !q || a.id.toLowerCase().includes(q.toLowerCase()) || a.destination_country.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <ClientLayout title="Track Applications" subtitle="Real-time status of your visa applications">
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by ID or country…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>

        {loading && <p className="text-center text-sm text-muted-foreground py-12">Loading…</p>}

        {!loading && filtered.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {a.destination_country} — {a.visa_type}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.id.slice(0, 8).toUpperCase()} · Submitted {new Date(a.created_at).toLocaleDateString()}
                  {a.travel_date ? ` · Travel ${new Date(a.travel_date).toLocaleDateString()}` : ""}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${statusBadge[a.status] ?? statusBadge.pending}`}>
                {a.status.replace("_", " ")}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">Applicant</p>
                <p className="text-foreground font-medium mt-0.5">{a.full_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">Passport</p>
                <p className="text-foreground font-medium mt-0.5">{a.passport_number}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">Nationality</p>
                <p className="text-foreground font-medium mt-0.5">{a.nationality ?? "—"}</p>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">No applications yet. Submit one to see it here.</p>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientTrack;
