require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

// app.use(
//   cors({
//     origin: "https://uhdposters.vercel.app",
//     optionsSuccessStatus: 200,
//   })
// );

// app.use(
//   cors({
//     origin: "https://c8cb-2400-1a00-bc10-57b5-d5e6-2094-558e-f1d8.ngrok-free.app",
//     optionsSuccessStatus: 200,
//   })
// );

const allowedOrigins = [
  "https://uhdposters.vercel.app",
  "https://cloudfiler.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins, or if it is undefined (for non-browser environments)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const apiRoutes = require("../routes/api");
app.use(express.json());

app.use("/", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
