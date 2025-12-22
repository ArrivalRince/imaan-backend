import FcmInventarisToken from "../models/fcmInventarisToken.js";
import admin from "../firebase.js";

// ✅ SAMAKAN DENGAN ANDROID CHANNEL ID
const CHANNEL_ID = "inventory_reminder";

// =========================
// SIMPAN TOKEN (dipanggil dari Android setelah login)
// =========================
export const saveInventoryToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;

    if (!userId || !fcmToken) {
      return res.status(400).json({ message: "userId & fcmToken wajib" });
    }

    // Sequelize upsert
    await FcmInventarisToken.upsert({ userId, fcmToken });

    return res.json({ message: "Token inventaris berhasil disimpan" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// =========================
// KIRIM NOTIF MANUAL (optional endpoint)
// =========================
export const sendInventoryNotification = async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    if (!userId) return res.status(400).json({ message: "userId wajib" });

    const tokenData = await FcmInventarisToken.findOne({ where: { userId } });
    if (!tokenData?.fcmToken) {
      return res.status(404).json({ message: "Token tidak ditemukan" });
    }

    const message = {
      token: tokenData.fcmToken,
      notification: {
        title: title || "Reminder Inventaris",
        body: body || "Ada inventaris yang perlu dicek. Silakan periksa.",
      },
      data: {
        type: "inventaris",
        userId: String(userId),
      },
      android: {
        priority: "high",
        notification: {
          channelId: CHANNEL_ID,
        },
      },
    };

    const resp = await admin.messaging().send(message);
    return res.json({ message: "Notif inventaris dikirim", resp });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// =========================
// ✅ FUNGSI YANG DIPANGGIL CRON (AUTO, TANPA BUKA APP)
// Ini inti otomatisnya.
// =========================
export const sendInventarisReminderForUser = async (userId, fcmTokenFromDb = null) => {
  // userId wajib
  const uid = Number(userId);
  if (!uid) return { sent: false, reason: "invalid_userId" };

  // ambil token (pakai yang dikirim dari job kalau ada)
  let fcmToken = fcmTokenFromDb;

  if (!fcmToken) {
    const tokenData = await FcmInventarisToken.findOne({ where: { userId: uid } });
    fcmToken = tokenData?.fcmToken || null;
  }

  if (!fcmToken) return { sent: false, reason: "no_token" };

  // TODO: ganti rule ini dengan logic inventaris kamu yang sebenarnya
  // Misal: cek tabel inventaris apakah ada item yang last_checked > 90 hari.
  // Untuk sekarang: contoh sederhana = selalu kirim (jangan dipakai produksi).
  const shouldNotify = true;

  if (!shouldNotify) return { sent: false, reason: "no_stale_items" };

  const message = {
    token: fcmToken,
    notification: {
      title: "Reminder Inventaris",
      body: "Ada inventaris yang sudah lama tidak dicek. Silakan periksa.",
    },
    data: {
      type: "inventaris_reminder",
      userId: String(uid),
      action: "open_inventaris",
    },
    android: {
      priority: "high",
      notification: {
        channelId: CHANNEL_ID,
      },
    },
  };

  try {
    const resp = await admin.messaging().send(message);
    return { sent: true, resp };
  } catch (e) {
    // kalau token invalid, idealnya hapus token biar tidak error terus
    const msg = String(e?.message || "");
    if (
      msg.includes("registration-token-not-registered") ||
      msg.includes("Invalid registration token")
    ) {
      await FcmInventarisToken.destroy({ where: { userId: uid } });
    }
    return { sent: false, reason: msg };
  }
};

// =========================
// OPSIONAL: endpoint check-inventaris/{userId}
// Kamu bisa pakai ini kalau mau trigger manual dari app,
// tapi ini BUKAN mekanisme utama untuk notif "tanpa buka app".
// =========================
export const checkInventarisAndSendNotification = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) return res.status(400).json({ message: "userId invalid" });

    const tokenData = await FcmInventarisToken.findOne({ where: { userId } });
    if (!tokenData?.fcmToken) {
      return res.status(404).json({ message: "Token tidak ditemukan" });
    }

    // TODO: cek aturan inventaris > 3 bulan di sini
    const shouldNotify = true;

    if (!shouldNotify) {
      return res.json({ message: "Tidak ada inventaris yang perlu diingatkan" });
    }

    const message = {
      token: tokenData.fcmToken,
      notification: {
        title: "Reminder Inventaris",
        body: "Ada inventaris yang sudah lama tidak dicek. Silakan periksa.",
      },
      data: {
        type: "inventaris_reminder",
        userId: String(userId),
      },
      android: {
        priority: "high",
        notification: {
          channelId: CHANNEL_ID,
        },
      },
    };

    await admin.messaging().send(message);
    return res.json({ message: "Notif reminder inventaris dikirim" });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};
