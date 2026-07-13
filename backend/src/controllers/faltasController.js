const { Falta, Usuario } = require('../models');

// GET /api/usuarios/:usuarioId/faltas
exports.listarPorUsuario = async (req, res) => {
  const faltas = await Falta.findAll({ where: { usuarioId: req.params.usuarioId } });
  res.json({ total: faltas.length, faltas });
};

// POST /api/usuarios/:usuarioId/faltas  (solo admin)
exports.agregar = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.usuarioId);
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado.' });

  const falta = await Falta.create({
    usuarioId: usuario.id,
    motivo: req.body.motivo || 'No especificado',
  });
  res.status(201).json(falta);
};

// DELETE /api/usuarios/:usuarioId/faltas/ultima  (solo admin) - quitar la falta más reciente
exports.quitarUltima = async (req, res) => {
  const ultima = await Falta.findOne({
    where: { usuarioId: req.params.usuarioId },
    order: [['createdAt', 'DESC']],
  });
  if (!ultima) return res.status(404).json({ error: 'Este usuario no tiene faltas registradas.' });

  await ultima.destroy();
  res.json({ mensaje: 'Falta eliminada correctamente.' });
};
