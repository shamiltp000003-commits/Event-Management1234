import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";

import SignUp from "./User/routes/signUp.js";
import Login from "./User/routes/login.js";
import AddServicess from "./provider/routes/routes.js";
import ViewProviders from "./Admin/routes/routes.js";
import createBooking from "./User/routes/booking.js";
import reviewRoutes from "./User/routes/review.js";
dotenv.config(); // Load environment variables

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------- MongoDB Connection ---------- */
const MONGO_URI = process.env.MONGODB_URL || "mongodb+srv://shamiltp000003_db_user:qLhQ0rqT1btffVnc@cluster0.wgdxc0a.mongodb.net/?appName=Cluster0";
console.log(MONGO_URI, "mongo");



mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error:", err));
/* ---------- Middleware ---------- */
app.use(
  cors({
    origin: "https://event-management1234.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ---------- Static folder ---------- */
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

/* ---------- Routes ---------- */
app.use("/api", SignUp);
app.use("/api", Login);
app.use("/api", AddServicess);
app.use("/api", ViewProviders);
app.use("/api", createBooking);
app.use("/api", reviewRoutes);

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
