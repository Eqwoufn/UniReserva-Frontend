const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Espacio = require('./Espacio');
const Reserva = require('./Reserva');
const Falta = require('./Falta');

// Un usuario tiene muchas reservas
Usuario.hasMany(Reserva, { foreignKey: 'usuarioId', as: 'reservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Un espacio tiene muchas reservas
Espacio.hasMany(Reserva, { foreignKey: 'espacioId', as: 'reservas' });
Reserva.belongsTo(Espacio, { foreignKey: 'espacioId', as: 'espacio' });

// Un usuario acumula muchas faltas
Usuario.hasMany(Falta, { foreignKey: 'usuarioId', as: 'faltas' });
Falta.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Una falta puede estar asociada a la reserva que la originó
Reserva.hasOne(Falta, { foreignKey: 'reservaId', as: 'falta' });
Falta.belongsTo(Reserva, { foreignKey: 'reservaId', as: 'reserva' });

module.exports = { sequelize, Usuario, Espacio, Reserva, Falta };
