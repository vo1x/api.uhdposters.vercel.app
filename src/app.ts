require("dotenv").config();
import imageProxy from "./middleware/proxy";
import Express from "express";

import cors from "cors";
import router from "./routes/api";

const app = Express();

const allowedOrigins = [
  "https://uhdposters.vercel.app",
  "https://cloudfiler.vercel.app",
  "https://uhdbuilder.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(Express.json());

app.use("/", router);
app.use("/tmdb", imageProxy);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
