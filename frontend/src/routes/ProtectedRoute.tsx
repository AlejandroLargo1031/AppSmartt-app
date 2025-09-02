import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { state } = useAuth();
  if (state.loading) return null;
  if (!state.isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
