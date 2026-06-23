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

              {/* Client portal (protected) */}
              <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
              <Route path="/client/apply" element={<ProtectedRoute><ClientApply /></ProtectedRoute>} />
              <Route path="/client/documents" element={<ProtectedRoute><ClientDocuments /></ProtectedRoute>} />
              <Route path="/client/track" element={<ProtectedRoute><ClientTrack /></ProtectedRoute>} />
              <Route path="/client/history" element={<ProtectedRoute><ClientHistory /></ProtectedRoute>} />

              {/* Staff */}
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/staff/applications" element={<StaffApplications />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/enquiries" element={<AdminEnquiries />} />
              <Route path="/admin/staff" element={<AdminStaff />} />
              <Route path="/admin/countries" element={<AdminCountries />} />
              <Route path="/admin/documents" element={<AdminDocuments />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/settings" element={<AdminSettings />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
