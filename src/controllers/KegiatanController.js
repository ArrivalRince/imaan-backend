import Kegiatan from "../models/KegiatanModel.js";

// =====================
// GET KEGIATAN BY USER
// =====================
export const getKegiatan = async (req, res) => {
  try {
    const { id_user } = req.query;

    if (!id_user) {
      return res.status(400).json({ msg: "id_user wajib dikirim" });
    }

    const data = await Kegiatan.findAll({
      where: { id_user: parseInt(id_user) },
      order: [["id_kegiatan", "DESC"]],
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// =====================
// GET BY ID
// =====================
export const getKegiatanById = async (req, res) => {
  try {
    const data = await Kegiatan.findByPk(req.params.id);
    if (!data) return res.status(404).json({ msg: "Data tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// =====================
// CREATE
// =====================
export const createKegiatan = async (req, res) => {
  try {
    const {
      id_user,
      nama_kegiatan,
      tanggal_kegiatan,
      lokasi,
      penanggungjawab,
      deskripsi,
      status_kegiatan,
    } = req.body;

    const foto = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const data = await Kegiatan.create({
      id_user,
      nama_kegiatan,
      tanggal_kegiatan,
      lokasi,
      penanggungjawab,
      deskripsi,
      status_kegiatan,
      foto_kegiatan: foto,
    });

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// =====================
// UPDATE
// =====================
export const updateKegiatan = async (req, res) => {
  try {
    const { id } = req.params;

    const foto = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : undefined;

    await Kegiatan.update(
      { ...req.body, ...(foto && { foto_kegiatan: foto }) },
      { where: { id_kegiatan: id } }
    );

    res.json({ msg: "Kegiatan diperbarui" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// =====================
// DELETE
// =====================
export const deleteKegiatan = async (req, res) => {
  try {
    await Kegiatan.destroy({
      where: { id_kegiatan: req.params.id },
    });
    res.json({ msg: "Kegiatan dihapus" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
