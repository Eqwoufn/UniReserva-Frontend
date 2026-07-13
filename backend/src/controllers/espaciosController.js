const { Espacio } = require('../models');

// GET /api/espacios
exports.listar = async (req, res) => {
  const espacios = await Espacio.findAll({ order: [['categoria', 'ASC'], ['nombre', 'ASC']] });
  res.json(espacios);
};

// GET /api/espacios/:id
exports.detalle = async (req, res) => {
  const espacio = await Espacio.findByPk(req.params.id);
  if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado.' });
  res.json(espacio);
};

// PATCH /api/espacios/:id/disponibilidad  (solo admin)
exports.toggleDisponibilidad = async (req, res) => {
  const espacio = await Espacio.findByPk(req.params.id);
  if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado.' });

  espacio.disponible = !espacio.disponible;
  await espacio.save();
  res.json(espacio);
};

// POST /api/espacios  (solo admin) - crear ambiente extra, máximo 3
exports.crearExtra = async (req, res) => {
  const { nombre, capacidad } = req.body;
  if (!nombre || !capacidad) {
    return res.status(400).json({ error: 'Nombre y capacidad son obligatorios.' });
  }

  const extrasActuales = await Espacio.count({ where: { esExtra: true } });
  if (extrasActuales >= 3) {
    return res.status(409).json({ error: 'Límite alcanzado: máximo 3 ambientes extra.' });
  }

  const nuevo = await Espacio.create({
    nombre,
    capacidad,
    categoria: 'Áreas de Estudio',
    disponible: true,
    esExtra: true,
    imagen: 'salaetudio_ulima_1.png',
    descripcion: 'Sala de estudio extra añadida por la administración.',
  });

  res.status(201).json(nuevo);
};

// DELETE /api/espacios/:id  (solo admin) - eliminar un extra
exports.eliminarExtra = async (req, res) => {
  const espacio = await Espacio.findByPk(req.params.id);
  if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado.' });
  if (!espacio.esExtra) {
    return res.status(400).json({ error: 'Solo se pueden eliminar ambientes extra.' });
  }

  await espacio.destroy();
  res.json({ mensaje: 'Ambiente extra eliminado correctamente.' });
};
