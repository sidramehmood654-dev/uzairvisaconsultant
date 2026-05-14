import { useState } from "react";
import { Search, CheckCircle2, Circle } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";
import { Input } from "@/components/ui/input";
import { myApplications } from "@/data/mockApplications";

const statusBadge: Record<string, string> = {
  "Under Review": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "Docs Missing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Submitted: "bg-primary/15 text-primary border-primary/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const ClientTrack = () => {
  const [q, setQ] = useState("");
  const filtered = myApplications.filter(
    (a) => !q || a.id.toLowerCase().includes(q.toLowerCase()) || a.country.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <ClientLayout title="Track Applications" subtitle="Real-time status of your visa applications">
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search by ID or country…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>

        {filtered.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{a.flag}</span>
                  <h3 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {a.country} — {a.visa}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {a.id} · Submitted {a.submitted} · Travel {a.travel}
                </p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${statusBadge[a.status]}`}>{a.status}</span>
            </div>

            {/* Timeline */}
            <ol className="relative border-l border-border ml-3 space-y-5">
              {a.timeline.map((t, i) => (
                <li key={i} className="pl-6">
                  <span className="absolute -left-[11px] flex items-center justify-center bg-background">
                    {t.done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </span>
                  <p className={`text-sm font-medium ${t.done ? "text-foreground" : "text-muted-foreground"}`}>
                    {t.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-6 text-xs">
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">Consultant</p>
                <p className="text-foreground font-medium mt-0.5">{a.consultant}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">Fee</p>
                <p className="text-foreground font-medium mt-0.5">${a.fee} · Paid ${a.paid}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase tracking-widest">Documents</p>
                <p className="text-foreground font-medium mt-0.5">
                  {a.documents.filter((d) => d.status === "Verified").length} / {a.documents.length} verified
                </p>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">No applications match your search.</p>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientTrack;
