import sql from 'mssql';
import config from '../config.js';

// Configuración de la conexión basada en las variables de entorno
const dbSettings = {
    user: config.dbUser,
    password: config.dbPassword,
    server: config.dbServer,
    database: config.dbDatabase,
    port: config.dbPort,
    options: {
        encrypt: config.dbEncrypt, // Para Azure SQL u otros que lo requieran
        trustServerCertificate: config.dbTrustServerCertificate // Cambiar a true para desarrollo local/certificados auto-firmados
    }
};

// Función asíncrona para obtener el pool de conexiones
export async function getConnection() {
    try {
        // Crear (si no existe) y retornar el pool de conexiones
        const pool = await sql.connect(dbSettings);
        console.log(">>> Conexión a la BD exitosa");
        return pool;
    } catch (error) {
        console.error("Error al conectar con la BD:", error);
        // Relanzar el error para que sea manejado por quien llama a la función
        throw error;
    }
}

// Exportar el objeto sql para usar tipos de datos (sql.VarChar, sql.Int, etc.)
export { sql };