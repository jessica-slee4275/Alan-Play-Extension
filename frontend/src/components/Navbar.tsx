import { Link, useNavigate } from "react-router-dom";
import { isAuthed, logout, getRole } from "../auth";
import { useMemo } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const authed = isAuthed();
  const role = useMemo(() => getRole(), [authed]); // renew automatically if token changes

  const onLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isAdmin = role === "admin";

  return (
    <nav className="flex items-center gap-4 p-3 border-b bg-white">
      <Link to="/dashboard" className="font-semibold">Alan Play Extension</Link>
      {/* admin only */}
      {authed && isAdmin && (
        <>
          <Link to="/create-challenge">Create Challenge</Link>
          <Link to="/list">View Challenges</Link>
        </>
      )}

      <div className="ml-auto flex items-center gap-3">
        {authed ? (
          <>
            <span className="text-sm text-slate-600">{role}</span>
            <button onClick={onLogout} className="underline">Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </nav>
  );
}
