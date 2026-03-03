import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTemples } from "../api/api";

const Temples = () => {
  const [temples, setTemples]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    getTemples()
      .then((res) => setTemples(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = temples.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="py-12 text-center" style={{ background: "linear-gradient(135deg, #3D1C02, #6B0F1A)" }}>
        <div className="text-4xl mb-2">🛕</div>
        <h1 className="font-display text-4xl text-gold font-bold">Sacred Temples</h1>
        <p className="font-body text-orange-200 text-lg mt-2">Discover and book darshan at India's divine temples</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Search */}
        <div className="mb-8 max-w-lg mx-auto">
          <input
            type="text"
            className="input-field text-lg shadow"
            placeholder="🔍 Search temples by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center text-orange-600 text-xl animate-pulse font-display py-20">
            Loading temples... 🙏
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 font-body text-xl py-20">
            No temples found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((temple) => (
              <div key={temple._id} className="card overflow-hidden hover:-translate-y-1 transition-transform">
                {temple.images && temple.images.length > 0 ? (
                  <img src={temple.images[0]} alt={temple.name} className="w-full h-44 object-cover"
                    onError={(e) => { e.target.style.display='none'; }} />
                ) : (
                  <div className="h-44 flex items-center justify-center text-7xl"
                    style={{ background: "linear-gradient(135deg, #FF6B00, #6B0F1A)" }}>🛕</div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-orange-900 text-xl font-semibold mb-1">{temple.name}</h3>
                  <p className="font-body text-gray-500 text-sm mb-1">📍 {temple.location}</p>
                  {temple.deity && <p className="font-body text-orange-600 text-sm mb-2">🙏 Deity: {temple.deity}</p>}
                  <p className="font-body text-gray-600 text-sm mb-4 line-clamp-2">{temple.description}</p>
                  {temple.openingTime && (
                    <p className="font-body text-gray-400 text-xs mb-4">
                      🕐 {temple.openingTime} – {temple.closingTime}
                    </p>
                  )}
                  <Link to={`/temples/${temple._id}`} className="btn-primary w-full text-center block text-sm">
                    View Darshan Slots
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Temples;
