import AdminLayout from "@/components/AdminLayout";
import { applications } from "@/data/mockApplications";
import { DollarSign, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const AdminPayments = () => {
  const totalRevenue = applications.reduce((s, a) => s + a.paid, 0);
  const totalDue = applications.reduce((s, a) => s + (a.fee - a.paid), 0);
  const fullyPaid = applications.filter((a) => a.paid >= a.fee).length;
  const partial = applications.filter((a) => a.paid > 0 && a.paid < a.fee).length;

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, accent: "border-t-emerald-500" },
    { label: "Outstanding", value: `$${totalDue.toLocaleString()}`, icon: Clock, accent: "border-t-amber-500" },
    { label: "Fully Paid", value: fullyPaid, icon: CheckCircle2, accent: "border-t-primary" },
    { label: "Partial Payments", value: partial, icon: TrendingUp, accent: "border-t-sky-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Invoices, fees collected and pending balances.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`bg-card border border-border border-t-2 ${s.accent} rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Invoices</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="text-left font-medium px-5 py-3">Invoice</th>
                <th className="text-left font-medium px-5 py-3">Client</th>
                <th className="text-left font-medium px-5 py-3">Service</th>
                <th className="text-right font-medium px-5 py-3">Fee</th>
                <th className="text-right font-medium px-5 py-3">Paid</th>
                <th className="text-right font-medium px-5 py-3">Balance</th>
                <th className="text-left font-medium px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((a) => {
                const balance = a.fee - a.paid;
                const status = balance === 0 ? "Paid" : a.paid === 0 ? "Unpaid" : "Partial";
                const cls = balance === 0
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : a.paid === 0
                  ? "bg-destructive/15 text-destructive border-destructive/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30";
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-secondary/40">
                    <td className="px-5 py-4 text-primary font-medium">INV-{a.id.split("-").pop()}</td>
                    <td className="px-5 py-4 text-foreground">{a.client}</td>
                    <td className="px-5 py-4 text-muted-foreground">{a.flag} {a.country} {a.visa}</td>
                    <td className="px-5 py-4 text-right text-foreground">${a.fee}</td>
                    <td className="px-5 py-4 text-right text-emerald-400">${a.paid}</td>
                    <td className="px-5 py-4 text-right text-amber-400">${balance}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] px-2.5 py-1 rounded-full border ${cls}`}>{status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
