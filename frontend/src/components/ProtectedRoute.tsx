import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed, getRole } from "../auth";

type Role = "admin" | "team_member";

type Props = {
    children: ReactNode;
    requireRole?: Role;
};

export default function ProtectedRoute({ children, requireRole }: Props) {
    const authed = isAuthed();
    const location = useLocation();
    if (!authed) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    if (requireRole) {
        const role = getRole();
        if (role !== requireRole) {
            return <Navigate to="/dashboard" replace />;
        }
    }
    return <>{children}</>;
}
