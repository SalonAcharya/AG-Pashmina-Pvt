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
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Session — needed by Passport during the OAuth handshake only
app.use(
  session({
    secret: process.env.SESSION_SECRET || "changeme_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Main API Routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Pashmina API is running");
});

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
wsService.init(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
