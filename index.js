const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// =====================
// MIDDLEWARES
// =====================
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app"
  ],
  credentials: true
}));

// =====================
// MONGODB
// =====================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// =====================
// MODEL
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

app.get("/api/bookings", async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

app.post("/api/bookings", async (req, res) => {
  const booking = new Booking(req.body);
  const result = await booking.save();
  res.json(result);
});

app.delete("/api/bookings/:id", async (req, res) => {
  await Booking.deleteOne({ _id: req.params.id });
  res.json({ success: true });
});

app.put("/api/bookings/:id", async (req, res) => {
  const updated = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

module.exports = app;