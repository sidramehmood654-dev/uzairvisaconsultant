import { useEffect, useState } from "react";
import { Upload, FileText, CheckCircle2, Clock, Trash2, Download, Loader2 } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";
import { toast } from "sonner";
import {
  DocumentRow,
  deleteDocument,
  getDocumentSignedUrl,
  listMyDocuments,
  uploadDocument,
} from "@/lib/documents";

const styles: Record<string, string> = {
  verified: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  received: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const labels: Record<string, string> = {
  verified: "Verified",
  received: "Received",
  pending: "Pending",
  rejected: "Rejected",
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const ClientDocuments = () => {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  const refresh = async () => {
    try {
      setDocs(await listMyDocuments());
    } catch (e: any) {
      toast.error(e.message ?? "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const f of Array.from(files)) {
      try {
        await uploadDocument(f);
        ok++;
      } catch (e: any) {
        toast.error(`${f.name}: ${e.message ?? "upload failed"}`);
      }
    }
    setUploading(false);
    if (ok) toast.success(`${ok} file(s) uploaded`);
    refresh();
  };

  const handleDelete = async (doc: DocumentRow) => {
    try {
      await deleteDocument(doc);
      toast.success("Document removed");
      setDocs((d) => d.filter((x) => x.id !== doc.id));
    } catch (e: any) {
      toast.error(e.message ?? "Delete failed");
    }
  };

  const handleDownload = async (doc: DocumentRow) => {
    try {
      const url = await getDocumentSignedUrl(doc.storage_path, 60);
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e.message ?? "Could not open file");
    }
  };

  const verified = docs.filter((d) => d.status === "verified").length;
  const pending = docs.filter((d) => d.status === "pending" || d.status === "received").length;

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
          {uploading ? (
            <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
          )}
          <p className="text-foreground font-medium">
            {uploading ? "Uploading…" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG · max 10MB each</p>
          <label className="inline-block mt-4">
            <input
              type="file"
              multiple
              disabled={uploading}
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <span className="cursor-pointer inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground font-semibold rounded-lg px-4 py-2 text-sm hover:opacity-90 transition-opacity">
              <Upload className="w-4 h-4" /> Browse Files
            </span>
          </label>
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="p-5 border-b border-border">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your Documents
            </h2>
          </div>
          {loading ? (
            <div className="p-10 text-center text-muted-foreground text-sm">Loading…</div>
          ) : docs.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {docs.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 hover:bg-secondary/40 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(d.size_bytes)} · {new Date(d.created_at).toLocaleDateString()}
                      </p>
                      {d.staff_note && (
                        <p className="text-xs text-amber-400 mt-1">Note: {d.staff_note}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[11px] px-2.5 py-1 rounded-full border ${styles[d.status] ?? styles.received}`}>
                      {labels[d.status] ?? d.status}
                    </span>
                    <button
                      onClick={() => handleDownload(d)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      aria-label="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(d)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
