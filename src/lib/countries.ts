import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export interface Country {
  id: string;
  name: string;
  flag: string;
  enabled: boolean;
  visa_types: string[];
  fee: number;
  processing_days: string;
  sort_order: number;
}

export const countrySchema = z.object({
  name: z.string().trim().min(2, "Country name is required").max(60),
  flag: z.string().trim().max(8).optional().or(z.literal("")),
  visa_types: z.array(z.string().trim().min(1).max(40)).max(20),
  fee: z.number().min(0, "Fee cannot be negative").max(1000000),
  processing_days: z.string().trim().max(40).optional().or(z.literal("")),
  enabled: z.boolean(),
});

export type CountryInput = z.infer<typeof countrySchema>;

export async function listCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Country[];
}

export async function listEnabledCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from("countries")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Country[];
}

export async function createCountry(input: unknown): Promise<Country> {
  const parsed = countrySchema.parse(input);
  const { data, error } = await supabase
    .from("countries")
    .insert({
      name: parsed.name,
      flag: parsed.flag || "",
      visa_types: parsed.visa_types,
      fee: parsed.fee,
      processing_days: parsed.processing_days || "",
      enabled: parsed.enabled,
      sort_order: 99,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Country;
}

export async function updateCountry(id: string, patch: Partial<CountryInput>): Promise<void> {
  const { error } = await supabase.from("countries").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteCountry(id: string): Promise<void> {
  const { error } = await supabase.from("countries").delete().eq("id", id);
  if (error) throw error;
}
