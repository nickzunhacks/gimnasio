// Función para crear una tarjeta desde la plantilla

function crearTarjeta(ejercicio) {

    const rutinaContainer = document.getElementById("rutinaContainer");
    const plantilla = document.getElementById("plantilla-ejercicio");

    const clon = plantilla.content.cloneNode(true);
    
    clon.querySelector(".video-container iframe").src = ejercicio.url_formateada;
    clon.querySelector(".nombre-ejercicio").textContent = ejercicio.nombre;
    clon.querySelector(".peso").textContent = ejercicio.peso;
    clon.querySelector(".reps").textContent = ejercicio.repeticiones;
    clon.querySelector(".series").textContent = ejercicio.series;
    clon.querySelector(".descanso").textContent = ejercicio.descanso;
    
    rutinaContainer.appendChild(clon);

}

// obtener el dia en el que el usuario decidio clickear en la pagina anterior

function diaSeleccionado() {

    const parametros = new URLSearchParams(window.location.search);
    return parametros.get('dia');

};

//funcion donde se obtienen la rutina del dia seleccionado 

async function obtenerRutina() {

    try {

        const dia = diaSeleccionado();

        const respuesta = await fetch(`http://localhost:3000/rutina_dia?dia=${dia}`, {
    
        method: 'GET',
        headers: {'Content-Type': 'application/json'},


        });

        if (!respuesta.ok)
            throw new Error(`Error al obtener rutina: ${respuesta.status}`);

        const ejercicios = await respuesta.json();

        return ejercicios;

    } catch (err) {

        alert(err.message);
        return [];

    }                                               

};

document.addEventListener('DOMContentLoaded', async () => {

    try{

        const response = await fetch('/api/usuario');

        if(!response.ok) {
            window.location.href = '/login';
            return;
        }

        const usuario = await response.json();

        document.getElementById('bienvenida').textContent = `Bienvenido, ${usuario.nombre}`;

        const dia = diaSeleccionado();

        document.getElementById('nombreRutinaDia').textContent = `rutina del ${dia}`;

       // Crear las tarjetas dinámicamente

        const ejercicios =  await obtenerRutina();

        if(ejercicios.length === 0){
            throw new Error("rutina vacia");
        }

        ejercicios.forEach(crearTarjeta);

    
    } catch(err) {

        console.log("error al obtener datos del usuario: ", err);

    }

}); 

document.addEventListener("DOMContentLoaded", () => {

    const botonRutinaSemanal = document.getElementById("rutinaSemanal")

    botonRutinaSemanal.addEventListener("click", () => {
        window.location.href = "/rutina_semanal";
    });

});



