# Project technical decisions

- Vercel routes extensionless non-API paths to the SPA entry point so React Router pages support direct visits and refreshes without capturing assets or API endpoints.
- Validate uploaded document type, size, signature, and local content before Storage calls; keep applicant files on-device during inspection to avoid sending sensitive records to a separate analysis service.