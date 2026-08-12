import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const enquiryStatuses = ["new", "contacted", "in_progress", "closed"] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long")
    .regex(/^[A-Za-z][A-Za-z\s.'-]+$/, "Name may only contain letters, spaces, . ' -"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long")
    .regex(/^[+0-9][0-9\s()-]{6,}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  country: z.string().trim().max(60).optional().or(z.literal("")),
  visa_type: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().max(2000, "Message is too long").optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export async function createEnquiry(input: unknown) {
  const parsed = enquirySchema.parse(input);
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("contact_enquiries")
    .insert({
      user_id: user?.id ?? null,
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || null,
      country: parsed.country || null,
      visa_type: parsed.visa_type || null,
      message: parsed.message || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listEnquiries() {
  const { data, error } = await supabase
    .from("contact_enquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  const { data, error } = await supabase
    .from("contact_enquiries")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEnquiryNote(id: string, staff_note: string) {
  const { data, error } = await supabase
    .from("contact_enquiries")
    .update({ staff_note })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}
