import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../api/api";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchBookings = () => {
    getMyBookings()
      .then((res) => setBookings(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed");
    }
  };

  if (loading) return (
    <div className="text-center py-32 text-orange-600 font-display text-xl animate-pulse">Loading bookings... 🙏</div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <div className="py-10 text-center" style={{ background: "linear-gradient(135deg, #3D1C02, #6B0F1A)" }}>
        <h1 className="font-display text-4xl text-gold font-bold">My Bookings</h1>
        <p className="font-body text-orange-200 mt-2">Your darshan journey history</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🛕</div>
            <p className="font-body text-gray-500 text-xl">No bookings yet.</p>
            <a href="/temples" className="btn-primary mt-6 inline-block">Book a Darshan</a>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((b) => (
              <div key={b._id} className="card p-6">
                <div className="flex justify-between items-start flex-wrap gap-3">
                  <div>
                    <h3 className="font-display text-orange-900 text-xl font-semibold">{b.temple?.name}</h3>
                    <p className="font-body text-gray-500 text-sm mt-1">📍 {b.temple?.location}</p>
                    <p className="font-body text-gray-600 mt-2">
                      🕐 {b.slot?.startTime} – {b.slot?.endTime} &nbsp;|&nbsp; {b.slot?.poojaType}
                    </p>
                    <p className="font-body text-gray-600 text-sm">
                      📅 {b.slot?.date ? new Date(b.slot.date).toLocaleDateString("en-IN", { dateStyle: "long" }) : "—"}
                    </p>
                    <p className="font-body text-gray-600 text-sm mt-1">👥 Devotees: {b.devoteesCount}</p>
                    {b.totalAmount > 0 && <p className="font-body text-orange-700 font-semibold text-sm">₹{b.totalAmount}</p>}
                    <p className="font-body text-gray-400 text-xs mt-1">Booking ID: {b.bookingId}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className={`badge-${b.status.toLowerCase()}`}>{b.status}</span>
                    {b.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleCancel(b._id)}
                        className="text-sm text-red-500 hover:text-red-700 font-body border border-red-300 px-3 py-1 rounded hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
