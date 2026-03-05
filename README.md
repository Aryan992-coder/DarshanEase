# 🛕 DarshanEase - MERN Stack Temple Darshan Booking System

DarshanEase is a premium, feature-rich temple darshan ticket booking platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It provides a seamless spiritual experience for Devotees to book darshan slots, Organizers to manage temples, and Admins to oversee the entire platform.

---

## ✨ Key Features

### 🔐 Multi-Role Authentication
- **Secure Signup/Login**: Role-based access for Devotees, Organizers, and Admins.
- **JWT Protection**: Stateless token-based authentication with 7-day expiry.
- **Password Security**: bcryptjs hashing with salt rounds for all stored passwords.

### 🛕 Temple Ecosystem
- **Temple Browsing**: Explore active temples with real images, deity info, location, and timings.
- **Darshan Slots**: Real-time seat availability tracking with auto-decrement on booking and auto-increment on cancellation.
- **Temple Images**: URL-based image management — add or remove temple preview images from the admin panel.
- **Organizer Dashboard**: Dedicated tools for organizers to add temples, manage slots, and track devotee bookings.

### 🎟️ Booking & Donations
- **Slot Booking**: Select a darshan slot, specify the number of devotees, and confirm instantly.
- **Booking Management**: View booking history with CONFIRMED / CANCELLED / PENDING status badges.
- **Booking Cancellation**: Cancel confirmed bookings with automatic seat release back to the slot.
- **Temple Donations**: Donate to any temple with custom amounts, quick-select buttons, and a personal message.

### 🎨 UI/UX
- **Temple-Themed Design**: Saffron, gold, maroon and cream palette with Cinzel display font.
- **Responsive & Mobile-First**: Optimized for all screen sizes with a sticky dark navbar.
- **Personal Dashboard**: Devotee dashboard with booking stats, quick actions, and donation history.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js with Vite
- **State Management**: Context API (AuthContext)
- **Styling**: Tailwind CSS v3
- **HTTP Client**: Axios with JWT interceptor
- **Routing**: React Router DOM v6
- **Fonts**: Google Fonts — Cinzel + Crimson Pro

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs
- **Logging**: Morgan
- **Environment**: dotenv

---

## 📁 Project Structure

```text
DarshanEase/
├── Server/                      # Express server and Node.js logic
│   ├── controllers/             # Business logic (auth, temple, slot, booking, donation, admin, organizer)
│   ├── middleware/              # JWT protect() and role-based authorize() middleware
│   ├── models/                  # Mongoose schemas (User, Temple, DarshanSlot, Booking, Donation)
│   ├── routes/                  # Express route files mapped to controllers
│   ├── seed.js                  # Database seeder with sample temples, slots, users and bookings
│   └── server.js                # Entry point — Express app, CORS, routes, MongoDB connection
├── Client/                      # React frontend
│   ├── src/
│   │   ├── api/                 # Axios instance + all API call functions (api.js)
│   │   ├── components/          # Navbar, Footer, ProtectedRoute, GuestRoute
│   │   ├── context/             # AuthContext — global user state, login/logout
│   │   └── pages/               # Home, Login, Register, Temples, TempleDetail, Dashboard,
│   │                            # MyBookings, Donate, AdminDashboard, OrganizerDashboard
│   ├── tailwind.config.js       # Custom temple theme (saffron, gold, cream, maroon)
│   └── vite.config.js           # Vite proxy → Express :5000
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DarshanEase
   ```

2. **Install Server Dependencies**
   ```bash
   cd Server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd Client
   npm install axios react-router-dom
   npm install -D tailwindcss@3 postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Environment Variables**
   Create a `.env` file in the `Server/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/darshanease?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

5. **Seed the Database** *(Optional but Recommended)*
   ```bash
   cd Server
   node seed.js
   ```

6. **Run the Application**
   ```bash
   # Terminal 1 — Backend
   cd Server && npm run dev

   # Terminal 2 — Frontend
   cd Client && npm run dev
   ```
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

---

## 🔑 Seed Credentials

After running `node seed.js`, use these accounts to explore the platform:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@darshanease.com | admin123 |
| Organizer | organizer1@darshanease.com | organizer123 |
| Organizer | organizer2@darshanease.com | organizer123 |
| Devotee | devotee1@darshanease.com | devotee123 |
| Devotee | devotee2@darshanease.com | devotee123 |

---

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Devotee (USER)** | Browse temples, book darshan slots, cancel bookings, make donations, personal dashboard |
| **Organizer** | All devotee permissions + manage own temples, create slots, view temple bookings |
| **Admin** | Full platform control — user management, organizer creation, analytics, all bookings |

---

## 🛡️ Security & Best Practices
- **JWT Middleware**: `protect()` verifies token on every protected route; `authorize()` enforces role-based access.
- **Password Hashing**: All passwords hashed with bcryptjs before storing in MongoDB.
- **Role Isolation**: Users cannot self-assign ADMIN or ORGANIZER roles at registration.
- **Route Guards**: `ProtectedRoute` and `GuestRoute` components enforce auth on the frontend.
- **Input Validation**: Mongoose schema-level validation on all models.
- **Error Handling**: Centralized try/catch in all controllers with consistent JSON error responses.

---

## 📄 License
This project is intended for educational purposes.

Developed with 🙏 as **DarshanEase** — *Your Sacred Journey Begins Here*.
