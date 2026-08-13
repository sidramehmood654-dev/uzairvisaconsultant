import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, FileText, ExternalLink, Loader2, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DocumentRow,
  DocStatus,
  listDocumentsForApplicant,
  getDocumentSignedUrl,
  updateDocumentStatus,
} from "@/lib/documents";

const docStatusStyles: Record<string, string> = {
  received: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  pending: "bg-primary/15 text-primary border-primary/30",
  verified: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
};

const fmtSize = (b: number) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

const StaffDocumentReview = ({ userId, applicationId }: { userId: string; applicationId: string }) => {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listDocumentsForApplicant(userId)
      .then((rows) => {
        if (cancelled) return;
        setDocs(rows);
        setNotes(Object.fromEntries(rows.map((r) => [r.id, r.staff_note ?? ""])));
      })
      .catch((e) => toast.error("Failed to load documents", { description: e?.message }))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const setStatus = async (doc: DocumentRow, status: DocStatus) => {
    const note = notes[doc.id]?.trim();
    if (status === "rejected" && !note) {
      toast.error("Add a reason before rejecting this document");
      return;
    }
    setBusyId(doc.id);
    try {
      await updateDocumentStatus(doc.id, status, note || undefined);
      setDocs((prev) =>
        prev.map((d) => (d.id === doc.id ? { ...d, status, staff_note: note || null } : d)),
      );
      toast.success(status === "verified" ? "Document verified" : "Document rejected");
    } catch (e: any) {
      toast.error("Update failed", { description: e?.message });
    } finally {
      setBusyId(null);
    }
  };

  const open = async (doc: DocumentRow) => {
    try {
      const url = await getDocumentSignedUrl(doc.storage_path, 120);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast.error("Could not open file", { description: e?.message });
    }
  };

  return (
    <div className="mt-5 pt-4 border-t border-border">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <Paperclip className="w-3.5 h-3.5" /> Documents
        </label>
        <span className="text-[11px] text-muted-foreground">
          {docs.filter((d) => d.status === "verified").length}/{docs.length} verified
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading documents…
        </p>
      ) : docs.length === 0 ? (
        <p className="text-sm text-muted-foreground mt-3">This applicant has not uploaded any documents yet.</p>
      ) : (
        <div className="mt-3 space-y-3">
          {docs.map((d) => (
            <div key={d.id} className="bg-secondary/40 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{d.name}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {fmtSize(d.size_bytes)} · {new Date(d.created_at).toLocaleDateString()}
                    {d.application_id === applicationId ? " · this application" : ""}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full border shrink-0 ${docStatusStyles[d.status] ?? ""}`}>
                  {d.status}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => open(d)}>
                  <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                  disabled={busyId === d.id}
                  onClick={() => setStatus(d, "verified")}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verify
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25"
                  disabled={busyId === d.id}
                  onClick={() => setStatus(d, "rejected")}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                </Button>
                <Input
                  className="h-8 text-xs flex-1 min-w-[160px]"
                  placeholder="Note / reason for rejection"
                  value={notes[d.id] ?? ""}
                  onChange={(e) => setNotes((n) => ({ ...n, [d.id]: e.target.value }))}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDocumentReview;
