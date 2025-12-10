import express from "express";

// 1. Impor SEMUA fungsi yang dibutuhkan dari controller
import {
    createKeuangan,
    getKeuangan,
    getKeuanganById, // <-- TAMBAHKAN INI
    updateKeuangan,    deleteKeuangan
} from "../controllers/KeuanganController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// Definisikan semua rute yang diperlukan oleh aplikasi
// ================== PENTING: Urutan route sangat penting! ==================
// Route yang lebih spesifik harus didefinisikan SEBELUM route yang lebih umum

// GET /api/keuangan/ -> Mengambil semua data keuangan
router.get("/", getKeuangan);

// POST /api/keuangan/ -> Membuat data baru (dengan upload gambar)
router.post("/", upload.single("bukti_transaksi"), createKeuangan);

// PUT /api/keuangan/:id -> Memperbarui data berdasarkan ID (dengan atau tanpa upload gambar baru)
router.put("/:id", upload.single("bukti_transaksi"), updateKeuangan);

// DELETE /api/keuangan/:id -> Menghapus data berdasarkan ID
router.delete("/:id", deleteKeuangan);

// GET /api/keuangan/:id -> Mengambil SATU data keuangan berdasarkan ID
// HARUS PALING AKHIR agar tidak konflik dengan route yang lebih spesifik
router.get("/:id", getKeuanganById);
// =========================================================================

export default router;
