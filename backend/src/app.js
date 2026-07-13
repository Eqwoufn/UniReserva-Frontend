const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const espaciosRoutes = require('./routes/espaciosRoutes');
const reservasRoutes = require('./routes/reservasRoutes');
const faltasRoutes = require('./routes/faltasRoutes');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/espacios', espaciosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/usuarios', faltasRoutes);

// Manejador de errores no controlados
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

module.exports = app;
