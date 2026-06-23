import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, AppRole } from "@/hooks/useUserRole";

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
    Verifying access…
  </div>
);

const RoleProtectedRoute = ({
  roles,
  children,
}: {
  roles: AppRole[];
  children: JSX.Element;
}) => {
  const { user, loading: authLoading } = useAuth();
  const { roles: userRoles, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) return <Loading />;
  if (!user) return <Navigate to="/admin" replace />;

  const allowed = roles.some((r) => userRoles.includes(r));
  if (!allowed) return <Navigate to="/admin" replace state={{ denied: true }} />;

  return children;
};

export default RoleProtectedRoute;
