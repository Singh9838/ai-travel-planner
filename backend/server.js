const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const tripRoutes = require("./routes/tripRoute");
const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");

dotenv.config();


connectDB();


const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => {
  res.send("AI Travel Planner API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});