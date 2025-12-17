import Kegiatan from "../models/KegiatanModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

// Pastikan folder uploads ada
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// =====================================================
// GET BY ID
// =====================================================
export const getKegiatanById = async (req, res) => {
  try {
    const data = await Kegiatan.findOne({
      where: { id_kegiatan: req.params.id },
    });
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====== CREATE ======
export const createKegiatan = async (req, res) => {
    try {
        // 1. Ambil 'penanggungjawab' dari request body, bukan 'penceramah'
        const { id_user, nama_kegiatan, tanggal_kegiatan, lokasi, penanggungjawab, deskripsi, status_kegiatan } = req.body;

        // Validasi, pastikan 'penanggungjawab' tidak kosong
        if (!id_user || !nama_kegiatan || !tanggal_kegiatan || !penanggungjawab) {
            return res.status(400).json({ msg: "Nama, tanggal, dan penanggungjawab wajib diisi." });
        }

        const url_foto = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

        // 2. Saat menyimpan ke database, gunakan variabel 'penanggungjawab'
        const data = await Kegiatan.create({
            id_user: parseInt(id_user),
            nama_kegiatan,
            tanggal_kegiatan,
            lokasi,
            penanggungjawab: penanggungjawab, // <-- SEKARANG SUDAH BENAR
            deskripsi,
            status_kegiatan,
            foto_kegiatan: url_foto
        });

        res.status(201).json({ message: "Kegiatan berhasil ditambahkan", data });

    } catch (error) {
        // Cek jika error adalah validasi database (notNull)
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => `${err.path} tidak boleh kosong.`);
            // Pesan error ini sekarang akan lebih jelas jika ada kolom lain yang salah
            return res.status(400).json({ msg: messages.join(', '), details: error.errors });
        }
        console.error("ERROR di createKegiatan:", error.message);
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
};

// ====== READ ALL (sudah benar, tidak perlu diubah) ======
export const getKegiatan = async (req, res) => {
    try {
        const response = await Kegiatan.findAll({
            order: [['id_kegiatan', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error) {
        console.error("ERROR di getKegiatan:", error.message);
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
};


// ====== UPDATE ======
export const updateKegiatan = async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Ambil 'penanggungjawab' dari request body
        const { nama_kegiatan, tanggal_kegiatan, lokasi, penanggungjawab, deskripsi, status_kegiatan } = req.body;

        const kegiatan = await Kegiatan.findByPk(id);
        if (!kegiatan) return res.status(404).json({ msg: "Data kegiatan tidak ditemukan." });

        let updateData = {
            nama_kegiatan,
            tanggal_kegiatan,
            lokasi,
            penanggungjawab: penanggungjawab, // <-- PERBAIKI JUGA DI UPDATE
            deskripsi,
            status_kegiatan,
        };
        
        if (req.file) {
            updateData.foto_kegiatan = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        await Kegiatan.update(updateData, { where: { id_kegiatan: id } });
        res.status(200).json({ message: "Kegiatan berhasil diperbarui" });

    } catch (error) {
        console.error("ERROR di updateKegiatan:", error.message);
        res.status(500).json({ msg: "Gagal memperbarui data", error: error.message });
    }
};

// ====== DELETE  ======
export const deleteKegiatan = async (req, res) => {
    try {
        const { id } = req.params;
        const kegiatan = await Kegiatan.findByPk(id);
        if (!kegiatan) return res.status(404).json({ msg: "Data kegiatan tidak ditemukan" });

        await Kegiatan.destroy({
            where: { id_kegiatan: id }
        });
        res.status(200).json({ message: "Kegiatan berhasil dihapus" });
    } catch (error) {
        console.error("ERROR di deleteKegiatan:", error.message);
        res.status(500).json({ msg: "Terjadi kesalahan pada server", error: error.message });
    }
};

// =====================================================
// GET UPCOMING
// =====================================================
export const getUpcomingKegiatan = async (req, res) => {
  try {
    const data = await Kegiatan.findAll({
      where: { tanggal_kegiatan: { [Op.gt]: new Date() } },
      order: [["tanggal_kegiatan", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// GET FINISHED
// =====================================================
export const getFinishedKegiatan = async (req, res) => {
  try {
    const data = await Kegiatan.findAll({
      where: { tanggal_kegiatan: { [Op.lt]: new Date() } },
      order: [["tanggal_kegiatan", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
