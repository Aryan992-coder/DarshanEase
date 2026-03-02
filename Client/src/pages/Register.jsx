import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm]       = useState({ name: "", email: "", password: "", phone: "", role: "USER" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await registerUser(form);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "linear-gradient(135deg, #FDF6E3 0%, #FFE0B2 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🛕</div>
          <h1 className="font-display text-3xl text-orange-900 font-bold">Create Account</h1>
          <p className="font-body text-gray-500 mt-1">Join DarshanEase and book your divine visit</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-5 font-body">
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Full Name</label>
              <input type="text" required className="input-field" placeholder="Your full name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Email Address</label>
              <input type="email" required className="input-field" placeholder="you@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Phone Number</label>
              <input type="tel" className="input-field" placeholder="+91 98765 43210"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Password</label>
              <input type="password" required className="input-field" placeholder="Min 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Register As</label>
              <select className="input-field" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="USER">Devotee</option>
                <option value="ORGANIZER">Temple Organizer</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? "Creating account..." : "Register 🙏"}
            </button>
          </form>

          <div className="om-divider mt-6">
            <span className="text-gray-400 font-body">or</span>
          </div>

          <p className="text-center font-body text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 hover:underline font-semibold">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
