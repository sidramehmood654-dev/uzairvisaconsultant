import { GraduationCap, Heart, Briefcase, Plane, FileCheck, Building2, MapPin, LucideIcon } from "lucide-react";
import italyImg from "@/assets/italy.jpg";
import portugalImg from "@/assets/portugal.jpg";
import greeceImg from "@/assets/greece.jpg";
import spainImg from "@/assets/spain.jpg";
import studyImg from "@/assets/study-visa.jpg";
import familyImg from "@/assets/family-visa.jpg";
import workImg from "@/assets/work-visa.jpg";
import touristImg from "@/assets/tourist-visa.jpg";
import residenceImg from "@/assets/residence-visa.jpg";
import businessImg from "@/assets/business-visa.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const IMAGES: Record<string, string> = {
  italy: italyImg,
  portugal: portugalImg,
  greece: greeceImg,
  spain: spainImg,
  "study-visa": studyImg,
  "family-visa": familyImg,
  "work-visa": workImg,
  "tourist-visa": touristImg,
  "residence-visa": residenceImg,
  "business-visa": businessImg,
};

/** Resolve a database image_key (or slug) to a bundled image, falling back to a generic hero. */
export const imageFor = (key?: string | null, fallbackKey?: string | null): string =>
  (key && IMAGES[key]) || (fallbackKey && IMAGES[fallbackKey]) || heroBg;

const ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Heart,
  Briefcase,
  Plane,
  FileCheck,
  Building2,
  MapPin,
};

export const iconFor = (key?: string | null): LucideIcon => (key && ICONS[key]) || FileCheck;
