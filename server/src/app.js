const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/import", require("./routes/importRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
