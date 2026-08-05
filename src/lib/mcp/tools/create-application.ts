import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "create_application",
  title: "Create visa application",
  description: "Submit a new visa application for the signed-in user.",
  inputSchema: {
    full_name: z.string().trim().min(3).max(100).describe("Applicant full name."),
    passport_number: z
      .string()
      .trim()
      .min(6)
      .max(9)
      .regex(/^[A-Za-z0-9]+$/)
      .describe("Passport number, 6-9 alphanumeric characters."),
    destination_country: z
      .enum(["Italy", "Portugal", "Greece", "Spain"])
      .describe("Destination country."),
    visa_type: z
      .enum([
        "Study Visa",
        "Work Visa",
        "Family Reunion",
        "Tourist Visa",
        "Business Visa",
        "Residence Visa",
      ])
      .describe("Visa category."),
    travel_date: z.string().optional().describe("Intended travel date, YYYY-MM-DD (today or later)."),
    nationality: z.string().trim().max(60).optional(),
    purpose: z.string().trim().max(1000).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (input.travel_date) {
      const d = new Date(input.travel_date);
      const today = new Date(new Date().toDateString());
      if (isNaN(d.getTime()) || d < today || d.getFullYear() > new Date().getFullYear() + 5) {
        return {
          content: [{ type: "text", text: "travel_date must be today or later, within the next 5 years." }],
          isError: true,
        };
      }
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("visa_applications")
      .insert({
        full_name: input.full_name,
        passport_number: input.passport_number.toUpperCase(),
        destination_country: input.destination_country,
        visa_type: input.visa_type,
        travel_date: input.travel_date ?? null,
        nationality: input.nationality ?? null,
        purpose: input.purpose ?? null,
        user_id: ctx.getUserId(),
      })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { application: data },
    };
  },
});
