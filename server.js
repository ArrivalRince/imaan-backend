import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./src/config/db.js"; 

import authRoutes from "./src/routes/authRoutes.js";
import keuanganRoutes from "./src/routes/KeuanganRoutes.js";
import inventarisRoutes from "./src/routes/InventarisRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

// Import SEMUA model yang memiliki relasi
import "./src/models/UserModel.js";
import "./src/models/KeuanganModel.js";
import "./src/models/InventarisModel.js";

dotenv.config();
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILE FOR UPLOADS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/keuangan", keuanganRoutes);
app.use("/api/inventaris", inventarisRoutes);

app.get("/", (req, res) => {
    res.send("Server IMAAN berjalan dengan baik 🚀");
});

// DEKLARASI PORT HANYA SEKALI
const PORT = process.env.PORT || 5000; 

// Fungsi untuk memulai server setelah koneksi DB diverifikasi
const startServer = async () => {
    try {
        await db.authenticate();
        console.log("✅ Koneksi ke MySQL berhasil!");

        await db.sync();
        console.log("✅ Semua model berhasil disinkronkan dengan database.");

        // Gunakan PORT yang sudah dideklarasikan di atas
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
            console.log(`📱 Akses dari Android: http://192.168.1.39:${PORT}`);
            console.log(`💻 Akses dari lokal: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Gagal memulai server:", error);
        process.exit(1); 
    }
};

startServer();