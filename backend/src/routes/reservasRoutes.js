const { Router } = require('express');
const { requiereAuth, requiereRol } = require('../middleware/auth');
const reservasController = require('../controllers/reservasController');

const router = Router();

router.post('/', requiereAuth, reservasController.crear);
router.get('/mias', requiereAuth, reservasController.misReservas);
router.get('/', requiereAuth, requiereRol('admin'), reservasController.listarTodas);
router.delete('/:id', requiereAuth, reservasController.anular);

module.exports = router;
