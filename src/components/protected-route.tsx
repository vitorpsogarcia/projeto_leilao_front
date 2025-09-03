import ROUTES from "../config/routes.config";
import useUserStore from "../stores/userStore";
import { Navigate } from "react-router";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserStore();

  if (!user?.email || !user?.id) {
    return <Navigate to={`/${ROUTES.AUTH}/${ROUTES.LOGIN}`} replace />;
  }

  return <>{children}</>;
};
