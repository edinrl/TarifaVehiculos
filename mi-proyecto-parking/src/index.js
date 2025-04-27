import app from './app.js';
// Opcional: Puedes intentar conectar a la DB al iniciar para verificar credenciales
// import { getConnection } from './database/connection.js';
// getConnection();

// Inicia el servidor escuchando en el puerto configurado
app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
    console.log(`Accede en http://localhost:${app.get('port')}`);
});