import axios from "axios";

const API = axios.create({
  baseURL:process.env.NODE_ENV === 'production'
    ? 'https://darshanease-api.vercel.app/api'
    : '/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const registerUser  = (data) => API.post("/auth/register", data);
export const loginUser     = (data) => API.post("/auth/login", data);
export const getMe         = ()     => API.get("/auth/me");

// User
export const getProfile    = ()     => API.get("/users/profile");
export const updateProfile = (data) => API.put("/users/profile", data);

// Temples
export const getTemples    = ()     => API.get("/temples");
export const getTemple     = (id)   => API.get(`/temples/${id}`);
export const createTemple  = (data) => API.post("/temples", data);
export const updateTemple  = (id, data) => API.put(`/temples/${id}`, data);
export const deleteTemple  = (id)   => API.delete(`/temples/${id}`);

// Slots
export const getSlots      = (templeId) => API.get(`/slots${templeId ? `?temple=${templeId}` : ""}`);
export const getSlot       = (id)   => API.get(`/slots/${id}`);
export const createSlot    = (data) => API.post("/slots", data);
export const updateSlot    = (id, data) => API.put(`/slots/${id}`, data);
export const deleteSlot    = (id)   => API.delete(`/slots/${id}`);

// Bookings
export const createBooking = (data) => API.post("/bookings", data);
export const getMyBookings = ()     => API.get("/bookings/my");
export const getBooking    = (id)   => API.get(`/bookings/${id}`);
export const cancelBooking = (id)   => API.put(`/bookings/${id}/cancel`);
export const getAllBookings = ()     => API.get("/bookings");

// Donations
export const createDonation  = (data) => API.post("/donations", data);
export const getMyDonations  = ()     => API.get("/donations/my");
export const getAllDonations  = ()     => API.get("/donations");

// Admin
export const getAdminDashboard = ()         => API.get("/admin/dashboard");
export const getAllUsers        = ()         => API.get("/admin/users");
export const updateUserRole    = (id, role) => API.put(`/admin/users/${id}/role`, { role });
export const toggleUserStatus  = (id)       => API.put(`/admin/users/${id}/toggle`);
export const getAnalytics      = ()         => API.get("/admin/analytics");

// Organizer
export const getOrgDashboard = () => API.get("/organizer/dashboard");
export const getOrgTemples   = () => API.get("/organizer/temples");
export const getOrgSlots     = () => API.get("/organizer/slots");
export const getOrgBookings  = () => API.get("/organizer/bookings");

export default API;

// Admin extras
export const getAdminOrganizers  = ()         => API.get("/admin/organizers");
export const createOrganizer     = (data)     => API.post("/admin/organizers", data);
export const deleteUser          = (id)       => API.delete(`/admin/users/${id}`);
export const getAdminTemples     = ()         => API.get("/admin/temples");
export const getAdminBookings    = ()         => API.get("/admin/bookings");
export const addTempleImage      = (id, url)  => API.post(`/temples/${id}/images`, { imageUrl: url });
export const removeTempleImage   = (id, url)  => API.delete(`/temples/${id}/images`, { data: { imageUrl: url } });
