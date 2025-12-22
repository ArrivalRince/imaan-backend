import { DataTypes } from "sequelize";
import db from "../config/db.js"; // ✅ ini instance sequelize kamu (di server.js namanya db)

const FcmInventarisToken = db.define(
  "FcmInventarisToken",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fcmToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "inventaris",
    },
  },
  {
    tableName: "fcm_inventaris_tokens", // ✅ kunci ke tabel yang dipakai cron
    timestamps: true,
    freezeTableName: true,
  }
);

export default FcmInventarisToken;
