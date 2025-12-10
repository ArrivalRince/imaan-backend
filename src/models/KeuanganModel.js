import { DataTypes } from "sequelize";
import db from "../config/db.js"; // Pastikan path ke config DB benar
import Users from "./UserModel.js"; // WAJIB: Import model Users untuk relasi

const Keuangan = db.define(
  "Keuangan",
  {
    id_transaksi: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Secara eksplisit mendefinisikan foreign key constraint
      references: {
        model: Users,
        key: 'id_user'
      }
    },
    keterangan: { type: DataTypes.STRING, allowNull: false },
    tipe_transaksi: { type: DataTypes.ENUM("pemasukan", "pengeluaran"), allowNull: false },
    tanggal: { type: DataTypes.DATEONLY, allowNull: false },
    jumlah: {
      type: DataTypes.INTEGER, // Tipe data sudah benar
      allowNull: false,
    },
    bukti_transaksi: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "keuangan",
    timestamps: false,
  }
);

// ================== PERBAIKAN PENTING DI SINI ==================
// Definisikan hubungan antar tabel secara eksplisit
Users.hasMany(Keuangan, { foreignKey: 'id_user' });
Keuangan.belongsTo(Users, { foreignKey: 'id_user' });
// =============================================================

export default Keuangan;

