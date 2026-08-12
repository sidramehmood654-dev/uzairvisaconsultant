import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Inbox } from "lucide-react";
import { listEnquiries, updateEnquiryStatus, enquiryStatuses, type EnquiryStatus } from "@/lib/enquiries";
import { toast } from "@/hooks/use-toast";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  visa_type: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const statusColor: Record<string, string> = {
  new: "bg-primary/20 text-primary border-primary/30",
  contacted: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  in_progress: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  closed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const label = (s: string) => s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const AdminEnquiries = () => {
  const [rows, setRows] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listEnquiries()
      .then((d) => setRows(d as Enquiry[]))
      .catch((e) => toast({ title: "Could not load enquiries", description: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (id: string, status: EnquiryStatus) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      await updateEnquiryStatus(id, status);
      toast({ title: "Status updated", description: `Enquiry marked as ${label(status)}.` });
    } catch (e: any) {
      setRows(prev);
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contact Enquiries
          </h1>
          <p className="text-sm text-muted-foreground">All enquiries submitted from the contact form</p>
        </div>

        <Card className="bg-card border-border">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading enquiries…
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Inbox className="w-8 h-8 mb-3 text-primary" />
                <p className="text-sm">No enquiries yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Visa Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((e) => (
                    <TableRow key={e.id} className="border-border align-top">
                      <TableCell className="font-medium text-foreground">{e.name}</TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{e.email}</div>
                        <div className="text-xs text-muted-foreground">{e.phone || "—"}</div>
                      </TableCell>
                      <TableCell>{e.country || "—"}</TableCell>
                      <TableCell>{e.visa_type || "—"}</TableCell>
                      <TableCell className="max-w-xs text-sm text-muted-foreground truncate" title={e.message ?? ""}>
                        {e.message || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">
                        {new Date(e.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Badge variant="outline" className={statusColor[e.status] ?? ""}>
                            {label(e.status)}
                          </Badge>
                          <select
                            value={e.status}
                            onChange={(ev) => changeStatus(e.id, ev.target.value as EnquiryStatus)}
                            className="bg-secondary border border-border rounded-md px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {enquiryStatuses.map((s) => (
                              <option key={s} value={s}>
                                {label(s)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
