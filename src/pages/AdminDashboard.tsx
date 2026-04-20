import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Globe, Users, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Enquiries", value: "24", icon: MessageSquare, color: "text-primary" },
  { label: "Countries Served", value: "4", icon: Globe, color: "text-emerald-400" },
  { label: "Active Clients", value: "18", icon: Users, color: "text-sky-400" },
  { label: "Success Rate", value: "94%", icon: TrendingUp, color: "text-amber-400" },
];

const AdminDashboard = () => (
  <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Ahmed Khan", country: "Italy", visa: "Student Visa", date: "Apr 15, 2026" },
              { name: "Sara Ali", country: "Portugal", visa: "Golden Visa", date: "Apr 14, 2026" },
              { name: "Usman Raza", country: "Spain", visa: "Work Visa", date: "Apr 13, 2026" },
            ].map((e) => (
              <div key={e.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{e.name}</p>
                  <p className="text-xs text-muted-foreground">{e.country} — {e.visa}</p>
                </div>
                <span className="text-xs text-muted-foreground">{e.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
);

export default AdminDashboard;
