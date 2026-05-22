const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://your-frontend.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// MongoDB setup
const client = new MongoClient(process.env.MONGODB_URI);

let bookingCollection;

// connect DB
async function connectDB() {
  try {
    await client.connect();
    const db = client.db("docappoint");
    bookingCollection = db.collection("bookings");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("DB Error:", err);
  }
}

connectDB();

// =====================
// ROUTES
// =====================

// GET all
app.get("/api/bookings", async (req, res) => {
  const data = await bookingCollection.find().toArray();
  res.send(data);
});

// POST
app.post("/api/bookings", async (req, res) => {
  const result = await bookingCollection.insertOne(req.body);
  res.send(result);
});

// DELETE
app.delete("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;

  const result = await bookingCollection.deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

// UPDATE
app.put("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;

  const result = await bookingCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: req.body }
  );

  res.send(result);
});

// IMPORTANT FOR VERCEL
module.exports = app;