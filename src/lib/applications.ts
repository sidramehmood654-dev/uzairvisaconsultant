import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// ---------- Validation schema (shared by client + server-side via RLS) ----------
export const visaApplicationSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters")
    .max(100, "Full name is too long")
    .regex(/^[A-Za-z][A-Za-z\s.'-]+$/, "Full name may only contain letters, spaces, . ' -"),
  passport_number: z
    .string()
    .trim()
    .min(6, "Passport number must be 6–9 characters")
    .max(9, "Passport number must be 6–9 characters")
    .regex(/^[A-Z0-9]+$/i, "Passport number may only contain letters and digits"),
  destination_country: z.enum(["Italy", "Portugal", "Greece", "Spain"], {
    errorMap: () => ({ message: "Choose a destination country" }),
  }),
  visa_type: z.enum(
    ["Study Visa", "Work Visa", "Family Reunion", "Tourist Visa", "Business Visa", "Residence Visa"],
    { errorMap: () => ({ message: "Choose a visa type" }) },
  ),
  travel_date: z
    .string()
    .optional()
    .nullable()
    .refine(
      (v) => !v || new Date(v) >= new Date(new Date().toDateString()),
      "Travel date must be today or in the future",
    ),
  duration: z.string().trim().max(60).optional().nullable(),
  dob: z
    .string()
    .optional()
    .nullable()
    .refine((v) => {
      if (!v) return true;
      const d = new Date(v);
      if (isNaN(d.getTime())) return false;
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return age >= 16 && age <= 100;
    }, "Date of birth must make the applicant between 16 and 100 years old"),
  nationality: z.string().trim().max(60).optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  occupation: z.string().trim().max(100).optional().nullable(),
  employer: z.string().trim().max(120).optional().nullable(),
  purpose: z.string().trim().max(1000).optional().nullable(),
});

export type VisaApplicationInput = z.infer<typeof visaApplicationSchema>;

// POST /api/applications — create
export async function createApplication(input: VisaApplicationInput) {
  const parsed = visaApplicationSchema.parse(input); // throws ZodError if invalid
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const payload = {
    ...parsed,
    passport_number: parsed.passport_number.toUpperCase(),
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("visa_applications")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// GET /api/applications — list current user's apps (RLS scopes to own rows)
export async function listMyApplications() {
  const { data, error } = await supabase
    .from("visa_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// GET /api/applications — list ALL (staff/admin only, enforced by RLS)
export async function listAllApplications() {
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
