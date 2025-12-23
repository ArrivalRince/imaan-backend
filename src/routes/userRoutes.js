import express from "express";
import {
  updateFcmToken,
  deleteFcmToken,
  getUserById,
} from "../controllers/userController.js";

const router = express.Router();

// Get user profile
router.get("/:id", getUserById);

// Update FCM token (saat login/app start)
router.post("/fcm-token", updateFcmToken);

// Delete FCM token (saat logout)
router.delete("/fcm-token/:id", deleteFcmToken);

export default router;
