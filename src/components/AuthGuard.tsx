import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  roles?: ("creator" | "consumer")[];
};

/**
 * Protects a route.
 * - If no token → redirects to /login (keeps intended redirect).
 * - If roles provided → checks user.role.
 */
export default function AuthGuard({ children, roles }: Props) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (!accessToken || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ redirectTo: location.pathname }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) {
    // no permission
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
}
