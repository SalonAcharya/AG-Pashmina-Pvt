const express = require("express");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
require("dotenv").config();
const passport = require("./config/passport");
const apiRoutes = require("./routes/api");
const wsService = require("./config/ws");
const path = require("path");

const app = express();
app.set("trust proxy", 1); // Trust the proxy (Render) to handle HTTPS correctly
const PORT = process.env.PORT || 5000;

// ✅ Allowed origins (dev + production)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://agpashmina.com.np",
  "https://www.agpashmina.com.np",
  "https://ag-pashmina-pvt-ltd.vercel.app",
];

// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / mobile apps

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// ✅ Session (fixed for production HTTPS)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "changeme_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true, // required for HTTPS (Render)
      sameSite: "none", // required for cross-origin (Vercel ↔ Render)
    },
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Main API Routes
app.use("/api", apiRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Pashmina API is running");
});

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
wsService.init(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
