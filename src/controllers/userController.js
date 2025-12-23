import User from "../models/UserModel.js";

/**
 * Update FCM token untuk user
 * POST /api/user/fcm-token
 * Body: { id_user: number, fcm_token: string }
 */
export const updateFcmToken = async (req, res) => {
  try {
    const { id_user, fcm_token } = req.body;

    if (!id_user || !fcm_token) {
      return res.status(400).json({
        message: "Field id_user dan fcm_token wajib diisi",
      });
    }

    const parsedUserId = parseInt(id_user, 10);
    if (Number.isNaN(parsedUserId)) {
      return res.status(400).json({ message: "id_user harus angka" });
    }

    // Cari user
    const user = await User.findByPk(parsedUserId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Update FCM token
    await user.update({ fcm_token });

    return res.status(200).json({
      message: "FCM token berhasil disimpan",
      id_user: parsedUserId,
    });
  } catch (error) {
    console.error("updateFcmToken error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Hapus FCM token (logout)
 * DELETE /api/user/fcm-token/:id
 */
export const deleteFcmToken = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Hapus FCM token
    await user.update({ fcm_token: null });

    return res.status(200).json({
      message: "FCM token berhasil dihapus",
    });
  } catch (error) {
    console.error("deleteFcmToken error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

/**
 * Get user profile
 * GET /api/user/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ["password", "fcm_token"] }, // jangan expose FCM token
    });

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("getUserById error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
