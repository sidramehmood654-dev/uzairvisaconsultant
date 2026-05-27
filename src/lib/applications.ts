import { supabase } from "@/integrations/supabase/client";

export type VisaApplicationInput = {
  full_name: string;
  passport_number: string;
  destination_country: string;
  visa_type: string;
  travel_date?: string | null;
  duration?: string | null;
  dob?: string | null;
  nationality?: string | null;
  address?: string | null;
  occupation?: string | null;
  employer?: string | null;
  purpose?: string | null;
};

// POST /api/applications — create
export async function createApplication(input: VisaApplicationInput) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("visa_applications")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// GET /api/applications — list for current user (RLS scopes to own rows)
export async function listMyApplications() {
  const { data, error } = await supabase
    .from("visa_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// GET /api/applications/[id]
export async function getApplication(id: string) {
  const { data, error } = await supabase
    .from("visa_applications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
