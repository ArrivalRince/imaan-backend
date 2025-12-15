import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Kegiatan = sequelize.define(
  "Kegiatan",
  {
    id_kegiatan: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama_kegiatan: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tanggal_kegiatan: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    waktu_kegiatan: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    penceramah: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status_kegiatan: {
      type: DataTypes.ENUM("Akan Datang", "Selesai"),
      allowNull: false,
      defaultValue: "Akan Datang",
    },
    foto_kegiatan: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "kegiatan",
    timestamps: false,
  }
);

export default Kegiatan;
