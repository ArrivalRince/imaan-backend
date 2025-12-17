import express from "express";
import {
  getKegiatan,
  getKegiatanById,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan
} from "../controllers/KegiatanController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// GET semua kegiatan
router.get("/", getKegiatan);

// GET by id
router.get("/:id", getKegiatanById);

// POST create kegiatan
router.post("/", upload.single("foto_kegiatan"), createKegiatan);

// UPDATE
router.put("/:id", upload.single("foto_kegiatan"), updateKegiatan);

// DELETE
router.delete("/:id", deleteKegiatan);

export default router;
