import express from "express";
import {
  sendTestNotification,
  getFcmStatus,
  getCronInfo,
} from "../controllers/testController.js";

const router = express.Router();


router.post("/send-notification", sendTestNotification);

// Cek status FCM token user
router.get("/fcm-status/:id", getFcmStatus);

// Cek info cron jobs
router.get("/cron-info", getCronInfo);

export default router;
