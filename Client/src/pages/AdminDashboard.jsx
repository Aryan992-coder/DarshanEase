import { useEffect, useState } from "react";
import { getAdminDashboard, getAllUsers, updateUserRole, toggleUserStatus, getAnalytics } from "../api/api";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers]         = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab]             = useState("overview");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAllUsers(), getAnalytics()])
      .then(([dRes, uRes, aRes]) => {
        setDashboard(dRes.data.data);
        setUsers(uRes.data.data);
        setAnalytics(aRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id, role) => {
    await updateUserRole(id, role);
    const res = await getAllUsers();
    setUsers(res.data.data);
  };

  const handleToggle = async (id) => {
    await toggleUserStatus(id);
    const res = await getAllUsers();
    setUsers(res.data.data);
  };

  if (loading) return (
    <div className="text-center py-32 text-orange-600 font-display text-xl animate-pulse">Loading dashboard... 🙏</div>
  );

  const tabs = ["overview", "users", "analytics"];

  return (
    <div className="min-h-screen bg-cream">
      <div className="py-8 px-6" style={{ background: "linear-gradient(135deg, #1A0A00, #3D1C02)" }}>
        <h1 className="font-display text-3xl text-gold font-bold">Admin Dashboard</h1>
        <p className="font-body text-orange-300 mt-1">Manage the entire DarshanEase platform</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-orange-200 px-6">
        <div className="flex gap-6 max-w-6xl mx-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-4 font-display text-sm capitalize border-b-2 transition ${tab === t ? "border-orange-600 text-orange-700" : "border-transparent text-gray-500 hover:text-orange-600"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Overview */}
        {tab === "overview" && dashboard && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {[
                { label: "Total Users",    value: dashboard.totalUsers,          icon: "👥" },
                { label: "Temples",        value: dashboard.totalTemples,        icon: "🛕" },
                { label: "Bookings",       value: dashboard.totalBookings,       icon: "🎟️" },
                { label: "Total Donations",value: `₹${dashboard.totalDonationAmount}`, icon: "🪔" },
              ].map((stat) => (
                <div key={stat.label} className="card p-6 text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="font-display text-2xl text-orange-800 font-bold">{stat.value}</div>
                  <div className="font-body text-gray-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <h2 className="section-title mb-4">Recent Bookings</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm font-body">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>
                    {["Devotee", "Temple", "Date", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-display text-orange-700 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dashboard.recentBookings.map((b) => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="px-4 py-3">{b.user?.name}</td>
                      <td className="px-4 py-3">{b.temple?.name}</td>
                      <td className="px-4 py-3">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><span className={`badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Users */}
        {tab === "users" && (
          <>
            <h2 className="section-title mb-4">All Users ({users.length})</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm font-body">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>
                    {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-display text-orange-700 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs">
                          <option>USER</option>
                          <option>ORGANIZER</option>
                          <option>ADMIN</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={u.isActive ? "badge-confirmed" : "badge-cancelled"}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggle(u._id)}
                          className={`text-xs px-2 py-1 rounded border transition ${u.isActive ? "border-red-300 text-red-500 hover:bg-red-50" : "border-green-300 text-green-600 hover:bg-green-50"}`}>
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Analytics */}
        {tab === "analytics" && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h2 className="section-title mb-4">Bookings by Temple</h2>
              <div className="space-y-3">
                {analytics.bookingsByTemple.map((item) => (
                  <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="font-body text-gray-700">🛕 {item.templeName}</span>
                    <span className="font-display text-orange-700 font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-6">
              <h2 className="section-title mb-4">Donations by Temple</h2>
              <div className="space-y-3">
                {analytics.donationsByTemple.map((item) => (
                  <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="font-body text-gray-700">🪔 {item.templeName}</span>
                    <span className="font-display text-orange-700 font-bold">₹{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
