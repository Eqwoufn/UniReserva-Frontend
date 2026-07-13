const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Falta = sequelize.define('Falta', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usuarioId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'usuario_id',
  },
  reservaId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'reserva_id',
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'faltas',
  underscored: true,
  timestamps: true,
});

module.exports = Falta;
