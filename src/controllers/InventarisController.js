import Inventaris from '../models/InventarisModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function untuk membuat URL foto
const getFotoUrl = (filename) => {
  return filename ? `/uploads/${filename}` : null;
};

// Fungsi untuk ubah format tanggal Android ke MySQL (YYYY-MM-DD)
const formatTanggalUntukDB = (tgl) => {
  if (!tgl) return null;
  // Jika sudah berbentuk "YYYY-MM-DD" => ambil 10 char
  if (typeof tgl === 'string' && tgl.length >= 10) {
    return tgl.substring(0, 10);
  }
  // fallback: return null supaya validasi menangkapnya
  return null;
};

// CREATE - Tambah barang inventaris
export const createInventaris = async (req, res) => {
  try {
    console.log('=== CREATE INVENTARIS ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { id_user, nama_barang, kondisi, tanggal, jumlah } = req.body;

    // Validasi input
    if (!id_user || !nama_barang || !kondisi || !tanggal || !jumlah) {
      console.error('Validasi gagal: field tidak lengkap', { id_user, nama_barang, kondisi, tanggal, jumlah });
      return res.status(400).json({
        success: false,
        message: 'Semua field (id_user, nama_barang, kondisi, tanggal, jumlah) wajib diisi',
      });
    }

    // Validasi file
    if (!req.file) {
      console.error('Validasi gagal: foto tidak ada');
      return res.status(400).json({
        success: false,
        message: 'Foto barang wajib diupload',
      });
    }

    // Konversi tanggal ke format DB
    const tanggalDB = formatTanggalUntukDB(tanggal);
    if (!tanggalDB) {
      console.error('Validasi gagal: format tanggal tidak valid', { tanggal });
      return res.status(400).json({
        success: false,
        message: 'Format tanggal tidak valid. Gunakan format YYYY-MM-DD atau ISO (ambil 10 karakter pertama).',
      });
    }

    // Buat record baru
    const newInventaris = await Inventaris.create({
      id_user: parseInt(id_user),
      nama_barang: nama_barang.trim(),
      kondisi: kondisi.trim(),
      foto_barang: req.file.filename,
      tanggal: tanggalDB,
      jumlah: parseInt(jumlah),
    });

    console.log('Record berhasil dibuat:', newInventaris.toJSON());

    res.status(201).json({
      success: true,
      message: 'Barang inventaris berhasil ditambahkan',
      data: {
        ...newInventaris.toJSON(),
        foto_barang: getFotoUrl(newInventaris.foto_barang),
      },
    });
  } catch (error) {
    console.error('Error saat create inventaris:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan barang inventaris',
      error: error.message || String(error),
    });
  }
};

// READ - Ambil semua barang inventaris
export const getInventaris = async (req, res) => {
  try {
    console.log('=== GET ALL INVENTARIS ===');

    const inventarisList = await Inventaris.findAll({
      order: [['tanggal', 'DESC']],
    });

    console.log(`Ditemukan ${inventarisList.length} barang`);

    const formattedList = inventarisList.map((item) => ({
      ...item.toJSON(),
      foto_barang: getFotoUrl(item.foto_barang),
    }));

    res.status(200).json({
      success: true,
      message: 'Daftar barang inventaris berhasil diambil',
      data: formattedList,
    });
  } catch (error) {
    console.error('Error saat get inventaris:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar barang inventaris',
      error: error.message || String(error),
    });
  }
};

// READ BY ID - Ambil detail barang inventaris
export const getInventarisById = async (req, res) => {
  try {
    console.log('=== GET INVENTARIS BY ID ===');
    console.log('ID:', req.params.id);

    const inventaris = await Inventaris.findByPk(req.params.id);

    if (!inventaris) {
      console.warn(`Barang dengan ID ${req.params.id} tidak ditemukan`);
      return res.status(404).json({
        success: false,
        message: 'Barang inventaris tidak ditemukan',
      });
    }

    console.log('Barang ditemukan:', inventaris.toJSON());

    res.status(200).json({
      success: true,
      message: 'Detail barang inventaris berhasil diambil',
      data: {
        ...inventaris.toJSON(),
        foto_barang: getFotoUrl(inventaris.foto_barang),
      },
    });
  } catch (error) {
    console.error('Error saat get inventaris by id:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail barang inventaris',
      error: error.message || String(error),
    });
  }
};

// UPDATE - Update barang inventaris
export const updateInventaris = async (req, res) => {
  try {
    console.log('=== UPDATE INVENTARIS ===');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { nama_barang, kondisi, tanggal, jumlah } = req.body;
    const id = req.params.id;

    const inventaris = await Inventaris.findByPk(id);

    if (!inventaris) {
      console.warn(`Barang dengan ID ${id} tidak ditemukan`);
      return res.status(404).json({
        success: false,
        message: 'Barang inventaris tidak ditemukan',
      });
    }

    // Update field
    if (nama_barang) inventaris.nama_barang = nama_barang.trim();
    if (kondisi) inventaris.kondisi = kondisi.trim();
    if (jumlah) inventaris.jumlah = parseInt(jumlah);

    if (tanggal) {
      const tanggalDB = formatTanggalUntukDB(tanggal);
      if (tanggalDB) {
        inventaris.tanggal = tanggalDB;
      } else {
        console.warn('Tanggal update tidak valid:', { tanggal });
      }
    }

    // Update foto jika ada file baru
    if (req.file) {
      inventaris.foto_barang = req.file.filename;
      console.log('Foto diupdate ke:', req.file.filename);
    }

    await inventaris.save();

    console.log('Record berhasil diupdate:', inventaris.toJSON());

    res.status(200).json({
      success: true,
      message: 'Barang inventaris berhasil diperbarui',
      data: {
        ...inventaris.toJSON(),
        foto_barang: getFotoUrl(inventaris.foto_barang),
      },
    });
  } catch (error) {
    console.error('Error saat update inventaris:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui barang inventaris',
      error: error.message || String(error),
    });
  }
};

// DELETE - Hapus barang inventaris
export const deleteInventaris = async (req, res) => {
  try {
    console.log('=== DELETE INVENTARIS ===');
    console.log('ID:', req.params.id);

    const id = req.params.id;
    const inventaris = await Inventaris.findByPk(id);

    if (!inventaris) {
      console.warn(`Barang dengan ID ${id} tidak ditemukan`);
      return res.status(404).json({
        success: false,
        message: 'Barang inventaris tidak ditemukan',
      });
    }

    const namaBarang = inventaris.nama_barang;

    await inventaris.destroy();

    console.log(`Record dengan ID ${id} (${namaBarang}) berhasil dihapus`);

    res.status(200).json({
      success: true,
      message: 'Barang inventaris berhasil dihapus',
      data: { id_inventaris: id, nama_barang: namaBarang },
    });
  } catch (error) {
    console.error('Error saat delete inventaris:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus barang inventaris',
      error: error.message || String(error),
    });
  }
};
