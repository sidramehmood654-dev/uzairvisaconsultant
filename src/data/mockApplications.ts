// Shared mock dataset used across Client, Staff and Admin views.
// Replace with real data via Lovable Cloud later.

export type AppStatus = "Submitted" | "Under Review" | "Docs Missing" | "Approved" | "Rejected";

export interface Document {
  name: string;
  status: "Pending" | "Received" | "Verified" | "Rejected";
  uploadedAt?: string;
}

export interface Application {
  id: string;
  client: string;
  email: string;
  phone: string;
  country: string;
  flag: string;
  visa: string;
  travel: string;
  submitted: string;
  status: AppStatus;
  consultant: string;
  fee: number;
  paid: number;
  documents: Document[];
  notes: string;
  timeline: { label: string; date: string; done: boolean }[];
}

export const applications: Application[] = [
  {
    id: "APP-2026-127",
    client: "Sidra Mehmood",
    email: "sidra.m@example.com",
    phone: "+92 300 1234567",
    country: "Italy",
    flag: "🇮🇹",
    visa: "Study Visa",
    travel: "Sep 1, 2026",
    submitted: "Apr 12, 2026",
    status: "Under Review",
    consultant: "Sidra Mehmood",
    fee: 1200,
    paid: 600,
    documents: [
      { name: "Passport Copy", status: "Verified", uploadedAt: "Apr 10" },
      { name: "Admission Letter", status: "Verified", uploadedAt: "Apr 11" },
      { name: "Bank Statement", status: "Received", uploadedAt: "Apr 12" },
      { name: "Police Clearance", status: "Pending" },
    ],
    notes: "Strong applicant, admission to Sapienza University Rome confirmed.",
    timeline: [
      { label: "Application Submitted", date: "Apr 12, 2026", done: true },
      { label: "Documents Verification", date: "Apr 18, 2026", done: true },
      { label: "Consulate Submission", date: "May 5, 2026", done: false },
      { label: "Decision", date: "Jun 10, 2026", done: false },
    ],
  },
  {
    id: "APP-2026-122",
    client: "Omar Khalid",
    email: "omar.k@example.com",
    phone: "+92 321 7654321",
    country: "Spain",
    flag: "🇪🇸",
    visa: "Work Visa",
    travel: "Jul 15, 2026",
    submitted: "Mar 28, 2026",
    status: "Docs Missing",
    consultant: "Sidra Mehmood",
    fee: 1500,
    paid: 750,
    documents: [
      { name: "Passport Copy", status: "Verified", uploadedAt: "Mar 26" },
      { name: "Employment Contract", status: "Verified", uploadedAt: "Mar 27" },
      { name: "Medical Certificate", status: "Pending" },
      { name: "Apostilled Degree", status: "Pending" },
    ],
    notes: "Awaiting medical certificate and apostilled degree from client.",
    timeline: [
      { label: "Application Submitted", date: "Mar 28, 2026", done: true },
      { label: "Documents Verification", date: "—", done: false },
      { label: "Consulate Submission", date: "—", done: false },
      { label: "Decision", date: "—", done: false },
    ],
  },
  {
    id: "APP-2026-119",
    client: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    phone: "+92 333 9988776",
    country: "Portugal",
    flag: "🇵🇹",
    visa: "Business Visa",
    travel: "Aug 10, 2026",
    submitted: "Feb 18, 2026",
    status: "Approved",
    consultant: "Bilal Ahmed",
    fee: 2200,
    paid: 2200,
    documents: [
      { name: "Passport Copy", status: "Verified", uploadedAt: "Feb 16" },
      { name: "Investment Proof", status: "Verified", uploadedAt: "Feb 17" },
      { name: "Tax Records", status: "Verified", uploadedAt: "Feb 18" },
    ],
    notes: "Approved by SEF Portugal. Residence card scheduled for pickup.",
    timeline: [
      { label: "Application Submitted", date: "Feb 18, 2026", done: true },
      { label: "Documents Verification", date: "Feb 25, 2026", done: true },
      { label: "Consulate Submission", date: "Mar 12, 2026", done: true },
      { label: "Decision: Approved", date: "Apr 30, 2026", done: true },
    ],
  },
  {
    id: "APP-2026-116",
    client: "Hira Sheikh",
    email: "hira.sheikh@example.com",
    phone: "+92 345 4561230",
    country: "Greece",
    flag: "🇬🇷",
    visa: "Tourist Visa",
    travel: "Jun 20, 2026",
    submitted: "Apr 2, 2026",
    status: "Submitted",
    consultant: "Ayesha Tariq",
    fee: 800,
    paid: 800,
    documents: [
      { name: "Passport Copy", status: "Verified", uploadedAt: "Mar 30" },
      { name: "Hotel Booking", status: "Verified", uploadedAt: "Mar 31" },
      { name: "Travel Insurance", status: "Verified", uploadedAt: "Apr 1" },
      { name: "Bank Statement", status: "Verified", uploadedAt: "Apr 2" },
    ],
    notes: "Submitted to Greek consulate Islamabad. Awaiting decision.",
    timeline: [
      { label: "Application Submitted", date: "Apr 2, 2026", done: true },
      { label: "Documents Verification", date: "Apr 8, 2026", done: true },
      { label: "Consulate Submission", date: "Apr 20, 2026", done: true },
      { label: "Decision", date: "—", done: false },
    ],
  },
  {
    id: "APP-2026-110",
    client: "Usman Raza",
    email: "usman.raza@example.com",
    phone: "+92 312 1122334",
    country: "Italy",
    flag: "🇮🇹",
    visa: "Family Reunion",
    travel: "Oct 5, 2026",
    submitted: "Mar 15, 2026",
    status: "Under Review",
    consultant: "Sidra Mehmood",
    fee: 1100,
    paid: 1100,
    documents: [
      { name: "Marriage Certificate", status: "Verified" },
      { name: "Sponsor Income Proof", status: "Verified" },
      { name: "Housing Contract", status: "Received" },
    ],
    notes: "Sponsor based in Milan, all paperwork in order.",
    timeline: [
      { label: "Application Submitted", date: "Mar 15, 2026", done: true },
      { label: "Documents Verification", date: "Mar 22, 2026", done: true },
      { label: "Consulate Submission", date: "—", done: false },
      { label: "Decision", date: "—", done: false },
    ],
  },
];

// Subset shown on the client portal (only Sidra's own apps as the demo user)
export const myApplications = applications.filter((a) => a.client === "Sidra Mehmood");
