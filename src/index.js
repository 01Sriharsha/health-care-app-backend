import { config } from "dotenv";
import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import cookieSession from "cookie-session";
import { connectDB } from "./lib/db.js";
import { authRouter } from "./routes/auth.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { workDetailsRouter } from "./routes/workDetails.routes.js";
import { specialitiesRouter } from "./routes/specialities.routes.js";
import { appointmentRouter } from "./routes/appointment.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import "./lib/passport.js";

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
    keys: ["synapse"],
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "strict",
  })
);

//config OAuth Login
app.use(passport.initialize());
app.use(passport.session());

//status check
app.get("/", (req, res) => {
  res.send({
    status: "OK",
  });
});
app.get("/health", (req, res) => {
  res.send({
    status: "Server health is OK",
  });
});

//use routers
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/workDetails", workDetailsRouter);
app.use("/appointment", appointmentRouter);
app.use("/specialities", specialitiesRouter);
app.use("/reviews", reviewRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
