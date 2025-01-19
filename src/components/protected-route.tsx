import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const ens = sessionStorage.getItem("ens");

    if (!ens && location.pathname !== "/login") {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}