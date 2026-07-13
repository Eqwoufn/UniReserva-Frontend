const { Reserva, Espacio, Usuario } = require('../models');

const DIAS_SEMANA = { Lunes: 1, Martes: 2, Miércoles: 3, Jueves: 4, Viernes: 5, Sábado: 6 };

function obtenerProximaFecha(nombreDia) {
  const hoy = new Date();
  const hoyDiaSemana = hoy.getDay();
  const target = DIAS_SEMANA[nombreDia];
  let diferencia = target - hoyDiaSemana;
  if (diferencia <= 0) diferencia += 7;
  const fecha = new Date(hoy);
  fecha.setDate(hoy.getDate() + diferencia);
  return fecha.toISOString().slice(0, 10); // YYYY-MM-DD
}

// GET /api/espacios/:espacioId/horarios  -> slots ya ocupados (para pintar la grilla en el front)
exports.horariosOcupados = async (req, res) => {
  const { espacioId } = req.params;
  const ocupados = await Reserva.findAll({
    where: { espacioId, estado: 'Confirmada' },
    attributes: ['dia', 'hora', 'fecha'],
  });
  res.json(ocupados);
};

// POST /api/reservas  (alumno autenticado)
// body: { espacioId, slots: [{ dia, hora }, ...] }  máximo 3, uno por día
exports.crear = async (req, res) => {
  const { espacioId, slots } = req.body;
  const usuarioId = req.usuario.id;

  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ error: 'Debes seleccionar al menos un horario.' });
  }
  if (slots.length > 3) {
    return res.status(400).json({ error: 'Máximo 3 horarios por reserva.' });
  }
  const diasUnicos = new Set(slots.map(s => s.dia));
  if (diasUnicos.size !== slots.length) {
    return res.status(400).json({ error: 'Solo puedes elegir un horario por día.' });
  }

  const espacio = await Espacio.findByPk(espacioId);
  if (!espacio) return res.status(404).json({ error: 'Espacio no encontrado.' });
  if (!espacio.disponible) return res.status(409).json({ error: 'Este espacio no está disponible.' });

  // Validar solapamiento contra la BD antes de crear nada
  for (const slot of slots) {
    const fecha = obtenerProximaFecha(slot.dia);
    const yaExiste = await Reserva.findOne({
      where: { espacioId, fecha, hora: slot.hora, estado: 'Confirmada' },
    });
    if (yaExiste) {
      return res.status(409).json({
        error: `El horario ${slot.dia} ${slot.hora} ya fue reservado por otro alumno.`,
      });
    }
  }

  const creadas = await Promise.all(
    slots.map(slot =>
      Reserva.create({
        usuarioId,
        espacioId,
        dia: slot.dia,
        fecha: obtenerProximaFecha(slot.dia),
        hora: slot.hora,
        estado: 'Confirmada',
      })
    )
  );

  res.status(201).json(creadas);
};

// GET /api/reservas/mias  (alumno autenticado)
exports.misReservas = async (req, res) => {
  const reservas = await Reserva.findAll({
    where: { usuarioId: req.usuario.id, estado: 'Confirmada' },
    include: [{ model: Espacio, as: 'espacio', attributes: ['nombre', 'categoria'] }],
    order: [['fecha', 'ASC']],
  });
  res.json(reservas);
};

// GET /api/reservas  (solo admin) - todas las reservas del sistema
exports.listarTodas = async (req, res) => {
  const reservas = await Reserva.findAll({
    where: { estado: 'Confirmada' },
    include: [
      { model: Espacio, as: 'espacio', attributes: ['nombre', 'categoria'] },
      { model: Usuario, as: 'usuario', attributes: ['nombre', 'codigoOEmail'] },
    ],
    order: [['fecha', 'ASC']],
  });
  res.json(reservas);
};

// DELETE /api/reservas/:id  (dueño de la reserva o admin)
exports.anular = async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id);
  if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada.' });

  const esDueno = reserva.usuarioId === req.usuario.id;
  const esAdmin = req.usuario.rol === 'admin';
  if (!esDueno && !esAdmin) {
    return res.status(403).json({ error: 'No puedes anular una reserva que no es tuya.' });
  }

  reserva.estado = 'Anulada';
  await reserva.save();
  res.json({ mensaje: 'Reserva anulada correctamente.' });
};
