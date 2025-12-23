import express from "express";


import {
    createKeuangan,
    getKeuangan,
    getKeuanganById, 
    updateKeuangan,    deleteKeuangan
} from "../controllers/KeuanganController.js";

import upload from "../middleware/upload.js";

const router = express.Router();




router.get("/", getKeuangan);


router.post("/", upload.single("bukti_transaksi"), createKeuangan);


router.put("/:id", upload.single("bukti_transaksi"), updateKeuangan);


router.delete("/:id", deleteKeuangan);

router.get("/:id", getKeuanganById);


export default router;
