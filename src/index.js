import { config } from "dotenv";
import express from "express";

config();
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
