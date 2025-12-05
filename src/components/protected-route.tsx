import ROUTES from "../config/routes.config";
import useUserStore from "../stores/userStore";
import { Navigate, Outlet } from "react-router";
import { TipoPerfil } from "../models/user";

type ProtectedRouteProps = {
  children?: React.ReactNode;
  requiredRoles?: TipoPerfil[];
};

export const ProtectedRoute = ({
  children,
  requiredRoles,
}: ProtectedRouteProps) => {
  const { user } = useUserStore();

  if (!user?.email || !user?.id) {
    return <Navigate to={`/${ROUTES.AUTH}/${ROUTES.LOGIN}`} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = user.perfis.some((perfil) =>
      requiredRoles.includes(perfil)
    );

    if (!hasRequiredRole) {
      return <Navigate to={`/${ROUTES.HOME}`} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};
