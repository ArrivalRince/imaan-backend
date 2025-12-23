import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import keuanganRoutes from "./src/routes/KeuanganRoutes.js";
import inventarisRoutes from "./src/routes/InventarisRoutes.js";
import kegiatanRoutes from "./src/routes/KegiatanRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import testRoutes from "./src/routes/testRoutes.js"; 

import path from "path";
import { fileURLToPath } from "url";

import "./src/models/UserModel.js";
import "./src/models/KeuanganModel.js";
import "./src/models/InventarisModel.js";
import "./src/models/KegiatanModel.js";

import { initializeFirebase } from "./src/config/firebase.js";
import { startAllCronJobs } from "./src/jobs/cronJobs.js"; 

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/keuangan", keuanganRoutes);
app.use("/api/inventaris", inventarisRoutes);
app.use("/api/kegiatan", kegiatanRoutes);
app.use("/api/user", userRoutes);
app.use("/api/test", testRoutes); 

app.get("/", (req, res) => {
    res.send("Server IMAAN berjalan dengan baik 🚀");
});


const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.authenticate();
        console.log("✅ Koneksi ke MySQL berhasil!");

        await db.sync();
        console.log("✅ Semua model berhasil disinkronkan dengan database.");

        initializeFirebase();

        startAllCronJobs();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
            console.log(`📱 Akses dari Android: hhttp://http://10.0.2.2:${PORT}`);
            console.log(`💻 Akses dari lokal: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Gagal memulai server:", error);
        process.exit(1);
    }
};

startServer();
