import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import db from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import keuanganRoutes from "./src/routes/KeuanganRoutes.js";
import inventarisRoutes from "./src/routes/InventarisRoutes.js";
import kegiatanRoutes from "./src/routes/KegiatanRoutes.js";
import fcmInventarisRoutes from "./src/routes/fcmInventarisRoutes.js";

// Cron Job
import { startInventarisReminderJob } from "./src/jobs/inventarisReminderJob.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder uploads (kalau ada)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/keuangan", keuanganRoutes);
app.use("/api/inventaris", inventarisRoutes);
app.use("/api/kegiatan", kegiatanRoutes);
app.use("/api", fcmInventarisRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "IMAAN backend running",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await db.authenticate();
    console.log("✅ DB connected");

    await db.sync();
    console.log("✅ DB synced");

    // ✅ Cron job start (notif otomatis)
    startInventarisReminderJob();
    console.log("✅ Inventaris reminder job started");

    // ✅ PENTING: listen ke 0.0.0.0 agar bisa diakses emulator & HP
 app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
            console.log(`📱 Akses dari Android: hhttp://http://10.0.2.2:${PORT}`);
            console.log(`💻 Akses dari lokal: http://localhost:${PORT}`);
        });
  } catch (err) {
    console.error("❌ Server failed:", err);
    process.exit(1);
  }
}

startServer();
