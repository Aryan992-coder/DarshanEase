import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyBookings, getMyDonations } from "../api/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings]   = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getMyBookings(), getMyDonations()])
      .then(([bRes, dRes]) => {
        setBookings(bRes.data.data);
        setDonations(dRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const confirmed  = bookings.filter((b) => b.status === "CONFIRMED");
  const cancelled  = bookings.filter((b) => b.status === "CANCELLED");
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  if (loading) return (
    <div className="text-center py-32 text-orange-600 font-display text-xl animate-pulse">
      Loading your dashboard... 🙏
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="py-10 px-6" style={{ background: "linear-gradient(135deg, #3D1C02, #6B0F1A)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="font-body text-orange-300 text-lg">Welcome back,</p>
          <h1 className="font-display text-4xl text-gold font-bold mt-1">🙏 {user?.name}</h1>
          <p className="font-body text-orange-400 mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { label: "Total Bookings",     value: bookings.length,   icon: "🎟️" },
            { label: "Confirmed",          value: confirmed.length,  icon: "✅" },
            { label: "Cancelled",          value: cancelled.length,  icon: "❌" },
            { label: "Total Donated",      value: `₹${totalDonated}`, icon: "🪔" },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="font-display text-2xl text-orange-800 font-bold">{stat.value}</div>
              <div className="font-body text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Link to="/temples" className="card p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-3">🛕</div>
            <h3 className="font-display text-orange-800 font-semibold">Browse Temples</h3>
            <p className="font-body text-gray-500 text-sm mt-1">Find and book darshan slots</p>
          </Link>
          <Link to="/my-bookings" className="card p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-3">🎟️</div>
            <h3 className="font-display text-orange-800 font-semibold">My Bookings</h3>
            <p className="font-body text-gray-500 text-sm mt-1">View or cancel your bookings</p>
          </Link>
          <Link to="/donate" className="card p-6 text-center hover:-translate-y-1 transition-transform">
            <div className="text-4xl mb-3">🪔</div>
            <h3 className="font-display text-orange-800 font-semibold">Make a Donation</h3>
            <p className="font-body text-gray-500 text-sm mt-1">Contribute to sacred temples</p>
          </Link>
        </div>

        {/* Recent Bookings */}
        <h2 className="section-title mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="text-4xl mb-3">🛕</div>
            <p className="font-body text-gray-500 text-lg">No bookings yet.</p>
            <Link to="/temples" className="btn-primary mt-4 inline-block">Book a Darshan</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((b) => (
              <div key={b._id} className="card p-5 flex justify-between items-center flex-wrap gap-3">
                <div>
                  <p className="font-display text-orange-900 font-semibold">{b.temple?.name}</p>
                  <p className="font-body text-gray-500 text-sm">
                    {b.slot?.poojaType} · {b.slot?.startTime} – {b.slot?.endTime}
                  </p>
                  <p className="font-body text-gray-400 text-xs mt-1">
                    {b.slot?.date ? new Date(b.slot.date).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "—"}
                    &nbsp;·&nbsp; {b.devoteesCount} devotee{b.devoteesCount > 1 ? "s" : ""}
                  </p>
                </div>
                <span className={`badge-${b.status.toLowerCase()}`}>{b.status}</span>
              </div>
            ))}
            {bookings.length > 5 && (
              <div className="text-center mt-2">
                <Link to="/my-bookings" className="text-orange-600 font-body hover:underline">
                  View all {bookings.length} bookings →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Recent Donations */}
        {donations.length > 0 && (
          <>
            <h2 className="section-title mt-10 mb-4">Recent Donations</h2>
            <div className="space-y-4">
              {donations.slice(0, 3).map((d) => (
                <div key={d._id} className="card p-5 flex justify-between items-center">
                  <div>
                    <p className="font-display text-orange-900 font-semibold">{d.temple?.name}</p>
                    {d.message && <p className="font-body text-gray-500 text-sm italic">"{d.message}"</p>}
                    <p className="font-body text-gray-400 text-xs mt-1">
                      {new Date(d.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </p>
                  </div>
                  <span className="font-display text-orange-700 font-bold text-lg">₹{d.amount}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
