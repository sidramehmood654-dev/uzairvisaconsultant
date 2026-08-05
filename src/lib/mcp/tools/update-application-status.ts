import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_application_status",
  title: "Update application status",
  description:
    "Change the status of a visa application. Only staff and admin users are permitted; clients are rejected by access rules.",
  inputSchema: {
    id: z.string().uuid().describe("Application id (UUID)."),
    status: z
      .enum(["pending", "under_review", "docs_missing", "approved", "rejected"])
      .describe("New status."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("visa_applications")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) {
      return {
        content: [{ type: "text", text: "Update did not apply — the application was not found or you lack permission." }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { application: data },
    };
  },
});
