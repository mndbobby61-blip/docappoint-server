const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

// =====================
// MIDDLEWARE
// =====================
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://YOUR-FRONTEND.vercel.app"
    ],
    credentials: true,
  })
);

// =====================
// MONGODB
// =====================
const client = new MongoClient(process.env.MONGODB_URI);

let bookingCollection;

async function connectDB() {
  if (!bookingCollection) {
    await client.connect();
    const db = client.db("docappoint");
    bookingCollection = db.collection("bookings");
    console.log("✅ MongoDB Connected");
  }
}

// =====================
// ROUTES
// =====================

// GET
app.get("/api/bookings", async (req, res) => {
  try {
    await connectDB();
    const data = await bookingCollection.find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST
app.post("/api/bookings", async (req, res) => {
  try {
    await connectDB();
    const result = await bookingCollection.insertOne(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await bookingCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/api/bookings/:id", async (req, res) => {
  try {
    await connectDB();
    const result = await bookingCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body },
      { returnDocument: "after" }
    );
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================
// EXPORT FOR VERCEL
// =====================
module.exports = app;