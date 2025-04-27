import express from 'express';
import cors from 'cors';
import config from './config.js';
import tarifasRoutes from './routes/tarifas.routes.js';
import registroVehicularRoutes from './routes/registroVehicular.routes.js';

// Inicialización de Express
const app = express();

// --- Settings ---
// Establece el puerto desde la configuración o usa 3000 por defecto
app.set('port', config.port);

// --- Middlewares ---
app.use(cors()); // Habilita CORS para permitir peticiones de otros dominios (configura adecuadamente para producción)
app.use(express.json()); // Permite a Express entender peticiones con cuerpo en formato JSON
app.use(express.urlencoded({ extended: false })); // Permite entender datos de formularios simples

// --- Rutas Principales ---
// Define un prefijo para las rutas de la API
const apiPrefix = '/api';

// Usa las rutas definidas para cada entidad
app.use(apiPrefix, tarifasRoutes);
app.use(apiPrefix, registroVehicularRoutes);

// Ruta raíz simple para verificar que el servidor funciona
app.get('/', (req, res) => {
    res.send(`¡API funcionando! Accede a las rutas en ${apiPrefix}/tarifas o ${apiPrefix}/registros`);
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint no encontrado' });
});


export default app; // Exporta la instancia de la app Express