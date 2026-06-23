import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

// Access control is enforced by <RoleProtectedRoute roles={["admin"]}> in App.tsx
const AdminLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <AdminSidebar />
    <main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
  </div>
);

export default AdminLayout;
