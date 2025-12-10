import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
