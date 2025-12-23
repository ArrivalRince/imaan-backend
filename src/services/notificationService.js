import admin, { getFirebaseApp } from "../config/firebase.js";
import User from "../models/UserModel.js";


export const sendNotificationToUser = async ({
  id_user,
  title,
  message,
  data = {},
}) => {
  try {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) {
      console.warn(`⚠️ Firebase belum aktif`);
      return { success: false };
    }

    const user = await User.findByPk(id_user, {
      attributes: ["id_user", "fcm_token", "nama_masjid"],
    });

    if (!user) {
      console.error(`❌ User ${id_user} tidak ditemukan`);
      return { success: false };
    }

    if (!user.fcm_token) {
      console.warn(`⚠️ User ${id_user} (${user.nama_masjid}) belum punya FCM token`);
      return { success: false };
    }

    const payload = {
      notification: {
        title,
        body: message,
      },
      data: {
        type: data.type || "general", // ⬅️ WAJIB
        ...data,
      },
      token: user.fcm_token,
    };

    const response = await admin.messaging().send(payload);

    console.log(
      `✅ Notifikasi terkirim ke ${user.nama_masjid} (${id_user})`,
      response
    );

    return { success: true, response };
  } catch (error) {
    console.error(`❌ Gagal kirim notif user ${id_user}:`, error.message);

    
    if (
      error.code === "messaging/invalid-registration-token" ||
      error.code === "messaging/registration-token-not-registered"
    ) {
      await User.update(
        { fcm_token: null },
        { where: { id_user } }
      );
      console.log(`🔄 FCM token user ${id_user} dihapus`);
    }

    return { success: false, error };
  }
};
