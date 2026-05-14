import ClientLayout from "@/components/ClientLayout";
import { applications } from "@/data/mockApplications";

const statusBadge: Record<string, string> = {
  "Under Review": "bg-sky-500/15 text-sky-400 border-sky-500/30",
  "Docs Missing": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Submitted: "bg-primary/15 text-primary border-primary/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

// Mock historical record — includes past archived applications
const history = [
  ...applications.slice(0, 3),
  {
    ...applications[0],
    id: "APP-2024-088",
    visa: "Tourist Visa",
    country: "Italy",
    flag: "🇮🇹",
    submitted: "Jul 2, 2024",
    travel: "Sep 1, 2024",
    status: "Approved" as const,
  },
  {
    ...applications[0],
    id: "APP-2023-051",
    visa: "Tourist Visa",
    country: "Greece",
    flag: "🇬🇷",
    submitted: "Mar 12, 2023",
    travel: "Jun 1, 2023",
    status: "Rejected" as const,
  },
];

const ClientHistory = () => {
  return (
    <ClientLayout title="Application History" subtitle="A complete record of every application you've made">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <th className="text-left font-medium px-5 py-3">App ID</th>
              <th className="text-left font-medium px-5 py-3">Country</th>
              <th className="text-left font-medium px-5 py-3">Visa Type</th>
              <th className="text-left font-medium px-5 py-3">Submitted</th>
              <th className="text-left font-medium px-5 py-3">Travel</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((a, i) => (
              <tr key={a.id + i} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                <td className="px-5 py-4 text-primary font-medium">{a.id}</td>
                <td className="px-5 py-4 text-muted-foreground"><span className="mr-1.5">{a.flag}</span>{a.country}</td>
                <td className="px-5 py-4 text-foreground">{a.visa}</td>
                <td className="px-5 py-4 text-muted-foreground">{a.submitted}</td>
                <td className="px-5 py-4 text-muted-foreground">{a.travel}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border ${statusBadge[a.status]}`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ClientLayout>
  );
};

export default ClientHistory;
