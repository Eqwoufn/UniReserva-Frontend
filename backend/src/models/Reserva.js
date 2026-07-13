const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
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
  espacioId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'espacio_id',
  },
  dia: {
    type: DataTypes.STRING, // Lunes, Martes, ...
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  hora: {
    type: DataTypes.STRING, // ej: "14:30 - 15:30"
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Confirmada', 'Anulada'),
    allowNull: false,
    defaultValue: 'Confirmada',
  },
}, {
  tableName: 'reservas',
  underscored: true,
  timestamps: true,
  indexes: [
    // Evita a nivel de BD que el mismo slot se reserve dos veces
    {
      unique: true,
      fields: ['espacio_id', 'fecha', 'hora'],
      name: 'slot_unico_por_espacio',
      where: { estado: 'Confirmada' },
    },
  ],
});

module.exports = Reserva;
