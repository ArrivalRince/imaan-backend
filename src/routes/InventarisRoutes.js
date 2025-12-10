import express from 'express';
import upload from '../middleware/upload.js';
import {
  createInventaris,
  getInventaris,
  getInventarisById,
  updateInventaris,
  deleteInventaris,
} from '../controllers/InventarisController.js';

const router = express.Router();

// GET all inventaris
router.get('/', getInventaris);

// GET inventaris by ID
router.get('/:id', getInventarisById);

// POST create inventaris
router.post('/', upload.single('foto_barang'), createInventaris);

// PUT update inventaris
router.put('/:id', upload.single('foto_barang'), updateInventaris);

// DELETE inventaris
router.delete('/:id', deleteInventaris);

export default router;
