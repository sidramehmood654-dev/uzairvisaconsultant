import { useState } from "react";
import { Upload, FileText, CheckCircle2, Clock, X, Trash2 } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Doc {
  id: number;
  name: string;
  size: string;
  status: "Verified" | "Received" | "Pending" | "Rejected";
  uploadedAt: string;
  required: boolean;
}

const initial: Doc[] = [
  { id: 1, name: "Passport_Sidra.pdf", size: "1.2 MB", status: "Verified", uploadedAt: "Apr 10, 2026", required: true },
  { id: 2, name: "Admission_Letter_Sapienza.pdf", size: "560 KB", status: "Verified", uploadedAt: "Apr 11, 2026", required: true },
  { id: 3, name: "Bank_Statement.pdf", size: "890 KB", status: "Received", uploadedAt: "Apr 12, 2026", required: true },
  { id: 4, name: "Police_Clearance.pdf", size: "—", status: "Pending", uploadedAt: "—", required: true },
  { id: 5, name: "Travel_Insurance.pdf", size: "—", status: "Pending", uploadedAt: "—", required: false },
];

const styles: Record<Doc["status"], string> = {
  Verified: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Received: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const ClientDocuments = () => {
  const [docs, setDocs] = useState(initial);
  const [drag, setDrag] = useState(false);

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((f, i) => {
      const newDoc: Doc = {
        id: Date.now() + i,
        name: f.name,
        size: `${(f.size / 1024).toFixed(0)} KB`,
        status: "Received",
        uploadedAt: new Date().toLocaleDateString(),
        required: false,
      };
      setDocs((d) => [newDoc, ...d]);
    });
    toast.success(`${files.length} file(s) uploaded`);
  };

  const removeDoc = (id: number) => {
    setDocs((d) => d.filter((x) => x.id !== id));
    toast("Document removed");
  };

  const verified = docs.filter((d) => d.status === "Verified").length;
  const pending = docs.filter((d) => d.status === "Pending" || d.status === "Received").length;

  return (
    <ClientLayout title="My Documents" subtitle="Upload and manage your application documents">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="Total Documents" value={docs.length} icon={FileText} accent="border-t-primary" />
          <Stat label="Verified" value={verified} icon={CheckCircle2} accent="border-t-emerald-500" />
          <Stat label="Pending Review" value={pending} icon={Clock} accent="border-t-amber-500" />
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleUpload(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
            drag ? "border-primary bg-primary/5" : "border-border bg-card"
          }`}
        >
          <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-foreground font-medium">Drag & drop files here</p>
          <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG · max 10MB each</p>
          <label className="inline-block mt-4">
            <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
            <span className="cursor-pointer inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground font-semibold rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" /> Browse Files
            </span>
          </label>
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Document Checklist
            </h2>
          </div>
          <div className="divide-y divide-border">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 hover:bg-secondary/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate flex items-center gap-2">
                      {d.name}
                      {d.required && <span className="text-[9px] uppercase tracking-widest text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">Required</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">{d.size} · {d.uploadedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full border ${styles[d.status]}`}>
                    {d.status}
                  </span>
                  <button
                    onClick={() => removeDoc(d.id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Remove"
                  >
                    {d.status === "Pending" ? <X className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

const Stat = ({ label, value, icon: Icon, accent }: any) => (
  <div className={`bg-card border border-border border-t-2 ${accent} rounded-xl p-5`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
    <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
      {value}
    </p>
  </div>
);

export default ClientDocuments;
