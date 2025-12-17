import express from "express";
import multer from "multer";
import {
  getInventaris,
  getInventarisById,
  createInventaris,
  updateInventaris,
  deleteInventaris,
} from "../controllers/InventarisController.js";

const router = express.Router(); // ✅ WAJIB

// =====================
// MULTER CONFIG
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =====================
// ROUTES (FILTER PER USER)
// =====================

// contoh: GET /api/inventaris?id_user=14
router.get("/", getInventaris);

// GET /api/inventaris/5
router.get("/:id", getInventarisById);

// POST /api/inventaris
router.post("/", upload.single("foto_barang"), createInventaris);

// PUT /api/inventaris/5
router.put("/:id", upload.single("foto_barang"), updateInventaris);

// DELETE /api/inventaris/5
router.delete("/:id", deleteInventaris);

export default router;
