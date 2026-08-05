import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_documents",
  title: "List uploaded documents",
  description:
    "List document records visible to the signed-in user (metadata only, no file contents). Optionally filter by application.",
  inputSchema: {
    application_id: z.string().uuid().optional().describe("Only documents linked to this application."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ application_id, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("documents")
      .select("id, file_name, status, application_id, created_at")
      .order("created_at", { ascending: false })
      .limit(limit ?? 25);
    if (application_id) query = query.eq("application_id", application_id);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { documents: data ?? [] },
    };
  },
});
