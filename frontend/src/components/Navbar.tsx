import { Link, useNavigate } from "react-router-dom";
import { isAuthed, logout, getRole } from "../auth";
import { useMemo } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const authed = isAuthed();
  const role = useMemo(() => getRole(), [authed]); // renew automatically if token changes
  const isAdmin = role === "admin";

  const onLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-4">
        <Link to="/dashboard" className="font-semibold text-indigo-600">Alan Play Extension</Link>

        {authed && isAdmin && (
          <>
            <Link to="/create-challenge" className="text-sm">Create Challenge</Link>
            <Link to="/list" className="text-sm">View Challenges</Link>
          </>
        )}

        <div className="ml-auto flex items-center gap-3">
          {authed && <span className="text-sm text-slate-600">{role}</span>}
          {authed ? (
            <button onClick={onLogout} className="rounded-xl bg-slate-100 px-3 py-1 text-sm hover:bg-slate-200">
              Logout
            </button>
          ) : (
            <Link to="/" className="text-sm underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}