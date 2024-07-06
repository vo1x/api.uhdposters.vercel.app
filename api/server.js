require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "https://uhdposters.vercel.app",
  "https://cloudfiler.vercel.app",
  "https://uhdbuilder.vercel.app/",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const apiRoutes = require("../routes/api");
app.use(express.json());

app.use("/", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
