import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import User from './UserModel.js';

const Inventaris = db.define(
  'Inventaris',
  {
    id_inventaris: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama_barang: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    kondisi: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    foto_barang: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    jumlah: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'inventaris',
    timestamps: false,
  }
);

// Relasi dengan User
User.hasMany(Inventaris, {
  foreignKey: 'id_user',
  onDelete: 'CASCADE',
});
Inventaris.belongsTo(User, {
  foreignKey: 'id_user',
});

export default Inventaris;
