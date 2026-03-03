import { useEffect, useState } from "react";
import {
  getAdminDashboard, getAllUsers, getAdminOrganizers, createOrganizer,
  updateUserRole, toggleUserStatus, deleteUser,
  getAnalytics, getAdminTemples, getAdminBookings,
  createTemple, updateTemple, deleteTemple,
  addTempleImage, removeTempleImage,
} from "../api/api";

const TABS = ["Overview", "Users", "Organizers", "Temples", "Bookings", "Analytics"];

const AdminDashboard = () => {
  const [tab, setTab]               = useState("Overview");
  const [dashboard, setDashboard]   = useState(null);
  const [users, setUsers]           = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [temples, setTemples]       = useState([]);
  const [bookings, setBookings]     = useState([]);
  const [analytics, setAnalytics]   = useState(null);
  const [loading, setLoading]       = useState(true);

  const [orgForm, setOrgForm]           = useState({ name: "", email: "", password: "", phone: "" });
  const [orgMsg, setOrgMsg]             = useState("");
  const [templeForm, setTempleForm]     = useState({ name: "", location: "", description: "", deity: "", openingTime: "", closingTime: "", images: "" });
  const [templeMsg, setTempleMsg]       = useState("");
  const [editingTemple, setEditingTemple] = useState(null);
  const [imageUrl, setImageUrl]         = useState("");
  const [imageTarget, setImageTarget]   = useState(null);
  const [imageMsg, setImageMsg]         = useState("");

  const loadAll = async () => {
    try {
      const [d, u, o, t, b, a] = await Promise.all([
        getAdminDashboard(), getAllUsers(), getAdminOrganizers(),
        getAdminTemples(), getAdminBookings(), getAnalytics(),
      ]);
      setDashboard(d.data.data);
      setUsers(u.data.data);
      setOrganizers(o.data.data);
      setTemples(t.data.data);
      setBookings(b.data.data);
      setAnalytics(a.data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadAll(); }, []);

  const handleCreateOrganizer = async (e) => {
    e.preventDefault(); setOrgMsg("");
    try {
      await createOrganizer(orgForm);
      setOrgMsg("✅ Organizer created!");
      setOrgForm({ name: "", email: "", password: "", phone: "" });
      loadAll();
    } catch (err) { setOrgMsg("❌ " + (err.response?.data?.message || "Failed")); }
  };

  const handleRoleChange  = async (id, role) => { await updateUserRole(id, role); loadAll(); };
  const handleToggle      = async (id) => { await toggleUserStatus(id); loadAll(); };
  const handleDeleteUser  = async (id) => {
    if (!confirm("Delete this user permanently?")) return;
    await deleteUser(id); loadAll();
  };

  const handleTempleSubmit = async (e) => {
    e.preventDefault(); setTempleMsg("");
    try {
      const payload = {
        ...templeForm,
        images: templeForm.images ? templeForm.images.split(",").map(s => s.trim()).filter(Boolean) : [],
      };
      if (editingTemple) {
        await updateTemple(editingTemple._id, payload);
        setTempleMsg("✅ Temple updated!"); setEditingTemple(null);
      } else {
        await createTemple(payload);
        setTempleMsg("✅ Temple created!");
      }
      setTempleForm({ name: "", location: "", description: "", deity: "", openingTime: "", closingTime: "", images: "" });
      loadAll();
    } catch (err) { setTempleMsg("❌ " + (err.response?.data?.message || "Failed")); }
  };

  const handleEditTemple = (temple) => {
    setEditingTemple(temple);
    setTempleForm({ name: temple.name, location: temple.location, description: temple.description || "",
      deity: temple.deity || "", openingTime: temple.openingTime || "", closingTime: temple.closingTime || "",
      images: temple.images?.join(", ") || "" });
    setTempleMsg(""); setTab("Temples");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteTemple = async (id) => {
    if (!confirm("Deactivate this temple?")) return;
    await deleteTemple(id); loadAll();
  };

  const handleAddImage = async () => {
    if (!imageUrl || !imageTarget) return; setImageMsg("");
    try {
      await addTempleImage(imageTarget, imageUrl);
      setImageMsg("✅ Image added!"); setImageUrl(""); loadAll();
    } catch { setImageMsg("❌ Failed to add image"); }
  };

  const handleRemoveImage = async (templeId, url) => {
    if (!confirm("Remove this image?")) return;
    await removeTempleImage(templeId, url); loadAll();
  };

  if (loading) return (
    <div className="text-center py-32 text-orange-600 font-display text-xl animate-pulse">Loading... 🙏</div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="py-8 px-6" style={{ background: "linear-gradient(135deg, #1A0A00, #3D1C02)" }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl font-bold" style={{ color: "#D4AF37" }}>⚙️ Admin Dashboard</h1>
          <p className="font-body text-orange-300 mt-1">Full control over DarshanEase platform</p>
        </div>
      </div>

      <div className="bg-white border-b border-orange-200 px-6 overflow-x-auto">
        <div className="flex gap-1 max-w-7xl mx-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-4 px-4 font-display text-sm whitespace-nowrap border-b-2 transition ${tab === t ? "border-orange-600 text-orange-700" : "border-transparent text-gray-500 hover:text-orange-600"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* OVERVIEW */}
        {tab === "Overview" && dashboard && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              {[
                { label: "Devotees",   value: dashboard.totalUsers,           icon: "👥" },
                { label: "Organizers", value: dashboard.totalOrganizers,      icon: "🧑‍💼" },
                { label: "Temples",    value: dashboard.totalTemples,         icon: "🛕" },
                { label: "Bookings",   value: dashboard.totalBookings,        icon: "🎟️" },
                { label: "Donations",  value: `₹${dashboard.totalDonationAmount}`, icon: "🪔" },
              ].map((s) => (
                <div key={s.label} className="card p-5 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-display text-2xl text-orange-800 font-bold">{s.value}</div>
                  <div className="font-body text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <h2 className="section-title mb-4">Recent Bookings</h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>{["Devotee", "Email", "Temple", "Date", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-display text-orange-700 text-xs">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {dashboard.recentBookings.map((b) => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="px-4 py-3 font-medium">{b.user?.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{b.user?.email}</td>
                      <td className="px-4 py-3">{b.temple?.name}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3"><span className={`badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* USERS */}
        {tab === "Users" && (
          <>
            <h2 className="section-title mb-4">All Users ({users.length})</h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>{["Name", "Email", "Phone", "Role", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-display text-orange-700 text-xs">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-xs">
                          <option>USER</option><option>ORGANIZER</option><option>ADMIN</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={u.isActive ? "badge-confirmed" : "badge-cancelled"}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleToggle(u._id)}
                            className={`text-xs px-2 py-1 rounded border transition ${u.isActive ? "border-yellow-300 text-yellow-600 hover:bg-yellow-50" : "border-green-300 text-green-600 hover:bg-green-50"}`}>
                            {u.isActive ? "Suspend" : "Activate"}
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)}
                            className="text-xs px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ORGANIZERS */}
        {tab === "Organizers" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h2 className="section-title mb-4">Add New Organizer</h2>
              {orgMsg && <p className="font-body text-sm mb-3">{orgMsg}</p>}
              <form onSubmit={handleCreateOrganizer} className="space-y-4">
                {[
                  { label: "Full Name", key: "name", type: "text", placeholder: "Organizer name", req: true },
                  { label: "Email", key: "email", type: "email", placeholder: "organizer@email.com", req: true },
                  { label: "Password", key: "password", type: "password", placeholder: "Min 6 characters", req: true },
                  { label: "Phone", key: "phone", type: "tel", placeholder: "+91 98765 43210", req: false },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-display text-xs text-orange-800 mb-1">{f.label}</label>
                    <input type={f.type} className="input-field" placeholder={f.placeholder} required={f.req}
                      value={orgForm[f.key]} onChange={(e) => setOrgForm({ ...orgForm, [f.key]: e.target.value })} />
                  </div>
                ))}
                <button type="submit" className="btn-primary w-full">Create Organizer</button>
              </form>
            </div>
            <div>
              <h2 className="section-title mb-4">Current Organizers ({organizers.length})</h2>
              <div className="space-y-3">
                {organizers.length === 0 ? (
                  <div className="card p-6 text-center text-gray-500 font-body">No organizers yet.</div>
                ) : organizers.map((o) => (
                  <div key={o._id} className="card p-4 flex justify-between items-center">
                    <div>
                      <p className="font-display text-orange-900 font-semibold">{o.name}</p>
                      <p className="font-body text-gray-500 text-sm">{o.email}</p>
                      <p className="font-body text-gray-400 text-xs">{o.phone || "No phone"}</p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={o.isActive ? "badge-confirmed" : "badge-cancelled"}>
                        {o.isActive ? "Active" : "Inactive"}
                      </span>
                      <button onClick={() => handleToggle(o._id)}
                        className="text-xs px-2 py-1 rounded border border-yellow-300 text-yellow-600 hover:bg-yellow-50 transition">
                        {o.isActive ? "Suspend" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEMPLES */}
        {tab === "Temples" && (
          <div className="space-y-8">
            <div className="card p-6">
              <h2 className="section-title mb-4">{editingTemple ? `✏️ Editing: ${editingTemple.name}` : "Add New Temple"}</h2>
              {templeMsg && <p className="font-body text-sm mb-3">{templeMsg}</p>}
              <form onSubmit={handleTempleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Temple Name", key: "name", placeholder: "e.g. Tirupati Balaji" },
                  { label: "Location", key: "location", placeholder: "City, State" },
                  { label: "Deity", key: "deity", placeholder: "e.g. Lord Venkateswara" },
                  { label: "Opening Time", key: "openingTime", placeholder: "e.g. 06:00 AM" },
                  { label: "Closing Time", key: "closingTime", placeholder: "e.g. 09:00 PM" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-display text-xs text-orange-800 mb-1">{f.label}</label>
                    <input className="input-field" placeholder={f.placeholder}
                      value={templeForm[f.key]} onChange={(e) => setTempleForm({ ...templeForm, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="block font-display text-xs text-orange-800 mb-1">Description</label>
                  <textarea className="input-field resize-none" rows={2}
                    value={templeForm.description} onChange={(e) => setTempleForm({ ...templeForm, description: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-display text-xs text-orange-800 mb-1">
                    Image URLs <span className="text-gray-400 font-body text-xs">(comma-separated)</span>
                  </label>
                  <input className="input-field" placeholder="https://img1.jpg, https://img2.jpg"
                    value={templeForm.images} onChange={(e) => setTempleForm({ ...templeForm, images: e.target.value })} />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button type="submit" className="btn-primary">{editingTemple ? "Update Temple" : "Create Temple"}</button>
                  {editingTemple && (
                    <button type="button" onClick={() => { setEditingTemple(null); setTempleForm({ name: "", location: "", description: "", deity: "", openingTime: "", closingTime: "", images: "" }); setTempleMsg(""); }}
                      className="btn-secondary">Cancel</button>
                  )}
                </div>
              </form>
            </div>

            <div className="card p-6">
              <h2 className="section-title mb-4">📷 Add Image to Existing Temple</h2>
              {imageMsg && <p className="font-body text-sm mb-3">{imageMsg}</p>}
              <div className="flex flex-col md:flex-row gap-3">
                <select className="input-field md:w-64" value={imageTarget || ""} onChange={(e) => setImageTarget(e.target.value)}>
                  <option value="">-- Select Temple --</option>
                  {temples.filter(t => t.isActive).map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
                <input className="input-field flex-1" placeholder="Paste image URL..."
                  value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <button onClick={handleAddImage} className="btn-primary whitespace-nowrap">Add Image</button>
              </div>
            </div>

            <h2 className="section-title mb-4">All Temples ({temples.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {temples.map((t) => (
                <div key={t._id} className={`card overflow-hidden ${!t.isActive ? "opacity-60" : ""}`}>
                  {t.images?.length > 0 ? (
                    <img src={t.images[0]} alt={t.name} className="w-full h-40 object-cover"
                      onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-6xl"
                      style={{ background: "linear-gradient(135deg, #FF6B00, #6B0F1A)" }}>🛕</div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-display text-orange-900 font-semibold">{t.name}</h3>
                        <p className="font-body text-gray-500 text-sm">📍 {t.location}</p>
                        {t.deity && <p className="font-body text-gray-400 text-xs">🙏 {t.deity}</p>}
                      </div>
                      <span className={t.isActive ? "badge-confirmed" : "badge-cancelled"}>
                        {t.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {t.images?.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-3">
                        {t.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} alt="" className="w-12 h-12 object-cover rounded border border-orange-200"
                              onError={(e) => { e.target.style.display = "none"; }} />
                            <button onClick={() => handleRemoveImage(t._id, img)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs hidden group-hover:flex items-center justify-center">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => handleEditTemple(t)}
                        className="text-xs px-3 py-1 rounded border border-blue-300 text-blue-600 hover:bg-blue-50 transition">✏️ Edit</button>
                      <button onClick={() => handleDeleteTemple(t._id)}
                        className="text-xs px-3 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition">🗑️ Deactivate</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOOKINGS */}
        {tab === "Bookings" && (
          <>
            <h2 className="section-title mb-4">All Bookings ({bookings.length})</h2>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>{["Booking ID", "Devotee", "Temple", "Slot", "Devotees", "Amount", "Status", "Date"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-display text-orange-700 text-xs">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="px-3 py-3 text-xs text-gray-400">{b.bookingId}</td>
                      <td className="px-3 py-3 font-medium">{b.user?.name}</td>
                      <td className="px-3 py-3">{b.temple?.name}</td>
                      <td className="px-3 py-3 text-xs">{b.slot?.poojaType}</td>
                      <td className="px-3 py-3 text-center">{b.devoteesCount}</td>
                      <td className="px-3 py-3">₹{b.totalAmount}</td>
                      <td className="px-3 py-3"><span className={`badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                      <td className="px-3 py-3 text-xs text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ANALYTICS */}
        {tab === "Analytics" && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analytics.bookingsByStatus.map((s) => (
                <div key={s._id} className="card p-6 text-center">
                  <div className="font-display text-3xl text-orange-800 font-bold">{s.count}</div>
                  <span className={`mt-2 inline-block badge-${s._id.toLowerCase()}`}>{s._id}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-6">
                <h2 className="section-title mb-4">🎟️ Bookings by Temple</h2>
                <div className="space-y-3">
                  {analytics.bookingsByTemple.length === 0 ? <p className="font-body text-gray-500">No data yet.</p>
                    : analytics.bookingsByTemple.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-body text-gray-700">🛕 {item.templeName}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-orange-400" style={{ width: `${Math.min(item.count * 10, 100)}px` }} />
                        <span className="font-display text-orange-700 font-bold w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-6">
                <h2 className="section-title mb-4">🪔 Donations by Temple</h2>
                <div className="space-y-3">
                  {analytics.donationsByTemple.length === 0 ? <p className="font-body text-gray-500">No data yet.</p>
                    : analytics.donationsByTemple.map((item) => (
                    <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="font-body text-gray-700">🛕 {item.templeName}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 rounded-full bg-yellow-400" style={{ width: `${Math.min(item.total / 20, 100)}px` }} />
                        <span className="font-display text-orange-700 font-bold">₹{item.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card p-6">
              <h2 className="section-title mb-4">📅 Monthly Bookings</h2>
              <div className="flex items-end gap-4 h-40">
                {analytics.monthlyBookings.length === 0 ? <p className="font-body text-gray-500">No data yet.</p>
                  : [...analytics.monthlyBookings].reverse().map((m) => {
                  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  const maxCount = Math.max(...analytics.monthlyBookings.map(x => x.count));
                  const height = maxCount > 0 ? (m.count / maxCount) * 100 : 0;
                  return (
                    <div key={`${m._id.year}-${m._id.month}`} className="flex flex-col items-center gap-1 flex-1">
                      <span className="font-display text-xs text-orange-700">{m.count}</span>
                      <div className="w-full bg-orange-500 rounded-t" style={{ height: `${height}%`, minHeight: "4px" }} />
                      <span className="font-body text-xs text-gray-500">{months[m._id.month - 1]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
