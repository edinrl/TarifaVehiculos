import { getConnection, sql, queries } from '../database/index.js';

// Obtener todas las tarifas
export const getTarifas = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(queries.getAllTarifas);
        res.json(result.recordset); // Devuelve el array de resultados
    } catch (error) {
        console.error("Error al obtener tarifas:", error);
        res.status(500).send(error.message); // Envía error 500 (Internal Server Error)
    }
};

// Crear una nueva tarifa
export const createTarifa = async (req, res) => {
    const { DESCRIPTARIFA, COSTOTARIFA } = req.body; // Obtiene datos del cuerpo de la petición

    // Validación básica
    if (DESCRIPTARIFA == null || COSTOTARIFA == null) {
        return res.status(400).json({ msg: 'Petición incorrecta. Por favor, envíe DescripTarifa y CostoTarifa.' });
    }

    try {
        const pool = await getConnection();
        await pool.request()
            .input("DescripTarifa", sql.VarChar, DESCRIPTARIFA) // Define el parámetro de entrada y su tipo
            .input("CostoTarifa", sql.Float, COSTOTARIFA)     // Define el parámetro de entrada y su tipo
            .query(queries.createTarifa);                     // Ejecuta la consulta

        // Devuelve la tarifa creada (sin el ID generado por la DB en este caso)
        res.status(201).json({ DESCRIPTARIFA, COSTOTARIFA }); // 201 = Created
    } catch (error) {
        console.error("Error al crear tarifa:", error);
        res.status(500).send(error.message);
    }
};

// Obtener una tarifa por ID
export const getTarifaById = async (req, res) => {
    const { id } = req.params; // Obtiene el ID de los parámetros de la URL

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Id", sql.Int, id) // Parámetro de entrada para el ID
            .query(queries.getTarifaById);

        if (result.recordset.length === 0) {
            // Si no se encuentra la tarifa, devuelve 404
            return res.status(404).json({ msg: 'Tarifa no encontrada.' });
        }

        res.json(result.recordset[0]); // Devuelve la primera (y única) tarifa encontrada
    } catch (error) {
        console.error("Error al obtener tarifa por ID:", error);
        res.status(500).send(error.message);
    }
};

// Actualizar una tarifa por ID
export const updateTarifa = async (req, res) => {
    const { id } = req.params;
    const { DESCRIPTARIFA, COSTOTARIFA } = req.body;

    // Validación
    if (DESCRIPTARIFA == null || COSTOTARIFA == null) {
        return res.status(400).json({ msg: 'Petición incorrecta. Envíe DescripTarifa y CostoTarifa.' });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .input("DescripTarifa", sql.VarChar, DESCRIPTARIFA)
            .input("CostoTarifa", sql.Float, COSTOTARIFA)
            .query(queries.updateTarifa);

        // Verifica si alguna fila fue afectada
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Tarifa no encontrada o sin cambios.' });
        }

        res.json({ id, DESCRIPTARIFA, COSTOTARIFA }); // Devuelve la tarifa actualizada
    } catch (error) {
        console.error("Error al actualizar tarifa:", error);
        res.status(500).send(error.message);
    }
};

// Eliminar una tarifa por ID
export const deleteTarifa = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input("Id", sql.Int, id)
            .query(queries.deleteTarifa);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ msg: 'Tarifa no encontrada.' });
        }

        // res.sendStatus(204); // 204 = No Content (éxito sin devolver cuerpo)
        res.json({ msg: 'Tarifa eliminada exitosamente.' }); // O devuelve un mensaje
    } catch (error) {
        console.error("Error al eliminar tarifa:", error);
        res.status(500).send(error.message);
    }
};