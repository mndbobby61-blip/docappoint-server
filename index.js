const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// =====================
// MIDDLEWARES
// =====================
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();
// =====================
// SERVER LISTEN (আগে সার্ভার রান হবে)
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// =====================
// MongoDB CONNECT 
// =====================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// =====================
// BOOKING MODEL
// =====================
const bookingSchema = new mongoose.Schema({
  userEmail: String,
  doctorName: String,
  patientName: String,
  gender: String,
  phone: String,
  appointmentDate: String,
  appointmentTime: String,
});

const Booking = mongoose.model("Booking", bookingSchema);

// =====================
// ROUTES
// =====================

// GET ALL BOOKINGS
app.get("/api/bookings", async (req, res) => {
  try {
    const data = await Booking.find();
    res.send(data);
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch bookings" });
  }
});

// POST BOOKING
app.post("/api/bookings", async (req, res) => {
  try {
    console.log("🔥 RECEIVED:", req.body);
    const booking = new Booking(req.body);
    const result = await booking.save();
    console.log("✅ SAVED:", result);
    res.json(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to save booking" });
  }
});

// DELETE BOOKING
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Booking.deleteOne({ _id: id });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: "Failed to delete booking" });
  }
});


app.put("/api/bookings/:id", async (req, res) => {
    try {
        const updated = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});