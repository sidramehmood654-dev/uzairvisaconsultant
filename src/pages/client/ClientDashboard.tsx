import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Clock, CheckCircle2, AlertCircle, PlusCircle } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";
import { listMyApplications } from "@/lib/applications";
import { useAuth } from "@/hooks/useAuth";

const statusBadge: Record<string, string> = {
  pending: "bg-primary/15 text-primary border-primary/30",
  under_review: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  docs_missing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const ClientDashboard = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listMyApplications().then(setApps).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Active Applications", value: apps.filter((a) => !["approved", "rejected"].includes(a.status)).length, icon: FileText, accent: "border-t-primary" },
    { label: "Approved", value: apps.filter((a) => a.status === "approved").length, icon: CheckCircle2, accent: "border-t-emerald-500" },
    { label: "In Review", value: apps.filter((a) => a.status === "under_review").length, icon: Clock, accent: "border-t-sky-500" },
    { label: "Action Needed", value: apps.filter((a) => a.status === "docs_missing").length, icon: AlertCircle, accent: "border-t-amber-500" },
  ];

  const name = (user?.user_metadata as any)?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  return (
    <ClientLayout title={`Welcome back, ${name} 👋`} subtitle="Here's a summary of your visa applications">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`bg-card border border-border border-t-2 ${s.accent} rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-card border border-border rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Your Applications
              </h2>
              <Link to="/client/track" className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {loading && <p className="p-8 text-center text-sm text-muted-foreground">Loading…</p>}
              {!loading && apps.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-5 hover:bg-secondary/40 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{a.destination_country} — {a.visa_type}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.id.slice(0, 8).toUpperCase()} · Submitted {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusBadge[a.status] ?? statusBadge.pending}`}>
                    {a.status.replace("_", " ")}
                  </span>
                </div>
              ))}
              {!loading && apps.length === 0 && (
                <p className="p-8 text-center text-sm text-muted-foreground">No applications yet.</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/15 to-card border border-primary/30 rounded-xl p-6 flex flex-col">
            <PlusCircle className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Start a new application
            </h3>
            <p className="text-sm text-muted-foreground flex-1">
              Apply for a visa to Italy, Portugal, Greece or Spain. Takes about 4 minutes.
            </p>
            <Link
              to="/client/apply"
              className="mt-4 inline-flex items-center justify-center gap-2 bg-gradient-gold text-primary-foreground font-semibold rounded-lg px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
            >
              Begin Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
