const { Router } = require('express');
const { requiereAuth, requiereRol } = require('../middleware/auth');
const espaciosController = require('../controllers/espaciosController');
const reservasController = require('../controllers/reservasController');

const router = Router();

// Públicas para cualquier usuario autenticado (alumno o admin)
router.get('/', requiereAuth, espaciosController.listar);
router.get('/:id', requiereAuth, espaciosController.detalle);
router.get('/:espacioId/horarios', requiereAuth, reservasController.horariosOcupados);

// Solo administrador
router.post('/', requiereAuth, requiereRol('admin'), espaciosController.crearExtra);
router.patch('/:id/disponibilidad', requiereAuth, requiereRol('admin'), espaciosController.toggleDisponibilidad);
router.delete('/:id', requiereAuth, requiereRol('admin'), espaciosController.eliminarExtra);

module.exports = router;
