import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? "text-blue-600 font-semibold border-b-2 border-blue-600" : "text-gray-600";

  return (
    <nav className="flex items-center space-x-6 px-6 py-4 bg-white border-b shadow-sm">
      <Link to="/" className={`hover:text-blue-500 ${isActive("/")}`}>
        ➕ Create Challenge
      </Link>
      <Link to="/list" className={`hover:text-blue-500 ${isActive("/list")}`}>
        📋 View Challenges
      </Link>
    </nav>
  );
}
