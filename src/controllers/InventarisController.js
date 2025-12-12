import Inventaris from "../models/InventarisModel.js";
import path from "path";
import fs from "fs";

export const getInventaris = async (req, res) => {
  try {
    const data = await Inventaris.findAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInventarisById = async (req, res) => {
  try {
    const data = await Inventaris.findByPk(req.params.id);
    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createInventaris = async (req, res) => {
  try {
    let fileName = null;

    // Jika ada upload foto
    if (req.files?.foto_barang) {
      const file = req.files.foto_barang;
      fileName = Date.now() + path.extname(file.name);

      file.mv(`uploads/${fileName}`, (err) => {
        if (err) console.log(err);
      });
    }

    const { id_user, nama_barang, kondisi, tanggal, jumlah } = req.body;

    const newData = await Inventaris.create({
      id_user,
      nama_barang,
      kondisi,
      foto_barang: fileName,
      tanggal,
      jumlah
    });

    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateInventaris = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Inventaris.findByPk(id);

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    let fileName = data.foto_barang;

    // Jika ada gambar baru
    if (req.files?.foto_barang) {
      const file = req.files.foto_barang;
      fileName = Date.now() + path.extname(file.name);

      // Hapus foto lama
      if (data.foto_barang && fs.existsSync(`uploads/${data.foto_barang}`)) {
        fs.unlinkSync(`uploads/${data.foto_barang}`);
      }

      file.mv(`uploads/${fileName}`, (err) => {
        if (err) console.log(err);
      });
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

export const deleteInventaris = async (req, res) => {
  try {
    const data = await Inventaris.findByPk(req.params.id);

    if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });

    // Hapus foto jika ada
    if (data.foto_barang && fs.existsSync(`uploads/${data.foto_barang}`)) {
      fs.unlinkSync(`uploads/${data.foto_barang}`);
    }

    await data.destroy();
    res.json({ message: "Data berhasil dihapus" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
