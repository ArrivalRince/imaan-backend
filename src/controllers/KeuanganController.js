// File: controllers/KeuanganController.js

import Keuangan from "../models/KeuanganModel.js";

// ====== CREATE ======
export const createKeuangan = async (req, res) => {
    // ... (Fungsi ini sudah benar, tidak perlu diubah)
    try {
        const { id_user, keterangan, tipe_transaksi, tanggal, jumlah } = req.body;

        if (!id_user || !keterangan || !tipe_transaksi || !tanggal || !jumlah) {
            return res.status(400).json({ msg: "Semua field teks wajib diisi." });
        }

        const url_bukti = req.file 
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` 
            : null;

        const data = await Keuangan.create({
            id_user: parseInt(id_user),
            keterangan,
            tipe_transaksi,
            tanggal,
            bukti_transaksi: url_bukti,
            jumlah: parseInt(jumlah)
        });

        res.status(201).json({ message: "Transaksi berhasil ditambahkan", data });

    } catch (error) {
        console.error("ERROR di createKeuangan:", error.message);
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
};

// =======================================================================
// ===              PERBAIKAN UTAMA BACKEND ADA DI SINI                ===
// =======================================================================
// ====== READ ALL (dengan filter id_user) ======
export const getKeuangan = async (req, res) => {
    try {
        // 1. Ambil id_user dari query parameter URL (contoh: /api/keuangan?id_user=1)
        const { id_user } = req.query;

        // 2. Validasi: Jika tidak ada id_user, jangan kirim data apapun.
        if (!id_user) {
            return res.status(400).json({ msg: "Parameter id_user wajib disertakan." });
        }

        // 3. Gunakan id_user di dalam query database untuk memfilter data.
        const data = await Keuangan.findAll({
            where: {
                id_user: id_user // Hanya ambil data yang id_user-nya cocok
            },
            order: [["tanggal", "DESC"]]
        });

        res.status(200).json(data);
    } catch (error) {
        console.error("ERROR di getKeuangan:", error.message);
        res.status(500).json({ msg: "Gagal mengambil data", error: error.message });
    }
};
// =======================================================================

// ====== READ BY ID ======
export const getKeuanganById = async (req, res) => {
    // ... (Fungsi ini sudah benar, tidak perlu diubah)
    try {
        const { id } = req.params;
        console.log("getKeuanganById: Mencari data dengan id =", id);
        
        const data = await Keuangan.findByPk(id);
        
        if (!data) {
            console.log("getKeuanganById: Data tidak ditemukan untuk id =", id);
            return res.status(404).json({ msg: "Data tidak ditemukan", id });
        }
        
        console.log("getKeuanganById: Data ditemukan:", JSON.stringify(data));
        res.status(200).json(data);
    } catch (error) {
        console.error("ERROR di getKeuanganById:", error.message);
        res.status(500).json({ msg: "Gagal mengambil data", error: error.message });
    }
};

// ====== UPDATE ======
export const updateKeuangan = async (req, res) => {
    // ... (Fungsi ini sudah benar, tidak perlu diubah)
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            updateData.bukti_transaksi = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const data = await Keuangan.findByPk(id);
        if (!data) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }

        await Keuangan.update(updateData, { where: { id_transaksi: id } });
        res.status(200).json({ message: "Transaksi berhasil diperbarui" });
    } catch (error) {
        console.error("ERROR di updateKeuangan:", error.message);
        res.status(500).json({ msg: "Gagal memperbarui data", error: error.message });
    }
};

// ====== DELETE ======
export const deleteKeuangan = async (req, res) => {
    // ... (Fungsi ini sudah benar, tidak perlu diubah)
    try {
        const { id } = req.params;
        const data = await Keuangan.findByPk(id);
        if (!data) {
            return res.status(404).json({ msg: "Data tidak ditemukan" });
        }
        await Keuangan.destroy({ where: { id_transaksi: id } });
        res.status(200).json({ message: "Transaksi berhasil dihapus" });
    } catch (error) {
        console.error("ERROR di deleteKeuangan:", error.message);
        res.status(500).json({ msg: "Gagal menghapus data", error: error.message });
    }
};
