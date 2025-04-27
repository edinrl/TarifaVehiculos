import { getConnection, sql, queries } from '../database/index.js';

// Obtener todos los registros vehiculares
export const getRegistros = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(queries.getAllRegistros);
        res.json(result.recordset);
    } catch (error) {
        console.error("Error al obtener registros:", error);
        res.status(500).send(error.message);
    }
};

// Crear un nuevo registro vehicular
export const createRegistro = async (req, res) => {
    // Nota: Podrías querer generar FECHAREGISTRO y HORAREGISTRO aquí o en la DB
    // Usaremos los valores del cuerpo por ahora, pero puedes ajustarlo.
    const { FECHAREGISTRO, HORAREGISTRO, VEHICULO, HORASPARQUEO, COSTOTOTAL, IDTARIFA } = req.body;

    // Validación básica (mejora según necesites)
    if (!VEHICULO || HORASPARQUEO == null || COSTOTOTAL == null || IDTARIFA == null) {
        return res.status(400).json({ msg: 'Petición incorrecta. Faltan campos requeridos.' });
    }

    // Puedes asignar la fecha y hora actual del servidor si no vienen en el request
    const fechaReg = FECHAREGISTRO ? new Date(FECHAREGISTRO) : new Date();
    const horaReg = HORAREGISTRO ? new Date(`1970-01-01T${HORAREGISTRO}`) : new Date(); // Asume formato HH:mm:ss

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("FechaRegistro", sql.Date, fechaReg)
            .input("HoraRegistro", sql.Time, horaReg) // Asegúrate que el tipo coincida con tu DB
            .input("Vehiculo", sql.VarChar, VEHICULO)
            .input("HorasParqueo", sql.Int, HORASPARQUEO)
            .input("CostoTotal", sql.Float, COSTOTOTAL)
            .input("IdTarifa", sql.Int, IDTARIFA)
            .query(queries.createRegistro); // Ejecuta la consulta que devuelve el ID

        const nuevoId = result.recordset[0].IDREGISTRO; // Obtiene el ID generado

        res.status(201).json({
            IDREGISTRO: nuevoId,
            FECHAREGISTRO: fechaReg.toISOString().split('T')[0], // Formato YYYY-MM-DD
            HORAREGISTRO: horaReg.toTimeString().split(' ')[0], // Formato HH:MM:SS
            VEHICULO,
            HORASPARQUEO,
            COSTOTOTAL,
            IDTARIFA
        });
    } catch (error) {
        console.error("Error al crear registro vehicular:", error);
        res.status(500).send(error.message);
    }
};

// --- Implementa getRegistroById, updateRegistro, deleteRegistro ---
// Sigue la misma estructura que en tarifas.controller.js, usando
// los queries correspondientes de /src/database/queries.js
// y los tipos de datos sql adecuados para los inputs.

// Obtener registro por ID
export const getRegistroById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.Int, id)
            .query(queries.getRegistroById);
        if (result.recordset.length === 0) {
            return res.status(404).json({ msg: 'Registro no encontrado.' });
        }
        res.json(result.recordset[0]);
    } catch (error) {
        console.error("Error al obtener registro por ID:", error);
        res.status(500).send(error.message);
    }
};

//  Actualizar registro
export const updateRegistro = async (req, res) => {
    const { id } = req.params;
    const { FECHAREGISTRO, HORAREGISTRO, VEHICULO, HORASPARQUEO, COSTOTOTAL, IDTARIFA } = req.body;

    // Validación 
    if (!VEHICULO || HORASPARQUEO == null || COSTOTOTAL == null || IDTARIFA == null) {
        return res.status(400).json({ msg: 'Petición incorrecta. Faltan campos requeridos.' });
    }
    const fechaReg = FECHAREGISTRO ? new Date(FECHAREGISTRO) : new Date();
    const horaReg = HORAREGISTRO ? new Date(`1970-01-01T${HORAREGISTRO}`) : new Date();

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .input("FechaRegistro", sql.Date, fechaReg)
            .input("HoraRegistro", sql.Time, horaReg)
            .input("Vehiculo", sql.VarChar, VEHICULO)
            .input("HorasParqueo", sql.Int, HORASPARQUEO)
            .input("CostoTotal", sql.Float, COSTOTOTAL)
            .input("IdTarifa", sql.Int, IDTARIFA)
            .query(queries.updateRegistro);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Registro no encontrado o sin cambios.' });
        }
        res.json({ id, FECHAREGISTRO, HORAREGISTRO, VEHICULO, HORASPARQUEO, COSTOTOTAL, IDTARIFA });
    } catch (error) {
         console.error("Error al actualizar registro:", error);
        res.status(500).send(error.message);
    }
};

//Eliminar registro
export const deleteRegistro = async (req, res) => {
     const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input("Id", sql.Int, id)
            .query(queries.deleteRegistro);

        if (result.rowsAffected[0] === 0) {
             return res.status(404).json({ msg: 'Registro no encontrado.' });
        }
        res.json({ msg: 'Registro eliminado exitosamente.' });
    } catch (error) {
        console.error("Error al eliminar registro:", error);
        res.status(500).send(error.message);
    }
};