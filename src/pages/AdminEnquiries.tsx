import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const enquiries = [
  { id: 1, name: "Ahmed Khan", email: "ahmed@example.com", phone: "0300-1234567", country: "Italy", visa: "Student Visa", date: "Apr 15, 2026", status: "New" },
  { id: 2, name: "Sara Ali", email: "sara@example.com", phone: "0321-9876543", country: "Portugal", visa: "Golden Visa", date: "Apr 14, 2026", status: "Contacted" },
  { id: 3, name: "Usman Raza", email: "usman@example.com", phone: "0333-5551234", country: "Spain", visa: "Work Visa", date: "Apr 13, 2026", status: "In Progress" },
  { id: 4, name: "Fatima Noor", email: "fatima@example.com", phone: "0312-4445678", country: "Greece", visa: "Family Reunion Visa", date: "Apr 12, 2026", status: "New" },
];

const statusColor: Record<string, string> = {
  New: "bg-primary/20 text-primary border-primary/30",
  Contacted: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "In Progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const AdminEnquiries = () => (
  <AdminLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
          Contact Enquiries
        </h1>
        <p className="text-sm text-muted-foreground">All enquiries from the contact form</p>
      </div>

      <Card className="bg-card border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Visa Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((e) => (
                <TableRow key={e.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{e.name}</TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground">{e.email}</div>
                    <div className="text-xs text-muted-foreground">{e.phone}</div>
                  </TableCell>
                  <TableCell>{e.country}</TableCell>
                  <TableCell>{e.visa}</TableCell>
                  <TableCell className="text-muted-foreground">{e.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColor[e.status]}>
                      {e.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
);

export default AdminEnquiries;
