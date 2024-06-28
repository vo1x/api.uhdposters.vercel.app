require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "https://uhdposters.vercel.app",
    optionsSuccessStatus: 200,
  })
);

const apiRoutes = require("../routes/api");
app.use(express.json());

app.use("/", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
