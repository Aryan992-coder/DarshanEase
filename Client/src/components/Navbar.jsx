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
    return "/my-bookings";
  };

  return (
    <nav className="bg-temple-brown shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🕌</span>
          <span className="text-gold font-display text-xl font-bold tracking-wider">DarshanEase</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-orange-100 hover:text-gold transition font-body text-lg">Home</Link>
          <Link to="/temples" className="text-orange-100 hover:text-gold transition font-body text-lg">Temples</Link>
          {user && (
            <>
              <Link to={getDashboardLink()} className="text-orange-100 hover:text-gold transition font-body text-lg">Dashboard</Link>
              <Link to="/donate" className="text-orange-100 hover:text-gold transition font-body text-lg">Donate</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-orange-200 font-body text-lg">🙏 {user.name}</span>
              <button onClick={handleLogout} className="btn-secondary text-sm border-orange-300 text-orange-300 hover:bg-orange-700 hover:border-orange-700">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-orange-200 hover:text-gold font-body text-lg transition">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Register</Link>
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
        <div className="md:hidden bg-temple px-4 pb-4 flex flex-col gap-3 border-t border-orange-800">
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
