// src/routes/fcmInventarisRoutes.js
import express from "express";
import {
  saveInventoryToken,
  sendInventoryNotification,
  checkInventarisAndSendNotification,
} from "../controllers/fcmInventarisController.js";

const router = express.Router();

router.post("/fcm/inventaris/token", saveInventoryToken);
router.post("/fcm/inventaris/send", sendInventoryNotification);
router.get("/fcm/inventaris/check/:userId", checkInventarisAndSendNotification);

export default router;
