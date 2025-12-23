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


router.get("/", getKegiatan);

router.get("/:id", getKegiatanById);

router.post("/", upload.single("foto_kegiatan"), createKegiatan);

router.put("/:id", upload.single("foto_kegiatan"), updateKegiatan);

router.delete("/:id", deleteKegiatan);

export default router;
