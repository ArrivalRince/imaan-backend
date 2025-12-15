import express from "express";
import {
  getKegiatan,
  getKegiatanById,
  createKegiatan,
  updateKegiatan,
  deleteKegiatan
} from "../controllers/KegiatanController.js";

const router = express.Router();

// GET semua kegiatan
router.get("/", getKegiatan);

// GET by id
router.get("/:id", getKegiatanById);

// POST create kegiatan
router.post("/", createKegiatan);

// UPDATE
router.put("/:id", updateKegiatan);

// DELETE
router.delete("/:id", deleteKegiatan);

export default router;
