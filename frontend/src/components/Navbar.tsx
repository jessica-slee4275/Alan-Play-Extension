import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "text-blue-600 font-bold" : "text-gray-600";

  return (
    <nav className="flex items-center gap-4 p-4 border-b bg-white shadow-sm">
      <Link to="/" className={`hover:underline ${isActive("/")}`}>
        Create Challenge
      </Link>
      <Link to="/list" className={`hover:underline ${isActive("/list")}`}>
        View Challenges
      </Link>
    </nav>
  );
}
