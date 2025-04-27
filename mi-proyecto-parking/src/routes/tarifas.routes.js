import { Router } from 'express';
import {
    getTarifas,
    createTarifa,
    getTarifaById,
    updateTarifa,
    deleteTarifa
} from '../controllers/tarifas.controller.js';

const router = Router();

// Ruta para obtener todas las tarifas y crear una nueva
router.route('/tarifas')
    .get(getTarifas)
    .post(createTarifa);

// Ruta para obtener, actualizar y eliminar una tarifa específica por ID
router.route('/tarifas/:id')
    .get(getTarifaById)
    .put(updateTarifa)    // PUT para actualizar completamente
    .delete(deleteTarifa);

export default router;