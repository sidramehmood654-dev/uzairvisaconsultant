import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

interface Checklist {
  visaType: string;
  country: string;
  documents: string[];
}

const initial: Checklist[] = [
  { visaType: "Study Visa", country: "Italy", documents: ["Passport Copy", "Admission Letter", "Bank Statement (€8,000+)", "Police Clearance", "Health Insurance", "Accommodation Proof"] },
  { visaType: "Work Visa", country: "Spain", documents: ["Passport Copy", "Employment Contract", "Apostilled Degree", "Medical Certificate", "Criminal Record", "Bank Statement"] },
  { visaType: "Family Reunion", country: "Italy", documents: ["Marriage Certificate", "Sponsor Income Proof", "Housing Contract", "Sponsor's Permit Copy", "Birth Certificates"] },
  { visaType: "Golden Visa", country: "Portugal", documents: ["Passport Copy", "Investment Proof (€500K+)", "Tax Records", "Criminal Record", "Health Insurance"] },
  { visaType: "Tourist Visa", country: "Greece", documents: ["Passport Copy", "Hotel Booking", "Travel Insurance", "Bank Statement", "Return Ticket", "Cover Letter"] },
];

const AdminDocuments = () => {
  const [lists, setLists] = useState(initial);
  const [newDoc, setNewDoc] = useState<{ [k: string]: string }>({});

  const addDoc = (i: number) => {
    const key = `${i}`;
    if (!newDoc[key]?.trim()) return;
    const next = [...lists];
    next[i].documents.push(newDoc[key].trim());
    setLists(next);
    setNewDoc({ ...newDoc, [key]: "" });
    toast.success("Document added");
  };

  const removeDoc = (i: number, j: number) => {
    const next = [...lists];
    next[i].documents.splice(j, 1);
    setLists(next);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Documents Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Required document checklists per visa type.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {lists.map((cl, i) => (
            <div key={cl.visaType + cl.country} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {cl.visaType} <span className="text-muted-foreground font-normal">— {cl.country}</span>
                </h3>
              </div>
              <ul className="space-y-2 mb-3">
                {cl.documents.map((d, j) => (
                  <li key={j} className="flex items-center justify-between bg-secondary/40 rounded-lg px-3 py-2 text-sm">
                    <span className="text-foreground">{d}</span>
                    <button onClick={() => removeDoc(i, j)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Input
                  placeholder="Add required document…"
                  value={newDoc[`${i}`] || ""}
                  onChange={(e) => setNewDoc({ ...newDoc, [`${i}`]: e.target.value })}
                  className="h-9"
                />
                <Button size="sm" onClick={() => addDoc(i)} className="bg-primary text-primary-foreground"><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDocuments;
