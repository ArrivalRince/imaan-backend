import Inventaris from "../models/InventarisModel.js";
import path from "path";
import fs from "fs";

// Pastikan folder uploads ada
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// =====================================================
// GET ALL
// =====================================================
export const getInventaris = async (req, res) => {
  try {
    const data = await Inventaris.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// GET BY ID
// =====================================================
export const getInventarisById = async (req, res) => {
  try {
    const data = await Inventaris.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// CREATE
// =====================================================
export const createInventaris = async (req, res) => {
  try {
    let fileName = null;

    if (req.file) {
      // Buat nama unik
      fileName = Date.now() + path.extname(req.file.originalname);

      // Pindahkan file ke folder uploads
      fs.renameSync(req.file.path, path.join(uploadDir, fileName));
    }

    const { id_user, nama_barang, kondisi, tanggal, jumlah } = req.body;

    const newData = await Inventaris.create({
      id_user,
      nama_barang,
      kondisi,
      foto_barang: fileName ? `/uploads/${fileName}` : null,
      tanggal,
      jumlah
    });

    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// UPDATE
// =====================================================
export const updateInventaris = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Inventaris.findByPk(id);

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    let fileName = data.foto_barang;

    if (req.file) {
      const newFileName = Date.now() + path.extname(req.file.originalname);

      // Hapus foto lama jika ada
      if (data.foto_barang) {
        const oldPath = path.join(process.cwd(), data.foto_barang);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Pindahkan file baru
      fs.renameSync(req.file.path, path.join(uploadDir, newFileName));

      fileName = `/uploads/${newFileName}`;
    }

    const { id_user, nama_barang, kondisi, tanggal, jumlah } = req.body;

    await data.update({
      id_user,
      nama_barang,
      kondisi,
      foto_barang: fileName,
      tanggal,
      jumlah
    });

    res.json({ message: "Data berhasil diperbarui" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// DELETE
// =====================================================
export const deleteInventaris = async (req, res) => {
  try {
    const data = await Inventaris.findByPk(req.params.id);

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    // Hapus foto lama jika ada
    if (data.foto_barang) {
      const fotoPath = path.join(process.cwd(), data.foto_barang);
      if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
    }

    await data.destroy();
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
