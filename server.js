import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// route utama
app.get("/", (req, res) => {
  res.send("Server IMAAN berjalan 🚀");
});

// route auth
app.use("/api/auth", authRoutes);

// koneksi ke database
sequelize
  .authenticate()
  .then(() => console.log("✅ Koneksi ke MySQL berhasil!"))
  .catch((err) => console.log("❌ Gagal konek MySQL:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
