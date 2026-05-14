import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  cases: number;
  approved: number;
  initials: string;
  active: boolean;
}

const initial: Staff[] = [
  { id: 1, name: "Sidra Mehmood", email: "sidra@uzairconsultancy.com", phone: "+92 300 1234567", role: "Senior Consultant", cases: 22, approved: 14, initials: "SM", active: true },
  { id: 2, name: "Bilal Ahmed", email: "bilal@uzairconsultancy.com", phone: "+92 321 9988776", role: "Consultant", cases: 18, approved: 11, initials: "BA", active: true },
  { id: 3, name: "Ayesha Tariq", email: "ayesha@uzairconsultancy.com", phone: "+92 333 4561230", role: "Junior Consultant", cases: 12, approved: 6, initials: "AT", active: true },
  { id: 4, name: "Hamza Iqbal", email: "hamza@uzairconsultancy.com", phone: "+92 345 1112223", role: "Consultant", cases: 9, approved: 5, initials: "HI", active: false },
];

const AdminStaff = () => {
  const [staff, setStaff] = useState(initial);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Consultant" });

  const add = () => {
    if (!form.name || !form.email) return toast.error("Name and email required");
    const initials = form.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
    setStaff([...staff, { id: Date.now(), ...form, cases: 0, approved: 0, initials, active: true }]);
    setForm({ name: "", email: "", phone: "", role: "Consultant" });
    setOpen(false);
    toast.success("Staff member added");
  };

  const remove = (id: number) => {
    setStaff(staff.filter((s) => s.id !== id));
    toast("Staff member removed");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Staff Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Add consultants and assign cases.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-gold text-primary-foreground font-semibold"><Plus className="w-4 h-4 mr-1" /> Add Staff</Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader><DialogTitle>Add New Consultant</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <select className="w-full h-10 px-3 rounded-md bg-input border border-border text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option>Senior Consultant</option>
                  <option>Consultant</option>
                  <option>Junior Consultant</option>
                </select>
                <Button onClick={add} className="w-full bg-gradient-gold text-primary-foreground font-semibold">Add Member</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold text-primary-foreground flex items-center justify-center font-bold">{s.initials}</div>
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.role}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${s.active ? "bg-emerald-500/15 text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                  {s.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {s.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {s.phone}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="text-xs">
                  <span className="text-foreground font-semibold">{s.cases}</span> <span className="text-muted-foreground">cases</span>
                  <span className="mx-2 text-muted-foreground">·</span>
                  <span className="text-emerald-400 font-semibold">{s.approved}</span> <span className="text-muted-foreground">approved</span>
                </div>
                <button onClick={() => remove(s.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStaff;
