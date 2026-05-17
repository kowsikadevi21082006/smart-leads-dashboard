import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <Loader fullScreen label="Checking your session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
