import { useEffect, useState } from "react";
import { getTemples, createDonation, getMyDonations } from "../api/api";

const Donate = () => {
  const [temples, setTemples]     = useState([]);
  const [donations, setDonations] = useState([]);
  const [form, setForm]           = useState({ temple: "", amount: "", message: "" });
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    getTemples().then((res) => setTemples(res.data.data));
    getMyDonations().then((res) => setDonations(res.data.data));
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.temple) return setError("Please select a temple");
    if (!form.amount || form.amount <= 0) return setError("Please enter a valid amount");
    setLoading(true);
    try {
      await createDonation(form);
      setSuccess(`🙏 Thank you for your donation of ₹${form.amount}!`);
      setForm({ temple: "", amount: "", message: "" });
      const res = await getMyDonations();
      setDonations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="py-10 text-center" style={{ background: "linear-gradient(135deg, #3D1C02, #6B0F1A)" }}>
        <div className="text-4xl mb-2">🪔</div>
        <h1 className="font-display text-4xl text-gold font-bold">Make a Donation</h1>
        <p className="font-body text-orange-200 mt-2">Contribute to the maintenance of sacred temples</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Donation Form */}
        <div className="card p-8">
          <h2 className="section-title mb-6">Donate to a Temple</h2>
          {error   && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 font-body">⚠️ {error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 font-body">{success}</div>}
          <form onSubmit={handleDonate} className="space-y-5">
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Select Temple</label>
              <select className="input-field" value={form.temple}
                onChange={(e) => setForm({ ...form, temple: e.target.value })}>
                <option value="">-- Choose a Temple --</option>
                {temples.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Donation Amount (₹)</label>
              <input type="number" min="1" className="input-field" placeholder="Enter amount"
                value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <div className="flex gap-2 mt-2 flex-wrap">
                {[51, 101, 251, 501, 1001].map((amt) => (
                  <button key={amt} type="button"
                    className={`px-3 py-1 rounded border text-sm font-body transition ${form.amount == amt ? "bg-orange-600 text-white border-orange-600" : "border-orange-300 text-orange-600 hover:bg-orange-50"}`}
                    onClick={() => setForm({ ...form, amount: amt })}>
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-display text-sm text-orange-800 mb-1">Message (Optional)</label>
              <textarea rows={3} className="input-field resize-none" placeholder="Your blessings message..."
                value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? "Processing..." : "Donate Now 🙏"}
            </button>
          </form>
        </div>

        {/* Donation History */}
        <div>
          <h2 className="section-title mb-6">Your Donation History</h2>
          {donations.length === 0 ? (
            <div className="card p-8 text-center text-gray-500 font-body">No donations yet.</div>
          ) : (
            <div className="space-y-4">
              {donations.map((d) => (
                <div key={d._id} className="card p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-display text-orange-900 font-semibold">{d.temple?.name}</p>
                      {d.message && <p className="font-body text-gray-500 text-sm italic mt-1">"{d.message}"</p>}
                      <p className="font-body text-gray-400 text-xs mt-1">
                        {new Date(d.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                      </p>
                    </div>
                    <span className="font-display text-orange-700 font-bold text-lg">₹{d.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
