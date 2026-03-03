const dns = require('dns').promises;   // or just require('dns') in older Node
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// ─── Models ───────────────────────────────────────────────────
const User = require("./models/User");
const Temple = require("./models/Temple");
const DarshanSlot = require("./models/DarshanSlot");
const Booking = require("./models/Booking");
const Donation = require("./models/Donation");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ─── Clear existing data ───────────────────────────────────
    await Promise.all([
      User.deleteMany(),
      Temple.deleteMany(),
      DarshanSlot.deleteMany(),
      Booking.deleteMany(),
      Donation.deleteMany(),
    ]);
    console.log("🗑️  Cleared existing data");

    // ─── Create Users ──────────────────────────────────────────
    const adminUser = await User.create({
      name: "Super Admin",
      email: "admin@darshanease.com",
      password: "admin123",
      phone: "+91 98000 00001",
      role: "ADMIN",
    });

    const organizer1 = await User.create({
      name: "Pandit Ramesh Sharma",
      email: "organizer1@darshanease.com",
      password: "organizer123",
      phone: "+91 98000 00002",
      role: "ORGANIZER",
    });

    const organizer2 = await User.create({
      name: "Swami Krishnananda",
      email: "organizer2@darshanease.com",
      password: "organizer123",
      phone: "+91 98000 00003",
      role: "ORGANIZER",
    });

    const devotee1 = await User.create({
      name: "Arjun Mehta",
      email: "devotee1@darshanease.com",
      password: "devotee123",
      phone: "+91 98000 00004",
      role: "USER",
    });

    const devotee2 = await User.create({
      name: "Priya Patel",
      email: "devotee2@darshanease.com",
      password: "devotee123",
      phone: "+91 98000 00005",
      role: "USER",
    });

    console.log("👥 Users created");

    // ─── Create Temples ────────────────────────────────────────
    const temple1 = await Temple.create({
      name: "Kedarnath Temple",
      location: "Rudraprayag, Uttarakhand",
      description: "One of the twelve Jyotirlingas and most sacred shrines of Lord Shiva, situated at an altitude of 3,583 metres in the Garhwal Himalayan range.",
      deity: "Lord Shiva",
      openingTime: "04:00 AM",
      closingTime: "09:00 PM",
      organizer: organizer1._id,
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Kedarnath_Temple.jpg/1200px-Kedarnath_Temple.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Kedarnath_dham.jpg/1200px-Kedarnath_dham.jpg"
      ],
      isActive: true,
    });

    const temple2 = await Temple.create({
      name: "Tirupati Balaji Temple",
      location: "Tirupati, Andhra Pradesh",
      description: "Sri Venkateswara Swamy Temple, one of the most visited pilgrimage centers in the world, dedicated to Lord Venkateswara, an incarnation of Vishnu.",
      deity: "Lord Venkateswara",
      openingTime: "02:30 AM",
      closingTime: "11:00 PM",
      organizer: organizer1._id,
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Tirumala_Tirupati_temple_view.jpg/1200px-Tirumala_Tirupati_temple_view.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tirupati_Temple.jpg/1200px-Tirupati_Temple.jpg"
      ],
      isActive: true,
    });

    const temple3 = await Temple.create({
      name: "Somnath Temple",
      location: "Prabhas Patan, Gujarat",
      description: "The first among the twelve Jyotirlinga shrines of Lord Shiva, located on the western coast of Gujarat, a sacred pilgrimage site since ancient times.",
      deity: "Lord Shiva",
      openingTime: "06:00 AM",
      closingTime: "09:30 PM",
      organizer: organizer2._id,
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Somnath_temple_evening.jpg/1200px-Somnath_temple_evening.jpg",
      ],
      isActive: true,
    });

    const temple4 = await Temple.create({
      name: "Vaishno Devi Temple",
      location: "Reasi, Jammu & Kashmir",
      description: "Shri Mata Vaishno Devi Temple is a Hindu temple dedicated to the Mother Goddess, located in the Trikuta Mountains. One of the most revered shrines in India.",
      deity: "Mata Vaishno Devi",
      openingTime: "05:00 AM",
      closingTime: "10:00 PM",
      organizer: organizer2._id,
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Vaishno_Devi_Temple.jpg/1200px-Vaishno_Devi_Temple.jpg",
      ],
      isActive: true,
    });

    const temple5 = await Temple.create({
      name: "Shirdi Sai Baba Temple",
      location: "Shirdi, Maharashtra",
      description: "The Sai Baba temple in Shirdi is one of the most visited pilgrimage sites in India, dedicated to the revered spiritual master Sai Baba of Shirdi.",
      deity: "Sai Baba",
      openingTime: "04:00 AM",
      closingTime: "11:00 PM",
      organizer: organizer1._id,
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Shirdi_Sai_Baba_Temple.jpg/1200px-Shirdi_Sai_Baba_Temple.jpg",
      ],
      isActive: true,
    });

    console.log("🛕 Temples created");

    // ─── Create Darshan Slots ──────────────────────────────────
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 7);

    const slots = await DarshanSlot.insertMany([
      // Kedarnath
      { temple: temple1._id, date: tomorrow, startTime: "05:00 AM", endTime: "07:00 AM", poojaType: "Rudrabhishek", totalCapacity: 30, pricePerDevotee: 501 },
      { temple: temple1._id, date: tomorrow, startTime: "08:00 AM", endTime: "11:00 AM", poojaType: "General Darshan", totalCapacity: 100, pricePerDevotee: 0 },
      { temple: temple1._id, date: dayAfter, startTime: "05:00 AM", endTime: "07:00 AM", poojaType: "Rudrabhishek", totalCapacity: 30, pricePerDevotee: 501 },
      { temple: temple1._id, date: dayAfter, startTime: "08:00 AM", endTime: "11:00 AM", poojaType: "General Darshan", totalCapacity: 100, pricePerDevotee: 0 },

      // Tirupati
      { temple: temple2._id, date: tomorrow, startTime: "03:00 AM", endTime: "06:00 AM", poojaType: "Suprabhatam Seva", totalCapacity: 50, pricePerDevotee: 300 },
      { temple: temple2._id, date: tomorrow, startTime: "09:00 AM", endTime: "01:00 PM", poojaType: "General Darshan", totalCapacity: 200, pricePerDevotee: 0 },
      { temple: temple2._id, date: dayAfter, startTime: "03:00 AM", endTime: "06:00 AM", poojaType: "Suprabhatam Seva", totalCapacity: 50, pricePerDevotee: 300 },
      { temple: temple2._id, date: nextWeek, startTime: "09:00 AM", endTime: "01:00 PM", poojaType: "VIP Darshan", totalCapacity: 25, pricePerDevotee: 1000 },

      // Somnath
      { temple: temple3._id, date: tomorrow, startTime: "06:00 AM", endTime: "08:00 AM", poojaType: "Pratah Aarti", totalCapacity: 60, pricePerDevotee: 101 },
      { temple: temple3._id, date: tomorrow, startTime: "07:00 PM", endTime: "08:00 PM", poojaType: "Sandhya Aarti", totalCapacity: 80, pricePerDevotee: 51 },
      { temple: temple3._id, date: dayAfter, startTime: "06:00 AM", endTime: "08:00 AM", poojaType: "Pratah Aarti", totalCapacity: 60, pricePerDevotee: 101 },

      // Vaishno Devi
      { temple: temple4._id, date: tomorrow, startTime: "05:00 AM", endTime: "08:00 AM", poojaType: "Aarti Darshan", totalCapacity: 75, pricePerDevotee: 0 },
      { temple: temple4._id, date: dayAfter, startTime: "05:00 AM", endTime: "08:00 AM", poojaType: "Aarti Darshan", totalCapacity: 75, pricePerDevotee: 0 },

      // Shirdi
      { temple: temple5._id, date: tomorrow, startTime: "04:00 AM", endTime: "06:00 AM", poojaType: "Kakad Aarti", totalCapacity: 50, pricePerDevotee: 0 },
      { temple: temple5._id, date: tomorrow, startTime: "11:00 AM", endTime: "12:00 PM", poojaType: "Noon Aarti", totalCapacity: 100, pricePerDevotee: 0 },
      { temple: temple5._id, date: dayAfter, startTime: "04:00 AM", endTime: "06:00 AM", poojaType: "Kakad Aarti", totalCapacity: 50, pricePerDevotee: 0 },
    ]);

    console.log("🗓️  Darshan slots created");

    // ─── Create Sample Bookings ────────────────────────────────
    await Booking.create({
      user: devotee1._id,
      temple: temple1._id,
      slot: slots[1]._id,
      devoteesCount: 2,
      totalAmount: 0,
      status: "CONFIRMED",
    });

    await Booking.create({
      user: devotee1._id,
      temple: temple2._id,
      slot: slots[5]._id,
      devoteesCount: 3,
      totalAmount: 0,
      status: "CONFIRMED",
    });

    await Booking.create({
      user: devotee2._id,
      temple: temple3._id,
      slot: slots[8]._id,
      devoteesCount: 1,
      totalAmount: 101,
      status: "CONFIRMED",
    });

    await Booking.create({
      user: devotee2._id,
      temple: temple1._id,
      slot: slots[0]._id,
      devoteesCount: 2,
      totalAmount: 1002,
      status: "CANCELLED",
    });

    console.log("🎟️  Bookings created");

    // ─── Create Sample Donations ───────────────────────────────
    await Donation.insertMany([
      { user: devotee1._id, temple: temple1._id, amount: 501,  message: "Har Har Mahadev 🙏",         status: "SUCCESS", transactionId: "TXN001" },
      { user: devotee1._id, temple: temple2._id, amount: 1001, message: "Jai Balaji 🙏",               status: "SUCCESS", transactionId: "TXN002" },
      { user: devotee2._id, temple: temple3._id, amount: 251,  message: "Om Namah Shivaya",            status: "SUCCESS", transactionId: "TXN003" },
      { user: devotee2._id, temple: temple5._id, amount: 101,  message: "Sai Ram 🙏",                  status: "SUCCESS", transactionId: "TXN004" },
      { user: devotee1._id, temple: temple4._id, amount: 201,  message: "Jai Mata Di 🙏",              status: "SUCCESS", transactionId: "TXN005" },
    ]);

    console.log("🪔 Donations created");

    // ─── Summary ───────────────────────────────────────────────
    console.log("\n🎉 Seed completed successfully!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔑 LOGIN CREDENTIALS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ADMIN     → admin@darshanease.com      / admin123");
    console.log("ORGANIZER → organizer1@darshanease.com / organizer123");
    console.log("ORGANIZER → organizer2@darshanease.com / organizer123");
    console.log("DEVOTEE   → devotee1@darshanease.com   / devotee123");
    console.log("DEVOTEE   → devotee2@darshanease.com   / devotee123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
