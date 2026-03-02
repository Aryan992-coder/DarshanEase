import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home              from "./pages/Home";
import Login             from "./pages/Login";
import Register          from "./pages/Register";
import Temples           from "./pages/Temples";
import TempleDetail      from "./pages/TempleDetail";
import MyBookings        from "./pages/MyBookings";
import Donate            from "./pages/Donate";
import Dashboard         from "./pages/Dashboard";
import AdminDashboard    from "./pages/AdminDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/"           element={<Home />} />
              <Route path="/login"      element={<GuestRoute><Login /></GuestRoute>} />
              <Route path="/register"   element={<GuestRoute><Register /></GuestRoute>} />
              <Route path="/temples"    element={<Temples />} />
              <Route path="/temples/:id" element={<TempleDetail />} />

              {/* User Protected */}
              <Route path="/dashboard" element={
                <ProtectedRoute roles={["USER"]}>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* User Protected */}
              <Route path="/my-bookings" element={
                <ProtectedRoute roles={["USER", "ORGANIZER", "ADMIN"]}>
                  <MyBookings />
                </ProtectedRoute>
              } />
              <Route path="/donate" element={
                <ProtectedRoute roles={["USER", "ORGANIZER", "ADMIN"]}>
                  <Donate />
                </ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Organizer */}
              <Route path="/organizer/dashboard" element={
                <ProtectedRoute roles={["ORGANIZER", "ADMIN"]}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="text-center py-32">
                  <div className="text-6xl mb-4">🛕</div>
                  <h2 className="font-display text-3xl text-orange-800">Page Not Found</h2>
                  <a href="/" className="btn-primary mt-6 inline-block">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
