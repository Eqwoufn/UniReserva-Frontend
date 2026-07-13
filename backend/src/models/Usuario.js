const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  codigoOEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'codigo_o_email',
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash',
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM('estudiante', 'admin'),
    allowNull: false,
    defaultValue: 'estudiante',
  },
  carrera: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'usuarios',
  underscored: true,
  timestamps: true,
});

module.exports = Usuario;
