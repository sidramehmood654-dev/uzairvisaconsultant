import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listApplicationsTool from "./tools/list-applications";
import getApplicationTool from "./tools/get-application";
import createApplicationTool from "./tools/create-application";
import updateApplicationStatusTool from "./tools/update-application-status";
import listDocumentsTool from "./tools/list-documents";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "uzair-visa-consutant",
  title: "Uzair_Visa_Consutant",
  version: "0.1.0",
  instructions:
    "Tools for Uzair Visa Consultancy. Read and create visa applications, inspect uploaded document records, and (for staff/admin) update application status. All access runs as the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listApplicationsTool,
    getApplicationTool,
    createApplicationTool,
    updateApplicationStatusTool,
    listDocumentsTool,
  ],
});
