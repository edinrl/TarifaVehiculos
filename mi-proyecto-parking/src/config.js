import { config } from 'dotenv';
config(); // Carga las variables del archivo .env en process.env

export default {
    port: process.env.PORT || 802,
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbServer: process.env.DB_SERVER || '',
    dbDatabase: process.env.DB_DATABASE || '',
    dbPort: parseInt(process.env.DB_PORT || '1433', 10),
    dbEncrypt: process.env.DB_ENCRYPT === 'true', // Convierte a booleano
    dbTrustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true' // Convierte a booleano
};