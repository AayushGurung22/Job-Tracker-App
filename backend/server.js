require("dotenv").config();
const express = require("express");
const cors = require("cors"); // add this
const connectDB = require("./config/db");
const applicationRoutes = require("./routes/applications")

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json())

app.get("/api/test", (req, res) => {
  res.json({ message: "API working" });
});

app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});