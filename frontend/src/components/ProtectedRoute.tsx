import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "../auth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const authed = isAuthed();
    const location = useLocation();
    if (!authed) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    return <>{children}</>;
}
