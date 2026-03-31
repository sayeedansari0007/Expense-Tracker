const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

// Serve static frontend (React build)
app.use(express.static(path.join(__dirname, "public")));

const User = require("./models/User");

/* =========================
   MONGODB CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

/* =========================
   API ROUTES
========================= */

app.post("/api/save-user", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId) {
      return res.status(400).json({
        success: false,
        message: "clerkId required",
      });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        name,
      });
    }

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

/* =========================
   FRONTEND ROUTE (IMPORTANT 🔥)
========================= */

// React app serve (for all routes)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});