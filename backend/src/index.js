const express = require("express");
const cors = require("cors");
require("dotenv").config();
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main API Routes
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("Pashmina API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
