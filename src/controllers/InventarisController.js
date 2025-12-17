import path from "path";
import fs from "fs";
import Inventaris from "../models/InventarisModel.js";

// helper: ubah multer file -> path yang disimpan ke DB
const getUploadedFotoPathForDb = (req) => {
  if (!req.file) return null;
  // hasil upload middleware biasanya menyimpan di folder "uploads/"
  return `/uploads/${req.file.filename}`;
};

// helper: hapus file lama jika ada
const deleteFileIfExists = (dbPath) => {
  if (!dbPath) return;

  // dbPath contoh: "/uploads/xxxxx.jpg"
  const relative = dbPath.startsWith("/") ? dbPath.slice(1) : dbPath;
  const absolute = path.resolve(relative);

  if (fs.existsSync(absolute)) {
    fs.unlinkSync(absolute);
  }
};

// =====================
// READ LIST (FILTER USER)
// =====================
export const getInventaris = async (req, res) => {
  try {
    const idUserRaw = req.query.id_user;

    if (!idUserRaw) {
      return res.status(400).json({
        message: "Parameter id_user wajib dikirim. Contoh: /api/inventaris?id_user=14",
      });
    }

    const id_user = parseInt(idUserRaw, 10);
    if (Number.isNaN(id_user)) {
      return res.status(400).json({ message: "id_user harus angka" });
    }

    const data = await Inventaris.findAll({
      where: { id_user },
      order: [["id_inventaris", "DESC"]],
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("getInventaris error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// =====================
// READ DETAIL
// =====================
export const getInventarisById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Inventaris.findByPk(id);

    if (!data) {
      return res.status(404).json({ message: "Data inventaris tidak ditemukan" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("getInventarisById error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// =====================
// CREATE
// =====================
export const createInventaris = async (req, res) => {
  try {
    const { id_user, nama_barang, kondisi, tanggal, jumlah } = req.body;

    if (!id_user || !nama_barang || !tanggal || !jumlah) {
      return res.status(400).json({
        message: "Field wajib: id_user, nama_barang, tanggal, jumlah",
      });
    }

    const parsedUserId = parseInt(id_user, 10);
    const parsedJumlah = parseInt(jumlah, 10);

    if (Number.isNaN(parsedUserId)) {
      return res.status(400).json({ message: "id_user harus angka" });
    }
    if (Number.isNaN(parsedJumlah)) {
      return res.status(400).json({ message: "jumlah harus angka" });
    }

    const foto_barang = getUploadedFotoPathForDb(req);

    const created = await Inventaris.create({
      id_user: parsedUserId,
      nama_barang,
      kondisi: kondisi ?? "Baik",
      foto_barang,
      tanggal,
      jumlah: parsedJumlah,
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("createInventaris error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// =====================
// UPDATE
// =====================
export const updateInventaris = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Inventaris.findByPk(id);
    if (!existing) {
      return res.status(404).json({ message: "Data inventaris tidak ditemukan" });
    }

    const { nama_barang, kondisi, tanggal, jumlah } = req.body;

    // kalau upload foto baru, hapus yang lama
    const newFotoPath = getUploadedFotoPathForDb(req);
    if (newFotoPath) {
      deleteFileIfExists(existing.foto_barang);
    }

    const updated = await existing.update({
      nama_barang: nama_barang ?? existing.nama_barang,
      kondisi: kondisi ?? existing.kondisi,
      tanggal: tanggal ?? existing.tanggal,
      jumlah: jumlah ? parseInt(jumlah, 10) : existing.jumlah,
      foto_barang: newFotoPath ?? existing.foto_barang,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error("updateInventaris error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// =====================
// DELETE
// =====================
export const deleteInventaris = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Inventaris.findByPk(id);
    if (!existing) {
      return res.status(404).json({ message: "Data inventaris tidak ditemukan" });
    }

    deleteFileIfExists(existing.foto_barang);
    await existing.destroy();

    return res.status(200).json({ message: "Data inventaris berhasil dihapus" });
  } catch (error) {
    console.error("deleteInventaris error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
