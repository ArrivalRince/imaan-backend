import Keuangan from "../models/KeuanganModel.js";

// ====== CREATE ======
export const createKeuangan = async (req, res) => {
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

// ====== READ ALL ======
export const getKeuangan = async (req, res) => {
    try {
        const data = await Keuangan.findAll({
            order: [["tanggal", "DESC"]]
        });
        res.status(200).json(data);
    } catch (error) {
        console.error("ERROR di getKeuangan:", error.message);
        res.status(500).json({ msg: "Gagal mengambil data", error: error.message });
    }
};

// ====== READ BY ID ======
export const getKeuanganById = async (req, res) => {
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
