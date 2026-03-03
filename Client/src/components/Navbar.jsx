import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/admin/dashboard";
    if (user?.role === "ORGANIZER") return "/organizer/dashboard";
    return "/dashboard";
  };

  return (
    <nav style={{ background: "#1A0A00" }} className="shadow-lg sticky top-0 z-50 border-b border-orange-900">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🕌</span>
          <span className="font-display text-xl font-bold tracking-wider" style={{ color: "#D4AF37" }}>
            DarshanEase
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-body text-lg text-orange-100 hover:text-yellow-400 transition">Home</Link>
          <Link to="/temples" className="font-body text-lg text-orange-100 hover:text-yellow-400 transition">Temples</Link>
          {user && (
            <>
              <Link to={getDashboardLink()} className="font-body text-lg text-orange-100 hover:text-yellow-400 transition">Dashboard</Link>
              <Link to="/donate" className="font-body text-lg text-orange-100 hover:text-yellow-400 transition">Donate</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="font-body text-base text-orange-200">🙏 {user.name}</span>
              <button onClick={handleLogout}
                className="font-display text-sm px-4 py-2 rounded border border-orange-400 text-orange-300 hover:bg-orange-800 transition">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="font-body text-lg text-orange-100 hover:text-yellow-400 transition">Login</Link>
              <Link to="/register"
                className="font-display text-sm px-5 py-2 rounded bg-orange-600 text-white hover:bg-orange-700 transition shadow">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-orange-100 text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ background: "#2A0F00" }} className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-orange-900">
          <Link to="/" className="text-orange-100 font-body text-lg py-1" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/temples" className="text-orange-100 font-body text-lg py-1" onClick={() => setMenuOpen(false)}>Temples</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} className="text-orange-100 font-body text-lg py-1" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/donate" className="text-orange-100 font-body text-lg py-1" onClick={() => setMenuOpen(false)}>Donate</Link>
              <button onClick={handleLogout} className="text-left text-orange-300 font-body text-lg py-1">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-orange-100 font-body text-lg py-1" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="text-orange-100 font-body text-lg py-1" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
