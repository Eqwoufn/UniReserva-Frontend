const { Router } = require('express');
const { requiereAuth, requiereRol } = require('../middleware/auth');
const faltasController = require('../controllers/faltasController');

const router = Router();

router.get('/:usuarioId/faltas', requiereAuth, faltasController.listarPorUsuario);
router.post('/:usuarioId/faltas', requiereAuth, requiereRol('admin'), faltasController.agregar);
router.delete('/:usuarioId/faltas/ultima', requiereAuth, requiereRol('admin'), faltasController.quitarUltima);

module.exports = router;
