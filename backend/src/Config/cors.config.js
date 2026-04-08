const cors = require("cors");

let allowedOrigins = ["http://localhost:5173"];

try {
  if (process.env.CORS_ORIGIN) {
    allowedOrigins = JSON.parse(process.env.CORS_ORIGIN);
  }
} catch (error) {
  console.error("Invalid CORS_ORIGIN in .env. Using default localhost:5173");
}

module.exports = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
});