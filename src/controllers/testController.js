import { sendNotificationToUser } from "../services/notificationService.js";

/**
 * Test endpoint - Kirim notifikasi push ke user tertentu
 * POST /api/test/send-notification
 * Body: { id_user: number, title: string, message: string }
 */
export const sendTestNotification = async (req, res) => {
  try {
    const { id_user, title, message } = req.body;

    if (!id_user || !title || !message) {
      return res.status(400).json({
        message: "Field id_user, title, dan message wajib diisi",
        example: {
          id_user: 14,
          title: "Test Notifikasi",
          message: "Ini adalah pesan test dari backend"
        }
      });
    }

    const parsedUserId = parseInt(id_user, 10);
    if (Number.isNaN(parsedUserId)) {
      return res.status(400).json({ message: "id_user harus angka" });
    }

    console.log(`\n📤 [TEST] Mengirim notifikasi ke user ${parsedUserId}...`);

    const result = await sendNotificationToUser({
      id_user: parsedUserId,
      title,
      message,
      data: {
        type: "test_notification",
        timestamp: new Date().toISOString()
      }
    });

    if (result.success) {
      return res.status(200).json({
        message: "✅ Notifikasi berhasil dikirim",
        details: result
      });
    } else {
      return res.status(400).json({
        message: "❌ Gagal kirim notifikasi",
        error: result.message,
        details: result
      });
    }

  } catch (error) {
    console.error("sendTestNotification error:", error);
    return res.status(500).json({ 
      message: "Terjadi kesalahan pada server",
      error: error.message 
    });
  }
};

/**
 * Test endpoint - Cek status FCM token user
 * GET /api/test/fcm-status/:id
 */
export const getFcmStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = parseInt(id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: "ID harus angka" });
    }

    // Import User model
    const User = (await import("../models/UserModel.js")).default;

    const user = await User.findByPk(userId, {
      attributes: ["id_user", "nama_masjid", "email", "fcm_token"]
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json({
      id_user: user.id_user,
      nama_masjid: user.nama_masjid,
      email: user.email,
      fcm_token: user.fcm_token ? "✅ Ada (tersimpan)" : "❌ Kosong",
      fcm_token_raw: user.fcm_token || null
    });

  } catch (error) {
    console.error("getFcmStatus error:", error);
    return res.status(500).json({ 
      message: "Terjadi kesalahan pada server",
      error: error.message 
    });
  }
};

/**
 * Test endpoint - Get info tentang cron jobs
 * GET /api/test/cron-info
 */
export const getCronInfo = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Info Cron Jobs",
      cron_jobs: [
        {
          name: "Inventaris Reminder",
          schedule: process.env.CRON_INVENTARIS_REMINDER || "0 9 * * *",
          threshold_days: parseInt(process.env.INVENTARIS_REMINDER_DAYS || "30", 10),
          description: "Kirim reminder inventaris yang tidak diupdate > X hari",
          next_run: "Setiap hari jam 09:00 (timezone server)"
        }
      ],
      env_variables: {
        CRON_INVENTARIS_REMINDER: process.env.CRON_INVENTARIS_REMINDER || "NOT SET",
        INVENTARIS_REMINDER_DAYS: process.env.INVENTARIS_REMINDER_DAYS || "NOT SET",
        FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH ? "✅ SET" : "❌ NOT SET"
      },
      help: {
        cron_format: "menit jam hari_bulan bulan hari_minggu",
        examples: [
          "0 9 * * * (setiap hari jam 9 pagi)",
          "0 9 * * 1 (setiap Senin jam 9 pagi)",
          "0 */2 * * * (setiap 2 jam)",
          "* * * * * (setiap menit - untuk testing)"
        ]
      }
    });

  } catch (error) {
    console.error("getCronInfo error:", error);
    return res.status(500).json({ 
      message: "Terjadi kesalahan pada server",
      error: error.message 
    });
  }
};
