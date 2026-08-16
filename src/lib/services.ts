import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  slug: string;
  title: string;
  icon: string;
  summary: string;
  description: string;
  features: string[];
  countries: string[];
  image_key: string;
  enabled: boolean;
  sort_order: number;
}

export async function listEnabledServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("enabled", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Service[];
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("enabled", true)
    .maybeSingle();
  if (error) throw error;
  return (data as Service) ?? null;
}
