import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTemples } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [temples, setTemples] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getTemples().then((res) => setTemples(res.data.data.slice(0, 3)));
  }, []);

  const getDashboardLink = () => {
    if (user?.role === "ADMIN") return "/admin/dashboard";
    if (user?.role === "ORGANIZER") return "/organizer/dashboard";
    return "/dashboard";
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[88vh] flex items-center justify-center text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3D1C02 0%, #6B0F1A 50%, #1A0A00 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FF6B00, transparent)" }} />

        <div className="relative z-10 px-4 max-w-4xl mx-auto">
          <div className="text-6xl mb-4 animate-bounce">🕉️</div>
          <h1 className="font-display text-5xl md:text-7xl text-gold font-bold mb-4 leading-tight">
            DarshanEase
          </h1>
          <p className="font-body text-xl md:text-2xl text-orange-200 mb-2 italic">
            "Your Sacred Journey Begins Here"
          </p>
          <p className="font-body text-lg text-orange-300 mb-10 max-w-2xl mx-auto">
            Book darshan slots at India's most revered temples. Skip the queues, embrace the divine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/temples" className="btn-primary text-lg px-10 py-3">
              Explore Temples
            </Link>
            {user ? (
              <Link to={getDashboardLink()} className="btn-secondary text-lg px-10 py-3 border-gold text-gold hover:bg-gold hover:text-temple-brown">
                My Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn-secondary text-lg px-10 py-3 border-gold text-gold hover:bg-gold hover:text-temple-brown">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title text-center text-3xl mb-2">Why DarshanEase?</h2>
          <div className="om-divider" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { icon: "🗓️", title: "Easy Booking", desc: "Book your darshan slots online in minutes. No more long queues." },
              { icon: "🔒", title: "Secure & Trusted", desc: "JWT-secured accounts with safe payment and donation handling." },
              { icon: "📱", title: "Real-time Updates", desc: "Live slot availability so you always know what's open." },
            ].map((f) => (
              <div key={f.title} className="card p-8 text-center hover:-translate-y-1 transition-transform">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="font-display text-orange-800 text-lg mb-2">{f.title}</h3>
                <p className="font-body text-gray-600 text-base">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Temples */}
      {temples.length > 0 && (
        <section className="py-16 bg-orange-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="section-title text-center text-3xl mb-2">Featured Temples</h2>
            <div className="om-divider" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {temples.map((temple) => (
                <div key={temple._id} className="card overflow-hidden hover:-translate-y-1 transition-transform">
                  <div className="h-40 bg-gradient-to-br from-orange-700 to-red-900 flex items-center justify-center text-6xl">
                    🛕
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-orange-900 text-lg mb-1">{temple.name}</h3>
                    <p className="font-body text-gray-500 text-sm mb-1">📍 {temple.location}</p>
                    <p className="font-body text-gray-600 text-sm mb-4 line-clamp-2">{temple.description}</p>
                    <Link to={`/temples/${temple._id}`} className="btn-primary text-sm w-full text-center block">
                      View Slots
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/temples" className="btn-secondary">View All Temples</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA — only show if not logged in */}
      {!user && (
        <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #FF6B00, #6B0F1A)" }}>
          <h2 className="font-display text-white text-4xl font-bold mb-4">Begin Your Sacred Journey</h2>
          <p className="font-body text-orange-100 text-xl mb-8">Join thousands of devotees who book their darshan online.</p>
          <Link to="/register" className="bg-gold text-temple-brown font-display font-bold px-10 py-3 rounded hover:bg-gold-light transition text-lg">
            Register Now 🙏
          </Link>
        </section>
      )}
    </div>
  );
};

export default Home;
