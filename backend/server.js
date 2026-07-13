require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 4000;

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('Conexión exitosa con PostgreSQL.');

    await sequelize.sync({ alter: true });
    console.log('Tablas sincronizadas correctamente.');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();