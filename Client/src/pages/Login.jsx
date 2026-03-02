import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      const role = res.data.user.role;
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "ORGANIZER") navigate("/organizer/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4"
      style={{ background: "linear-gradient(135deg, #FDF6E3 0%, #FFE0B2 100%)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🕉️</div>
          <h1 className="font-display text-3xl text-orange-900 font-bold">Welcome Back</h1>
          <p className="font-body text-gray-500 mt-1">Login to your DarshanEase account</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-5 font-body">
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Email Address</label>
              <input
                type="email" required
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Password</label>
              <input
                type="password" required
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full text-center py-3 text-base">
              {loading ? "Logging in..." : "Login 🙏"}
            </button>
          </form>

          <div className="om-divider mt-6">
            <span className="text-gray-400 font-body">or</span>
          </div>

          <p className="text-center font-body text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-600 hover:underline font-semibold">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
