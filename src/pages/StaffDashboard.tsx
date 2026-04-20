import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, LogOut, Mail, Phone, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sampleEnquiries = [
  { id: 1, name: "Ahmed Khan", email: "ahmed@example.com", phone: "+92 300 1234567", country: "Italy", visa: "Student Visa", message: "Need info about university admissions and visa timeline.", date: "Apr 15, 2026", status: "new" },
  { id: 2, name: "Sara Ali", email: "sara@example.com", phone: "+92 321 9876543", country: "Portugal", visa: "Family Reunion", message: "My husband is in Portugal, want to join him.", date: "Apr 14, 2026", status: "replied" },
  { id: 3, name: "Usman Raza", email: "usman@example.com", phone: "+92 333 5551122", country: "Spain", visa: "Work Visa", message: "Software engineer looking for work visa options.", date: "Apr 13, 2026", status: "new" },
  { id: 4, name: "Hira Sheikh", email: "hira@example.com", phone: "+92 345 4448899", country: "Greece", visa: "Tourist Visa", message: "Planning a 2-week vacation in June.", date: "Apr 12, 2026", status: "replied" },
];

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [enquiries, setEnquiries] = useState(sampleEnquiries);

  useEffect(() => {
    if (sessionStorage.getItem("uvc_role") !== "staff") {
      navigate("/admin");
    }
  }, [navigate]);

  const markReplied = (id: number) =>
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "replied" } : e)));

  const logout = () => {
    sessionStorage.removeItem("uvc_role");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
              Staff Portal
            </h1>
            <p className="text-xs text-muted-foreground">Respond to client enquiries</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary">View Site</Link>
            <Button variant="ghost" size="sm" onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-foreground">{enquiries.length}</p></CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">New</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-primary">{enquiries.filter((e) => e.status === "new").length}</p></CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Replied</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-emerald-400">{enquiries.filter((e) => e.status === "replied").length}</p></CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-primary" /> Client Enquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {enquiries.map((e) => (
              <div key={e.id} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-start justify-between mb-2 gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.country} — {e.visa}</p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                    e.status === "new" ? "bg-primary/15 text-primary" : "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    {e.status === "new" ? <><Clock className="w-3 h-3 inline mr-1" /> New</> : <><CheckCircle2 className="w-3 h-3 inline mr-1" /> Replied</>}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{e.message}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="w-3 h-3" /> {e.email}</a>
                  <a href={`tel:${e.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="w-3 h-3" /> {e.phone}</a>
                  <span className="ml-auto">{e.date}</span>
                  {e.status === "new" && (
                    <Button size="sm" variant="outline" onClick={() => markReplied(e.id)}>
                      Mark Replied
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StaffDashboard;
