
const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY belum dikonfigurasi");
}

// Endpoint pemeriksaan server
app.get("/", (req, res) => {
  res.json({
    status: "online",
    name: "My Private API",
    version: "1.0.0"
  });
});

// Middleware keamanan
function authenticate(req, res, next) {
  const key = req.get("x-api-key") || "";

  const a = Buffer.from(key);
  const b = Buffer.from(API_KEY);

  if (
    a.length !== b.length ||
    !crypto.timingSafeEqual(a, b)
  ) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized"
    });
  }

  next();
}

// Endpoint khusus pemilik API
app.get("/api/private", authenticate, (req, res) => {
  res.json({
    status: "success",
    message: "Selamat! API pribadi berhasil digunakan.",
    owner: "Admin"
  });
});

// Endpoint menerima data
app.post("/api/data", authenticate, (req, res) => {
  res.json({
    status: "success",
    message: "Data berhasil diterima",
    received: req.body
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("API berjalan pada port " + PORT);
});
