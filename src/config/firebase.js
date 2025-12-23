import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let firebaseApp = null;

export const initializeFirebase = () => {
  try {
    // Cek apakah service account key ada
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    
    if (!serviceAccountPath) {
      console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT_PATH tidak diset di .env");
      console.warn("⚠️  Notifikasi FCM tidak akan berfungsi");
      return null;
    }

    // Resolve path yang benar
    const absolutePath = path.resolve(serviceAccountPath);
    
    if (!fs.existsSync(absolutePath)) {
      console.warn(`⚠️  File service account tidak ditemukan: ${absolutePath}`);
      console.warn("⚠️  Notifikasi FCM tidak akan berfungsi");
      return null;
    }

    const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf8"));

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("✅ Firebase Admin berhasil diinisialisasi");
    return firebaseApp;
  } catch (error) {
    console.error("❌ Gagal inisialisasi Firebase:", error.message);
    return null;
  }
};

export const getFirebaseApp = () => {
  if (!firebaseApp) {
    console.warn("⚠️  Firebase belum diinisialisasi");
  }
  return firebaseApp;
};

export default admin;
