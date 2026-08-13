import { supabase } from "@/integrations/supabase/client";

export type DocStatus = "received" | "pending" | "verified" | "rejected";

export interface DocumentRow {
  id: string;
  user_id: string;
  application_id: string | null;
  name: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string | null;
  status: string;
  staff_note: string | null;
  created_at: string;
  updated_at: string;
}

const BUCKET = "documents";

export async function uploadDocument(file: File, applicationId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  if (file.size > 10 * 1024 * 1024) throw new Error("File exceeds 10MB limit");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${user.id}/${Date.now()}_${safeName}`;

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw upErr;

  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      application_id: applicationId ?? null,
      name: file.name,
      storage_path: path,
      size_bytes: file.size,
      mime_type: file.type || null,
      status: "received",
    })
    .select()
    .single();
  if (error) {
    // Roll back the storage upload if metadata insert fails
    await supabase.storage.from(BUCKET).remove([path]);
    throw error;
  }
  return data as DocumentRow;
}

export async function listMyDocuments() {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DocumentRow[];
}

export async function deleteDocument(doc: DocumentRow) {
  await supabase.storage.from(BUCKET).remove([doc.storage_path]);
  const { error } = await supabase.from("documents").delete().eq("id", doc.id);
  if (error) throw error;
}

export async function getDocumentSignedUrl(path: string, expiresIn = 60) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function updateDocumentStatus(id: string, status: DocStatus, note?: string) {
  const { error } = await supabase
    .from("documents")
    .update({ status, staff_note: note ?? null })
    .eq("id", id);
  if (error) throw error;
}

// Staff/Admin: all documents belonging to an applicant (RLS allows staff/admin)
export async function listDocumentsForApplicant(userId: string) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DocumentRow[];
}
