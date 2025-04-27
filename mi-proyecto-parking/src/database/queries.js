// Objeto para almacenar las consultas SQL
export const queries = {
    // --- Consultas para TARIFAS ---
    getAllTarifas: 'SELECT * FROM TARIFAS',
    getTarifaById: 'SELECT * FROM TARIFAS WHERE IDTARIFA = @Id',
    createTarifa: `
        INSERT INTO TARIFAS (DESCRIPTARIFA, COSTOTARIFA)
        VALUES (@DescripTarifa, @CostoTarifa);
    `,
    updateTarifa: `
        UPDATE TARIFAS
        SET DESCRIPTARIFA = @DescripTarifa, COSTOTARIFA = @CostoTarifa
        WHERE IDTARIFA = @Id;
    `,
    deleteTarifa: 'DELETE FROM TARIFAS WHERE IDTARIFA = @Id',

    // --- Consultas para REGISTROVEHICULAR ---
    getAllRegistros: 'SELECT * FROM REGISTROVEHICULAR',
    getRegistroById: 'SELECT * FROM REGISTROVEHICULAR WHERE IDREGISTRO = @Id',
    createRegistro: `
        INSERT INTO REGISTROVEHICULAR
        (FECHAREGISTRO, HORAREGISTRO, VEHICULO, HORASPARQUEO, COSTOTOTAL, IDTARIFA)
        VALUES (@FechaRegistro, @HoraRegistro, @Vehiculo, @HorasParqueo, @CostoTotal, @IdTarifa);
        SELECT SCOPE_IDENTITY() AS IDREGISTRO; -- Devuelve el ID recién insertado
    `,
    updateRegistro: `
        UPDATE REGISTROVEHICULAR
        SET FECHAREGISTRO = @FechaRegistro,
            HORAREGISTRO = @HoraRegistro,
            VEHICULO = @Vehiculo,
            HORASPARQUEO = @HorasParqueo,
            COSTOTOTAL = @CostoTotal,
            IDTARIFA = @IdTarifa
        WHERE IDREGISTRO = @Id;
    `,
    deleteRegistro: 'DELETE FROM REGISTROVEHICULAR WHERE IDREGISTRO = @Id',
    // Puedes añadir más consultas aquí (ej. buscar por vehículo, por fecha, etc.)
};