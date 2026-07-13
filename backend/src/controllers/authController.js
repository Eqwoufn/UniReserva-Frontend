const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, rol: usuario.rol, codigoOEmail: usuario.codigoOEmail },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// POST /api/auth/registro  (útil para crear al primer admin y alumnos de prueba)
exports.registro = async (req, res) => {
  try {
    const { codigoOEmail, password, nombre, rol, carrera } = req.body;

    if (!codigoOEmail || !password || !nombre) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }

    const existente = await Usuario.findOne({ where: { codigoOEmail } });
    if (existente) {
      return res.status(409).json({ error: 'Ya existe un usuario con ese código o correo.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      codigoOEmail,
      passwordHash,
      nombre,
      rol: rol === 'admin' ? 'admin' : 'estudiante',
      carrera,
    });

    const token = generarToken(usuario);
    res.status(201).json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol, codigoOEmail: usuario.codigoOEmail },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario.', detalle: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { codigoOEmail, password } = req.body;

    const usuario = await Usuario.findOne({ where: { codigoOEmail } });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    const token = generarToken(usuario);
    res.json({
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol, codigoOEmail: usuario.codigoOEmail },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión.', detalle: error.message });
  }
};
