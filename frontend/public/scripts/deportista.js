let rolCache = null;

const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get('codigo')
const dia = parametros.get('dia');

async function rol() {

    if (rolCache) return rolCache;

    const response = await fetch(`http://localhost:3000/session_rol`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    const dato = await response.json();
    rolCache = dato.rol; 
    return rolCache;

}

// Función para crear una tarjeta desde la plantilla

async function crearTarjeta(ejercicio) {

    const rutinaContainer = document.getElementById("rutinaContainer");
    const plantilla = document.getElementById("plantilla-ejercicio");

    const clon = plantilla.content.cloneNode(true);
    
    const rol_usuario = await rol();

    console.log(rol_usuario);

    if(rol_usuario === "entrenador") {
        clon.querySelector("#editar").style.visibility = "visible";
        clon.querySelector("#eliminar").style.visibility = "visible";

        const editar = clon.querySelector("#editar");

        editar.addEventListener("click", () => {

            window.location.href = `/editar_ejercicio?ejercicio=${ejercicio.nombre}&codigo=${codigo}&dia=${dia}`;

        });

    }

    clon.querySelector(".video-container iframe").src = ejercicio.url_formateada;
    clon.querySelector(".nombre-ejercicio").textContent = ejercicio.nombre;
    clon.querySelector(".peso").textContent = ejercicio.peso;
    clon.querySelector(".reps").textContent = ejercicio.repeticiones;
    clon.querySelector(".series").textContent = ejercicio.series;
    clon.querySelector(".descanso").textContent = ejercicio.descanso;
    
    rutinaContainer.appendChild(clon);

}

//funcion donde se obtienen la rutina del dia seleccionado 

async function obtenerRutina() {

    try {

        const rol_usuario = await rol();
        let respuesta;

        if (rol_usuario === "entrenador"){

            respuesta = await fetch(`http://localhost:3000/rutina_dia?dia=${dia}&codigo=${codigo}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
                credentials: 'include'
            });

        } else {

            respuesta = await fetch(`http://localhost:3000/rutina_dia?dia=${dia}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            });

        }

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

        const response = await fetch('/api/usuario', {
            method: 'GET',
            credentials: 'include'
        });     

        if(!response.ok) {
            window.location.href = '/login';
            return;
        }

        const usuario = await response.json();

        document.getElementById('bienvenida').textContent = `Bienvenido, ${usuario.nombre}`;

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

    botonRutinaSemanal.addEventListener("click", async () => {

        const rol_usuario = await rol();

        if(rol_usuario === "entrenador") {

            const param = new URLSearchParams(window.location.search);
            const codigo = param.get('codigo');
            window.location.href = `/rutina_semanal?codigo=${codigo}`

        } else {

            window.location.href = "/rutina_semanal";

        }

    });

});



