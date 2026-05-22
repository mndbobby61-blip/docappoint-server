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
app.use(cors({
    origin: [
        "http://localhost:3000",
    ],
    credentials: true,
}));

app.use(cookieParser());

app.use(express.json());
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

// =====================
// JWT ROUTE
// =====================

app.post("/jwt", async (req, res) => {

    const user = req.body;

    const token = jwt.sign(

        user,

        process.env.JWT_SECRET,

        {
            expiresIn: "7d",
        }

    );

    res.cookie("token", token, {

        httpOnly: true,

        secure: false,

        sameSite: "lax",

    });

    res.send({

        success: true,

    });

});

// =====================
// VERIFY TOKEN
// =====================

const verifyToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {

        return res.status(401).send({

            message: "Unauthorized access",

        });

    }

    jwt.verify(

        token,

        process.env.JWT_SECRET,

        (err, decoded) => {

            if (err) {

                return res.status(401).send({

                    message: "Unauthorized access",

                });

            }

            req.decoded = decoded;

            next();

        }

    );

};

// GET ALL BOOKINGS
app.get("/api/bookings", verifyToken, async (req, res) => {

    try {

        const email = req.query.email;

        // SECURITY CHECK

        if (email !== req.decoded.email) {

            return res.status(403).send({

                message: "Forbidden access",

            });

        }

        const data = await Booking.find({

            userEmail: email,

        });

        res.send(data);

    } catch (error) {

        res.status(500).send({

            error: "Failed to fetch bookings",

        });

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