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

// se obtiene el id del ejercicio con el nombre del ejercicio

async function idEjercicio(ejercicio) {
    
    try{


        const response = await fetch(`http://localhost:3000/id_ejercicio?nombre=${ejercicio}`,{

            method: "GET",
            headers: {'Content-Type': 'application/json'},

        });

        const resultado = await response.json();

        if(response.ok) {

            return resultado.id_ejercicio;

        } else {

            console.log(resultado.message); 

        }
    
    } catch(err) {

        console.log("Error: ",err.message);

    }

}

// se obtiene idrutina por codigo del deportista y el dia de la rutina

async function idRutina(codigo, dia) {
    
    try{


        const response = await fetch(`http://localhost:3000/id_rutina?codigo=${codigo}&dia=${dia}`,{

            method: "GET",
            headers: {'Content-Type': 'application/json'},

        });

        const resultado = await response.json();

        if(response.ok) {

            return resultado.id_rutina;

        } else {

            console.log(resultado.message); 

        }
    
    } catch(err) {

        console.log("Error: ",err);

    }

}

// Función para crear una tarjeta desde la plantilla

async function crearTarjeta(ejercicio) {

    const rutinaContainer = document.getElementById("rutinaContainer");
    const plantilla = document.getElementById("plantilla-ejercicio");

    const clon = plantilla.content.cloneNode(true);
    
    const rol_usuario = await rol();

    console.log(rol_usuario);

    // si es entrenador, se hace accesible el boton de edita

    if(rol_usuario === "entrenador") {

        clon.querySelector("#editar").style.visibility = "visible";
        clon.querySelector("#eliminar").style.visibility = "visible";
        clon.querySelector("#registrar").style.visibility = "hidden";

        const editar = clon.querySelector("#editar");
        const eliminar = clon.querySelector("#eliminar");

        // boton de editar lleva a la pestaña de edicion del ejercicio especifico

        editar.addEventListener("click", () => {

            window.location.href = `/editar_ejercicio?ejercicio=${ejercicio.nombre}&codigo=${codigo}&dia=${dia}`;

        });

        // elimina el ejercicio en el cual esta el boton

        eliminar.addEventListener("click", async() => {

            const IDrutina = await idRutina(codigo, dia);
            const IDejercicio = await idEjercicio(ejercicio.nombre);

            try {
                
            const response = await fetch(`http://localhost:3000/eliminar?rutina=${IDrutina}&ejercicio=${IDejercicio}`,{
                    method: 'DELETE',      
                    headers: {'Content-Type': 'application/json'},
                });

            if(!response.ok) {
                
                throw new Error("error al eliminar rutina");

            }

            const resultados = await response.json();

            console.log(resultados.message);
            alert("ejercicio eliminado");
            location.reload();

            } catch (err) {

                console.log("error: ",err);

            }

            });

    }

    // agregamos al boton de registrar el listener que envia por url el nombre del ejericio e id

    const registrar = clon.querySelector("#registrar");

    registrar.addEventListener("click", async() => {

        const ejercicioid = await idEjercicio(ejercicio.nombre);
        window.location.href = `/registrar?nombre=${ejercicio.nombre}&id=${ejercicioid}&dia=${dia}`;   

    });

    // agregamos al boton de progreso el listener 

    const progreso = clon.querySelector("#progreso");

    progreso.addEventListener("click", async() => {

        const ejercicioid = await idEjercicio(ejercicio.nombre);
        window.location.href = `/progreso?nombre=${ejercicio.nombre}&id=${ejercicioid}&codigo=${codigo}&dia=${dia}`;

    });

    // en cada ejercicio, se le agrega video, titulo, peso, reps, serie y descanso de cada ejercicio rescatado segun el dia 

    clon.querySelector(".video-container iframe").src = ejercicio.url_formateada;
    clon.querySelector(".nombre-ejercicio").textContent = ejercicio.nombre;
    clon.querySelector(".peso").textContent = ejercicio.peso;
    clon.querySelector(".reps").textContent = ejercicio.repeticiones;
    clon.querySelector(".series").textContent = ejercicio.series;
    clon.querySelector(".descanso").textContent = ejercicio.descanso;
    
    rutinaContainer.appendChild(clon);

}

//funcion donde se obtienen los ejercicios del dia seleccionado 

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

        const response = await fetch('http://localhost:3000/api/usuario', {
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

document.addEventListener("DOMContentLoaded", async() => {

    const rol_usuario = await rol();
    const agregar = document.querySelector("#agregar");

    agregar.addEventListener("click", () => {
        window.location.href = `/agregar?codigo=${codigo}&dia=${dia}`;
    });

    if(rol_usuario === "entrenador") {
        document.querySelector("#agregar").style.visibility = "visible";
    }


});



