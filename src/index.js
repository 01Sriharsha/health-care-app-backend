import { config } from "dotenv";
import express from "express";
import { connectDB } from "./lib/db.js";


//Configure .env variables
config();
//connect to database
connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send({
    status: "OK",
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
