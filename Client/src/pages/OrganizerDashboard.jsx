import { useEffect, useState } from "react";
import {
  getOrgDashboard, getOrgTemples, getOrgSlots, getOrgBookings,
  createTemple, createSlot,
} from "../api/api";

const OrganizerDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [temples, setTemples]     = useState([]);
  const [slots, setSlots]         = useState([]);
  const [bookings, setBookings]   = useState([]);
  const [tab, setTab]             = useState("overview");
  const [loading, setLoading]     = useState(true);

  // Forms
  const [templeForm, setTempleForm] = useState({ name: "", location: "", description: "", deity: "", openingTime: "", closingTime: "" });
  const [slotForm, setSlotForm]     = useState({ temple: "", date: "", startTime: "", endTime: "", poojaType: "General Darshan", totalCapacity: "", pricePerDevotee: 0 });
  const [tMsg, setTMsg] = useState(""); const [sMsg, setSMsg] = useState("");

  const load = () => {
    Promise.all([getOrgDashboard(), getOrgTemples(), getOrgSlots(), getOrgBookings()])
      .then(([d, t, s, b]) => {
        setDashboard(d.data.data);
        setTemples(t.data.data);
        setSlots(s.data.data);
        setBookings(b.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAddTemple = async (e) => {
    e.preventDefault();
    try {
      await createTemple(templeForm);
      setTMsg("✅ Temple created successfully!");
      setTempleForm({ name: "", location: "", description: "", deity: "", openingTime: "", closingTime: "" });
      load();
    } catch (err) { setTMsg("❌ " + (err.response?.data?.message || "Failed")); }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      await createSlot(slotForm);
      setSMsg("✅ Slot created successfully!");
      setSlotForm({ temple: "", date: "", startTime: "", endTime: "", poojaType: "General Darshan", totalCapacity: "", pricePerDevotee: 0 });
      load();
    } catch (err) { setSMsg("❌ " + (err.response?.data?.message || "Failed")); }
  };

  if (loading) return (
    <div className="text-center py-32 text-orange-600 font-display text-xl animate-pulse">Loading... 🙏</div>
  );

  const tabs = ["overview", "temples", "slots", "bookings"];

  return (
    <div className="min-h-screen bg-cream">
      <div className="py-8 px-6" style={{ background: "linear-gradient(135deg, #3D1C02, #6B0F1A)" }}>
        <h1 className="font-display text-3xl text-gold font-bold">Organizer Dashboard</h1>
        <p className="font-body text-orange-300 mt-1">Manage your temples and darshan slots</p>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "My Temples",    value: dashboard.temples?.length || 0, icon: "🛕" },
              { label: "Total Slots",   value: dashboard.totalSlots,           icon: "🗓️" },
              { label: "Total Bookings",value: dashboard.totalBookings,        icon: "🎟️" },
              { label: "Confirmed",     value: dashboard.confirmedBookings,    icon: "✅" },
            ].map((stat) => (
              <div key={stat.label} className="card p-6 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="font-display text-2xl text-orange-800 font-bold">{stat.value}</div>
                <div className="font-body text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Temples */}
        {tab === "temples" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add Temple Form */}
            <div className="card p-6">
              <h2 className="section-title mb-4">Add New Temple</h2>
              {tMsg && <p className="font-body text-sm mb-3">{tMsg}</p>}
              <form onSubmit={handleAddTemple} className="space-y-4">
                {[
                  { label: "Temple Name", key: "name", placeholder: "e.g. Tirupati Balaji" },
                  { label: "Location",    key: "location", placeholder: "City, State" },
                  { label: "Deity",       key: "deity", placeholder: "e.g. Lord Venkateswara" },
                  { label: "Opening Time", key: "openingTime", placeholder: "e.g. 06:00 AM" },
                  { label: "Closing Time", key: "closingTime", placeholder: "e.g. 09:00 PM" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-display text-xs text-orange-800 mb-1">{f.label}</label>
                    <input className="input-field" placeholder={f.placeholder}
                      value={templeForm[f.key]} onChange={(e) => setTempleForm({ ...templeForm, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label className="block font-display text-xs text-orange-800 mb-1">Description</label>
                  <textarea className="input-field resize-none" rows={3}
                    value={templeForm.description} onChange={(e) => setTempleForm({ ...templeForm, description: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary w-full">Add Temple</button>
              </form>
            </div>

            {/* Temple List */}
            <div>
              <h2 className="section-title mb-4">Your Temples ({temples.length})</h2>
              <div className="space-y-3">
                {temples.map((t) => (
                  <div key={t._id} className="card p-4">
                    <p className="font-display text-orange-900 font-semibold">{t.name}</p>
                    <p className="font-body text-gray-500 text-sm">📍 {t.location}</p>
                    {t.deity && <p className="font-body text-gray-400 text-xs">🙏 {t.deity}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slots */}
        {tab === "slots" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-6">
              <h2 className="section-title mb-4">Add Darshan Slot</h2>
              {sMsg && <p className="font-body text-sm mb-3">{sMsg}</p>}
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div>
                  <label className="block font-display text-xs text-orange-800 mb-1">Temple</label>
                  <select className="input-field" value={slotForm.temple}
                    onChange={(e) => setSlotForm({ ...slotForm, temple: e.target.value })}>
                    <option value="">-- Select Temple --</option>
                    {temples.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
                {[
                  { label: "Date", key: "date", type: "date" },
                  { label: "Start Time", key: "startTime", type: "text", placeholder: "e.g. 06:00 AM" },
                  { label: "End Time", key: "endTime", type: "text", placeholder: "e.g. 07:00 AM" },
                  { label: "Pooja Type", key: "poojaType", type: "text", placeholder: "General Darshan" },
                  { label: "Total Capacity", key: "totalCapacity", type: "number", placeholder: "e.g. 50" },
                  { label: "Price Per Devotee (₹)", key: "pricePerDevotee", type: "number", placeholder: "0 for free" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block font-display text-xs text-orange-800 mb-1">{f.label}</label>
                    <input type={f.type} className="input-field" placeholder={f.placeholder}
                      value={slotForm[f.key]} onChange={(e) => setSlotForm({ ...slotForm, [f.key]: e.target.value })} />
                  </div>
                ))}
                <button type="submit" className="btn-primary w-full">Add Slot</button>
              </form>
            </div>

            <div>
              <h2 className="section-title mb-4">Your Slots ({slots.length})</h2>
              <div className="space-y-3">
                {slots.map((s) => (
                  <div key={s._id} className="card p-4">
                    <p className="font-display text-orange-900 font-semibold">{s.poojaType}</p>
                    <p className="font-body text-gray-500 text-sm">🛕 {s.temple?.name}</p>
                    <p className="font-body text-gray-500 text-sm">📅 {new Date(s.date).toLocaleDateString()}</p>
                    <p className="font-body text-gray-500 text-sm">🕐 {s.startTime} – {s.endTime}</p>
                    <p className="font-body text-sm mt-1">
                      <span className={s.availableSeats > 0 ? "text-green-600" : "text-red-500"}>
                        {s.availableSeats} / {s.totalCapacity} seats available
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === "bookings" && (
          <>
            <h2 className="section-title mb-4">Temple Bookings ({bookings.length})</h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm font-body">
                <thead className="bg-orange-50 border-b border-orange-200">
                  <tr>
                    {["Devotee", "Temple", "Slot", "Devotees", "Amount", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-display text-orange-700 text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b border-gray-100 hover:bg-orange-50">
                      <td className="px-4 py-3">{b.user?.name}</td>
                      <td className="px-4 py-3">{b.temple?.name}</td>
                      <td className="px-4 py-3">{b.slot?.poojaType}</td>
                      <td className="px-4 py-3">{b.devoteesCount}</td>
                      <td className="px-4 py-3">₹{b.totalAmount}</td>
                      <td className="px-4 py-3"><span className={`badge-${b.status.toLowerCase()}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
