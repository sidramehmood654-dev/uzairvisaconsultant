import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import DestinationsPage from "./pages/DestinationsPage";
import ProcessPage from "./pages/ProcessPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEnquiries from "./pages/AdminEnquiries";
import AdminSettings from "./pages/AdminSettings";
import AdminApplications from "./pages/AdminApplications";
import AdminStaff from "./pages/AdminStaff";
import AdminCountries from "./pages/AdminCountries";
import AdminDocuments from "./pages/AdminDocuments";
import AdminPayments from "./pages/AdminPayments";
import UserSignup from "./pages/UserSignup";
import UserLogin from "./pages/UserLogin";
import StaffDashboard from "./pages/StaffDashboard";
import StaffApplications from "./pages/StaffApplications";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientApply from "./pages/client/ClientApply";
import ClientDocuments from "./pages/client/ClientDocuments";
import ClientTrack from "./pages/client/ClientTrack";
import ClientHistory from "./pages/client/ClientHistory";
import OAuthConsent from "./pages/OAuthConsent";
import FaqPage from "./pages/FaqPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import RefundPage from "./pages/RefundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Index />} />
              <Route path="/signup" element={<UserSignup />} />
              <Route path="/login" element={<UserLogin />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/refund" element={<RefundPage />} />
              <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

              {/* Client portal (protected) */}
              <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
              <Route path="/client/apply" element={<ProtectedRoute><ClientApply /></ProtectedRoute>} />
              <Route path="/client/documents" element={<ProtectedRoute><ClientDocuments /></ProtectedRoute>} />
              <Route path="/client/track" element={<ProtectedRoute><ClientTrack /></ProtectedRoute>} />
              <Route path="/client/history" element={<ProtectedRoute><ClientHistory /></ProtectedRoute>} />

              {/* Staff (role: staff or admin) */}
              <Route path="/staff" element={<RoleProtectedRoute roles={["staff", "admin"]}><StaffDashboard /></RoleProtectedRoute>} />
              <Route path="/staff/applications" element={<RoleProtectedRoute roles={["staff", "admin"]}><StaffApplications /></RoleProtectedRoute>} />

              {/* Admin login is public; everything else requires admin role */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<RoleProtectedRoute roles={["admin"]}><AdminDashboard /></RoleProtectedRoute>} />
              <Route path="/admin/applications" element={<RoleProtectedRoute roles={["admin"]}><AdminApplications /></RoleProtectedRoute>} />
              <Route path="/admin/enquiries" element={<RoleProtectedRoute roles={["admin"]}><AdminEnquiries /></RoleProtectedRoute>} />
              <Route path="/admin/staff" element={<RoleProtectedRoute roles={["admin"]}><AdminStaff /></RoleProtectedRoute>} />
              <Route path="/admin/countries" element={<RoleProtectedRoute roles={["admin"]}><AdminCountries /></RoleProtectedRoute>} />
              <Route path="/admin/documents" element={<RoleProtectedRoute roles={["admin"]}><AdminDocuments /></RoleProtectedRoute>} />
              <Route path="/admin/payments" element={<RoleProtectedRoute roles={["admin"]}><AdminPayments /></RoleProtectedRoute>} />
              <Route path="/admin/settings" element={<RoleProtectedRoute roles={["admin"]}><AdminSettings /></RoleProtectedRoute>} />


              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
