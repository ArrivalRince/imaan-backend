import cron from "node-cron";

import FcmInventarisToken from "../models/fcmInventarisToken.js";
import { sendInventarisReminderForUser } from "../controllers/fcmInventarisController.js";

export function startInventarisReminderJob() {
  cron.schedule(
    "*/1 * * * *", // testing: tiap 1 menit
    async () => {
      console.log("[CRON] Inventaris reminder job running");

      try {
        const tokens = await FcmInventarisToken.findAll();

        for (const t of tokens) {
          if (!t.userId || !t.fcmToken) continue;
          await sendInventarisReminderForUser(t.userId, t.fcmToken);
        }

        console.log("[CRON] Inventaris reminder job done");
      } catch (err) {
        console.error("[CRON] ERROR:", err.message);
      }
    },
    { timezone: "Asia/Jakarta" }
  );
}
