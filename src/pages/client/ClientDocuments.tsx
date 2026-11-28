import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Download, FileText, Loader2, Trash2, Upload, X } from "lucide-react";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  DocumentRow,
  deleteDocument,
  getDocumentSignedUrl,
  listMyDocuments,
  uploadDocument,
} from "@/lib/documents";
import {
  getUploadCategory,
  inspectUploadFile,
  UPLOAD_CATEGORIES,
  type UploadCategory,
  type UploadCheckStatus,
} from "@/lib/upload-validation";

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

interface QueuedUpload {
  id: string;
  file: File;
  category: UploadCategory;
  status: UploadCheckStatus | "checking";
  message: string;
  confirmedType: boolean;
}

const ClientDocuments = () => {
  const [docs, setDocs] = useState<DocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [drag, setDrag] = useState(false);
  const [selectedType, setSelectedType] = useState<UploadCategory | "">("");
  const [queuedFiles, setQueuedFiles] = useState<QueuedUpload[]>([]);
  const [photoOwnConfirmed, setPhotoOwnConfirmed] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

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

  const handleFileSelection = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0 || checking || uploading) return;
    if (!selectedType) {
      setUploadMessage("Choose the document type before selecting files.");
      return;
    }

    const category = selectedType;
    const incoming = Array.from(files);
    setUploadMessage("");
    if (category === "applicant-photo" && incoming.length > 1) {
      setQueuedFiles([{
        id: `${Date.now()}-multiple-photo-files`,
        file: incoming[0],
        category,
        status: "invalid",
        message: "Upload one applicant photo at a time. Choose a single JPG or PNG image.",
        confirmedType: false,
      }]);
      setPhotoOwnConfirmed(false);
      return;
    }

    const entries: QueuedUpload[] = incoming.map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
      file,
      category,
      status: "checking",
      message: "Checking this file on your device…",
      confirmedType: false,
    }));

    setQueuedFiles((current) => category === "applicant-photo" ? entries : [...current, ...entries]);
    if (category === "applicant-photo") setPhotoOwnConfirmed(false);
    setChecking(true);
    try {
      for (const entry of entries) {
        const result = await inspectUploadFile(entry.file, category);
        setQueuedFiles((current) => current.map((item) => item.id === entry.id ? { ...item, ...result } : item));
      }
    } finally {
      setChecking(false);
    }
  };

  const removeQueuedFile = (id: string) => {
    setQueuedFiles((current) => current.filter((item) => item.id !== id));
    setUploadMessage("");
  };

  const canUpload = queuedFiles.length > 0 && queuedFiles.every((item) =>
    item.status === "valid" || (item.status === "needs-confirmation" && item.confirmedType),
  ) && (selectedType !== "applicant-photo" || photoOwnConfirmed);

  const handleUpload = async () => {
    if (!canUpload) {
      setUploadMessage(selectedType === "applicant-photo" && !photoOwnConfirmed
        ? "Confirm that this is your own photo before uploading."
        : "Remove or replace files that did not pass the checks before uploading.");
      return;
    }

    setUploading(true);
    const completedIds: string[] = [];
    for (const item of queuedFiles) {
      try {
        await uploadDocument(item.file, undefined, item.category);
        completedIds.push(item.id);
      } catch (error) {
        toast.error(`${item.file.name}: ${error instanceof Error ? error.message : "Upload failed"}`);
      }
    }

    if (completedIds.length > 0) {
      setQueuedFiles((current) => current.filter((item) => !completedIds.includes(item.id)));
      toast.success(`${completedIds.length} file(s) uploaded`);
      if (selectedType === "applicant-photo") setPhotoOwnConfirmed(false);
      await refresh();
    }
    setUploading(false);
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
  const selectedCategory = selectedType ? getUploadCategory(selectedType) : undefined;

  return (
    <ClientLayout title="My Documents" subtitle="Upload and manage your application documents">
      <div className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="Total Documents" value={docs.length} icon={FileText} accent="border-t-primary" />
          <Stat label="Verified" value={verified} icon={CheckCircle2} accent="border-t-emerald-500" />
          <Stat label="Pending Review" value={pending} icon={Clock} accent="border-t-amber-500" />
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="document-type">What are you uploading?</Label>
              <Select
                value={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value as UploadCategory);
                  setQueuedFiles([]);
                  setPhotoOwnConfirmed(false);
                  setUploadMessage("");
                }}
                disabled={checking || uploading}
              >
                <SelectTrigger id="document-type" aria-label="Document type">
                  <SelectValue placeholder="Choose a document type" />
                </SelectTrigger>
                <SelectContent>
                  {UPLOAD_CATEGORIES.map((category) => (
                    <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-secondary/40 p-3 text-sm text-muted-foreground" aria-live="polite">
              {selectedCategory ? (
                <>
                  <p>{selectedCategory.example}</p>
                  <p className="mt-2 text-xs">Accepted: {selectedCategory.formats} · maximum 10 MB per file</p>
                  {selectedType === "applicant-photo" ? (
                    <p className="mt-2 text-xs">A face check runs on this device. It checks for a visible human face, not identity; your photo is not uploaded unless the check passes and you confirm it is yours.</p>
                  ) : (
                    <p className="mt-2 text-xs">Document text is checked on this device before upload. Your file is not sent to a separate analysis service.</p>
                  )}
                </>
              ) : (
                <p>Choose a document type to see its accepted formats, size limit and an example.</p>
              )}
            </div>

            {selectedType === "applicant-photo" && (
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <Checkbox
                  id="photo-is-mine"
                  checked={photoOwnConfirmed}
                  onCheckedChange={(checked) => setPhotoOwnConfirmed(checked === true)}
                  disabled={checking || uploading}
                />
                <Label htmlFor="photo-is-mine" className="cursor-pointer text-sm leading-5">
                  I confirm this is my own photo and it shows me.
                </Label>
              </div>
            )}

            <div
              onDragOver={(event) => { event.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDrag(false);
                void handleFileSelection(event.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-xl p-7 text-center transition-colors ${
                drag ? "border-primary bg-primary/5" : "border-border bg-background"
              }`}
            >
              {checking || uploading ? (
                <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
              ) : (
                <Upload className="w-10 h-10 text-primary mx-auto mb-3" />
              )}
              <p className="text-foreground font-medium">
                {checking ? "Checking files on this device…" : uploading ? "Uploading…" : "Drag files here"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedCategory ? `${selectedCategory.formats} · max 10 MB each` : "Choose a document type first"}
              </p>
              <div className="mt-4">
                <Button asChild variant="outline" disabled={!selectedType || checking || uploading}>
                  <label htmlFor="client-document-files" className="cursor-pointer">
                    <Upload className="w-4 h-4" /> Browse files
                  </label>
                </Button>
                <input
                  id="client-document-files"
                  type="file"
                  accept={selectedCategory?.accept ?? ".pdf,.jpg,.jpeg,.png"}
                  multiple={selectedType !== "applicant-photo"}
                  disabled={!selectedType || checking || uploading}
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.currentTarget.files ?? []);
                    event.currentTarget.value = "";
                    void handleFileSelection(files);
                  }}
                />
              </div>
            </div>

            {uploadMessage && <p className="text-sm text-destructive" role="alert">{uploadMessage}</p>}

            {queuedFiles.length > 0 && (
              <div className="space-y-3" aria-live="polite">
                {queuedFiles.map((item) => {
                  const itemCategory = getUploadCategory(item.category);
                  const messageTone = item.status === "invalid"
                    ? "text-destructive"
                    : item.status === "needs-confirmation"
                    ? "text-amber-500"
                    : item.status === "valid"
                    ? "text-emerald-500"
                    : "text-muted-foreground";
                  return (
                    <div key={item.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{item.file.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {itemCategory?.label} · {formatSize(item.file.size)}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          aria-label={`Remove ${item.file.name}`}
                          onClick={() => removeQueuedFile(item.id)}
                          disabled={uploading}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className={`mt-2 flex items-start gap-2 text-xs ${messageTone}`}>
                        {item.status === "valid" ? (
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : item.status === "invalid" ? (
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : item.status === "needs-confirmation" ? (
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        ) : (
                          <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                        )}
                        <p>{item.message}</p>
                      </div>
                      {item.status === "needs-confirmation" && (
                        <div className="mt-3 flex items-start gap-3">
                          <Checkbox
                            id={`confirm-type-${item.id}`}
                            checked={item.confirmedType}
                            onCheckedChange={(checked) => setQueuedFiles((current) => current.map((entry) =>
                              entry.id === item.id ? { ...entry, confirmedType: checked === true } : entry,
                            ))}
                            disabled={checking || uploading}
                          />
                          <Label htmlFor={`confirm-type-${item.id}`} className="cursor-pointer text-xs leading-5">
                            I checked this file; it is the selected document type.
                          </Label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={!canUpload || checking || uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Upload checked files"}
              </Button>
            </div>
          </div>
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
