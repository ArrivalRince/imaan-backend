import express from "express";
import { register, login, verifyToken } from "../controllers/authController.js";

const router = express.Router();

//Registrasi user baru
router.post("/register", register);

//Login user (cek email dan password)
router.post("/login", login);

//Verifikasi token JWT (opsional)
router.get("/verify", verifyToken);

export default router;
