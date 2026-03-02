import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="mt-16" style={{ background: "#1A0A00" }}>
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-display text-yellow-400 text-lg mb-3">🕌 DarshanEase</h3>
        <p className="font-body text-orange-100 text-base leading-relaxed">
          Your trusted companion for seamless temple darshan ticket booking. Book your divine visit with ease.
        </p>
      </div>
      <div>
        <h4 className="font-display text-yellow-400 mb-3">Quick Links</h4>
        <ul className="space-y-2 font-body text-base">
          <li><Link to="/" className="text-orange-100 hover:text-yellow-400 transition">Home</Link></li>
          <li><Link to="/temples" className="text-orange-100 hover:text-yellow-400 transition">Temples</Link></li>
          <li><Link to="/login" className="text-orange-100 hover:text-yellow-400 transition">Login</Link></li>
          <li><Link to="/register" className="text-orange-100 hover:text-yellow-400 transition">Register</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-yellow-400 mb-3">Contact</h4>
        <p className="font-body text-orange-100 text-base">📧 support@darshanease.com</p>
        <p className="font-body text-orange-100 text-base mt-1">📞 +91 98765 43210</p>
      </div>
    </div>
    <div className="border-t border-orange-900 text-center py-4 font-body text-orange-300 text-sm">
      © {new Date().getFullYear()} DarshanEase. All rights reserved. 🙏
    </div>
  </footer>
);

export default Footer;
