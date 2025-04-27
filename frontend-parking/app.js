document.addEventListener('DOMContentLoaded', () => {
    // --- Constantes y Variables ---
    const API_URL = 'http://localhost:802/api'; // ¡¡¡Ajusta el puerto si es necesario!!!

    // Referencias a elementos del DOM (Formularios)
    const formTarifa = document.getElementById('form-tarifa');
    const formRegistro = document.getElementById('form-registro');

    // Referencias a elementos del DOM (Inputs Tarifa)
    const inputDescTarifa = document.getElementById('descripcion-tarifa');
    const inputCostoTarifa = document.getElementById('costo-tarifa');

    // Referencias a elementos del DOM (Inputs Registro)
    const inputVehiculoReg = document.getElementById('vehiculo-registro');
    const inputHorasReg = document.getElementById('horas-registro');
    const inputCostoTotalReg = document.getElementById('costo-total-registro');
    const selectTarifaReg = document.getElementById('tarifa-registro');

    // Referencias a elementos del DOM (Tablas)
    const tablaTarifasBody = document.querySelector('#tabla-tarifas tbody');
    const tablaRegistrosBody = document.querySelector('#tabla-registros tbody');

    // --- Funciones para interactuar con la API ---

    // Función genérica para fetch
    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            // Si la respuesta no tiene contenido (ej. DELETE exitoso)
            if (response.status === 204) {
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error('Error en la petición:', error);
            alert(`Error en la petición: ${error.message}`);
            throw error; // Propaga el error para manejo adicional si es necesario
        }
    }

    // Obtener y mostrar todas las tarifas
    async function cargarTarifas() {
        try {
            const tarifas = await fetchData(`${API_URL}/tarifas`);
            tablaTarifasBody.innerHTML = ''; // Limpiar tabla anterior
            selectTarifaReg.innerHTML = '<option value="">-- Seleccione una tarifa --</option>'; // Limpiar y añadir opción por defecto

            if (tarifas && tarifas.length > 0) {
                tarifas.forEach(tarifa => {
                    // Añadir fila a la tabla
                    const fila = `<tr>
                        <td>${tarifa.IDTARIFA}</td>
                        <td>${tarifa.DESCRIPTARIFA}</td>
                        <td>${tarifa.COSTOTARIFA.toFixed(2)}</td>
                    </tr>`;
                    tablaTarifasBody.innerHTML += fila;

                    // Añadir opción al select del formulario de registros
                    const opcion = document.createElement('option');
                    opcion.value = tarifa.IDTARIFA;
                    opcion.textContent = `${tarifa.IDTARIFA} - ${tarifa.DESCRIPTARIFA} (S/. ${tarifa.COSTOTARIFA.toFixed(2)})`;
                    selectTarifaReg.appendChild(opcion);
                });
            } else {
                tablaTarifasBody.innerHTML = '<tr><td colspan="3">No hay tarifas registradas.</td></tr>';
            }
        } catch (error) {
            // El error ya se muestra en fetchData
            tablaTarifasBody.innerHTML = '<tr><td colspan="3">Error al cargar las tarifas.</td></tr>';
        }
    }

    // Obtener y mostrar todos los registros
    async function cargarRegistros() {
        try {
            const registros = await fetchData(`${API_URL}/registros`);
            tablaRegistrosBody.innerHTML = ''; // Limpiar tabla anterior

            if (registros && registros.length > 0) {
                registros.forEach(registro => {
                    // Formatear fecha y hora (si vienen como string ISO)
                    const fechaFormateada = registro.FECHAREGISTRO ? new Date(registro.FECHAREGISTRO).toLocaleDateString() : 'N/A';
                    // La hora puede necesitar un manejo especial según cómo la devuelva la API
                    const horaFormateada = registro.HORAREGISTRO || 'N/A'; // Asumiendo que viene como string HH:MM:SS

                    const fila = `<tr>
                        <td>${registro.IDREGISTRO}</td>
                        <td>${registro.VEHICULO}</td>
                        <td>${fechaFormateada}</td>
                        <td>${horaFormateada}</td>
                        <td>${registro.HORASPARQUEO}</td>
                        <td>${registro.COSTOTOTAL.toFixed(2)}</td>
                        <td>${registro.IDTARIFA}</td>
                    </tr>`;
                    tablaRegistrosBody.innerHTML += fila;
                });
            } else {
                tablaRegistrosBody.innerHTML = '<tr><td colspan="7">No hay registros vehiculares.</td></tr>';
            }
        } catch (error) {
            tablaRegistrosBody.innerHTML = '<tr><td colspan="7">Error al cargar los registros.</td></tr>';
        }
    }

    // Crear una nueva tarifa
    async function agregarTarifa(event) {
        event.preventDefault(); // Evitar recarga de página

        const nuevaTarifa = {
            DESCRIPTARIFA: inputDescTarifa.value.trim(),
            COSTOTARIFA: parseFloat(inputCostoTarifa.value)
        };

        // Validación simple
        if (!nuevaTarifa.DESCRIPTARIFA || isNaN(nuevaTarifa.COSTOTARIFA) || nuevaTarifa.COSTOTARIFA < 0) {
            alert('Por favor, ingrese una descripción y un costo válido.');
            return;
        }

        try {
            await fetchData(`${API_URL}/tarifas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaTarifa)
            });

            alert('Tarifa agregada exitosamente!');
            formTarifa.reset(); // Limpiar formulario
            cargarTarifas(); // Recargar la lista de tarifas (incluyendo el select)
        } catch (error) {
            // El error ya se muestra en fetchData
            // Puedes añadir un mensaje más específico si quieres
            // alert('No se pudo agregar la tarifa.');
        }
    }

     // Registrar un nuevo vehículo
     async function registrarVehiculo(event) {
        event.preventDefault();

        const nuevoRegistro = {
            VEHICULO: inputVehiculoReg.value.trim(),
            HORASPARQUEO: parseInt(inputHorasReg.value),
            COSTOTOTAL: parseFloat(inputCostoTotalReg.value),
            IDTARIFA: parseInt(selectTarifaReg.value)
            // FECHAREGISTRO y HORAREGISTRO se asumen generados por el backend
        };

        // Validación simple
        if (!nuevoRegistro.VEHICULO || isNaN(nuevoRegistro.HORASPARQUEO) || nuevoRegistro.HORASPARQUEO <= 0 || isNaN(nuevoRegistro.COSTOTOTAL) || nuevoRegistro.COSTOTOTAL < 0 || isNaN(nuevoRegistro.IDTARIFA)) {
             alert('Por favor, complete todos los campos del registro correctamente.');
             return;
        }

        try {
            await fetchData(`${API_URL}/registros`, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(nuevoRegistro)
            });

            alert('Vehículo registrado exitosamente!');
            formRegistro.reset(); // Limpiar formulario
            cargarRegistros(); // Recargar la lista de registros
        } catch (error) {
             // alert('No se pudo registrar el vehículo.');
        }
    }

    // --- Event Listeners ---
    formTarifa.addEventListener('submit', agregarTarifa);
    formRegistro.addEventListener('submit', registrarVehiculo);

    // --- Carga inicial de datos ---
    cargarTarifas();
    cargarRegistros();

}); // Fin de DOMContentLoaded