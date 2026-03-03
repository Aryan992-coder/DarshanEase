import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTemple, getSlots, createBooking } from "../api/api";
import { useAuth } from "../context/AuthContext";

const TempleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [temple, setTemple]           = useState(null);
  const [slots, setSlots]             = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [devoteesCount, setDevoteesCount] = useState(1);
  const [loading, setLoading]         = useState(true);
  const [booking, setBooking]         = useState(false);
  const [success, setSuccess]         = useState("");
  const [error, setError]             = useState("");

  useEffect(() => {
    Promise.all([getTemple(id), getSlots(id)])
      .then(([tRes, sRes]) => {
        setTemple(tRes.data.data);
        setSlots(sRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) return navigate("/login");
    if (!selectedSlot) return setError("Please select a darshan slot");
    setError("");
    setBooking(true);
    try {
      await createBooking({ temple: id, slot: selectedSlot._id, devoteesCount });
      setSuccess(`Booking confirmed! 🙏 You've booked ${devoteesCount} slot(s) for ${selectedSlot.poojaType}`);
      setSelectedSlot(null);
      // Refresh slots
      const sRes = await getSlots(id);
      setSlots(sRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="text-center py-32 text-orange-600 font-display text-xl animate-pulse">Loading temple... 🙏</div>
  );

  if (!temple) return (
    <div className="text-center py-32 text-gray-500 font-body text-xl">Temple not found.</div>
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      {temple.images && temple.images.length > 0 ? (
        <div className="relative h-64 overflow-hidden">
          <img src={temple.images[0]} alt={temple.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
          <div className="absolute bottom-4 left-6">
            <h1 className="font-display text-3xl text-white font-bold">{temple.name}</h1>
          </div>
        </div>
      ) : (
        <div className="h-56 flex items-center justify-center text-8xl"
          style={{ background: "linear-gradient(135deg, #3D1C02, #6B0F1A)" }}>🛕</div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Temple Info */}
        <div className="card p-8 mb-10">
          <h1 className="font-display text-3xl text-orange-900 font-bold mb-2">{temple.name}</h1>
          <p className="font-body text-gray-500 mb-1">📍 {temple.location}</p>
          {temple.deity && <p className="font-body text-orange-600 mb-1">🙏 Deity: {temple.deity}</p>}
          {temple.openingTime && (
            <p className="font-body text-gray-400 text-sm mb-3">🕐 {temple.openingTime} – {temple.closingTime}</p>
          )}
          <p className="font-body text-gray-700 text-base leading-relaxed">{temple.description}</p>
        </div>

        {/* Slots */}
        <h2 className="section-title mb-6">Available Darshan Slots</h2>

        {slots.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 font-body text-lg">
            No slots available currently. Please check back later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {slots.map((slot) => (
              <div
                key={slot._id}
                onClick={() => slot.availableSeats > 0 && setSelectedSlot(slot)}
                className={`card p-5 cursor-pointer transition-all ${
                  selectedSlot?._id === slot._id
                    ? "border-2 border-orange-500 bg-orange-50"
                    : slot.availableSeats === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:border-orange-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-display text-orange-800 font-semibold">{slot.poojaType}</h3>
                  {selectedSlot?._id === slot._id && <span className="text-orange-500 text-xl">✓</span>}
                </div>
                <p className="font-body text-gray-600 text-sm">📅 {new Date(slot.date).toLocaleDateString("en-IN", { dateStyle: "long" })}</p>
                <p className="font-body text-gray-600 text-sm">🕐 {slot.startTime} – {slot.endTime}</p>
                <div className="flex justify-between mt-3">
                  <span className={`text-sm font-body ${slot.availableSeats > 0 ? "text-green-600" : "text-red-500"}`}>
                    {slot.availableSeats > 0 ? `✅ ${slot.availableSeats} seats available` : "❌ Fully booked"}
                  </span>
                  {slot.pricePerDevotee > 0 && (
                    <span className="font-display text-orange-700 font-semibold">₹{slot.pricePerDevotee}/person</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Panel */}
        {selectedSlot && (
          <div className="card p-8 border-2 border-orange-400 bg-orange-50">
            <h3 className="font-display text-orange-900 text-xl mb-4">Confirm Your Booking</h3>
            <p className="font-body text-gray-700 mb-1">Temple: <strong>{temple.name}</strong></p>
            <p className="font-body text-gray-700 mb-1">Slot: <strong>{selectedSlot.poojaType}</strong></p>
            <p className="font-body text-gray-700 mb-4">Time: <strong>{selectedSlot.startTime} – {selectedSlot.endTime}</strong></p>

            <div className="flex items-center gap-4 mb-5">
              <label className="font-display text-orange-800 text-sm">Number of Devotees:</label>
              <input
                type="number" min={1} max={selectedSlot.availableSeats}
                value={devoteesCount}
                onChange={(e) => setDevoteesCount(Number(e.target.value))}
                className="input-field w-24"
              />
            </div>

            {selectedSlot.pricePerDevotee > 0 && (
              <p className="font-body text-orange-700 font-semibold mb-4">
                Total: ₹{selectedSlot.pricePerDevotee * devoteesCount}
              </p>
            )}

            {error   && <div className="text-red-600 font-body mb-3">⚠️ {error}</div>}
            {success && <div className="text-green-600 font-body mb-3">🙏 {success}</div>}

            <button onClick={handleBook} disabled={booking} className="btn-primary w-full py-3 text-base">
              {booking ? "Booking..." : "Confirm Booking 🙏"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempleDetail;
