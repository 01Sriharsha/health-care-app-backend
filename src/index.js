import { config } from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { connectDB } from "./lib/db.js";
import { authRouter } from "./routes/auth.routes.js";
import { appointmentRouter } from "./routes/appointment.routes.js"
import "./lib/passport.js"

//Configure .env variables
config();
//connect to database
connectDB();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "token",
    maxAge: 3600 * 1000,
    keys : ['synapse']
  })
);

//congig OAuth Login
app.use(passport.initialize());
app.use(passport.session());

//status check
app.get("/", (req, res) => {
  res.send({
    status: "OK",
  });
});

//use routers
app.use("/auth", authRouter);
app.use("/appointment", appointmentRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
