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
// GET ALL
// =====================================================
export const getKegiatan = async (req, res) => {
  try {
    const data = await Kegiatan.findAll({
      order: [["tanggal_kegiatan", "ASC"]],
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

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

// =====================================================
// CREATE
// =====================================================
export const createKegiatan = async (req, res) => {
  try {
    let fileName = null;

    if (req.file) {
      // Buat nama unik
      fileName = Date.now() + path.extname(req.file.originalname);

      // Pindahkan file ke folder uploads
      fs.renameSync(req.file.path, path.join(uploadDir, fileName));
      fileName = `/uploads/${fileName}`;
    }

    const {
      id_user,
      nama_kegiatan,
      tanggal_kegiatan,
      lokasi,
      penceramah,
      deskripsi,
      status_kegiatan,
    } = req.body;

    const newData = await Kegiatan.create({
      id_user,
      nama_kegiatan,
      tanggal_kegiatan,
      lokasi,
      penceramah,
      deskripsi: deskripsi || null,
      status_kegiatan: status_kegiatan || "Akan Datang",
      foto_kegiatan: fileName,
    });

    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// UPDATE
// =====================================================
export const updateKegiatan = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Kegiatan.findOne({ where: { id_kegiatan: id } });

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    let filePath = data.foto_kegiatan; // may be null or '/uploads/xx.jpg'

    if (req.file) {
      const newFileName = Date.now() + path.extname(req.file.originalname);

      // Hapus foto lama jika ada
      if (data.foto_kegiatan) {
        const oldPath = path.join(process.cwd(), data.foto_kegiatan);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Pindahkan file baru
      fs.renameSync(req.file.path, path.join(uploadDir, newFileName));
      filePath = `/uploads/${newFileName}`;
    }

    const {
      id_user,
      nama_kegiatan,
      tanggal_kegiatan,
      lokasi,
      penceramah,
      deskripsi,
      status_kegiatan,
    } = req.body;

    await data.update({
      id_user,
      nama_kegiatan,
      tanggal_kegiatan,
      lokasi,
      penceramah,
      deskripsi: deskripsi || null,
      status_kegiatan: status_kegiatan || data.status_kegiatan,
      foto_kegiatan: filePath,
    });

    res.json({ message: "Data berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// DELETE
// =====================================================
export const deleteKegiatan = async (req, res) => {
  try {
    const data = await Kegiatan.findOne({ where: { id_kegiatan: req.params.id } });

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    // Hapus foto jika ada
    if (data.foto_kegiatan) {
      const fotoPath = path.join(process.cwd(), data.foto_kegiatan);
      if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }

    await data.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
