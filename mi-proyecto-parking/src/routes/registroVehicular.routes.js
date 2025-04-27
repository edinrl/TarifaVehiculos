import { Router } from 'express';
import {
    getRegistros,
    createRegistro,
    getRegistroById,
    updateRegistro,
    deleteRegistro
} from '../controllers/registroVehicular.controller.js'; // Asegúrate de importar las funciones

const router = Router();

// Rutas para registros vehiculares
router.route('/registros')
    .get(getRegistros)
    .post(createRegistro);

router.route('/registros/:id')
    .get(getRegistroById)
    .put(updateRegistro)
    .delete(deleteRegistro);

export default router;