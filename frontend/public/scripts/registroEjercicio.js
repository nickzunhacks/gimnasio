var peso = 0;
var reps = 0;
var series = 1;
var descanso = 0;
var fecha = null;
var comentario = null;

//se obtiene parametros enviados por URL

const parametros = new URLSearchParams(window.location.search);
const nombreEjercicio = parametros.get('nombre')
const idEjercicio = parametros.get('id');
const dia = parametros.get('dia');

// Listener al cargar documento

document.addEventListener("DOMContentLoaded", () => {

    // Se muestra en pantalla el titulo del ejercicio

    document.querySelector("#nombreEjercicio").textContent = nombreEjercicio;

    const botonAgregar = document.querySelector("#agregar");
    const formulario = document.querySelector("#formulario");

    // se agregan listener al boton de agregar un nueva serie y al boton de "submit" del formulario

    botonAgregar.addEventListener("click",agregar);
    formulario.addEventListener("submit",subir)
    

});

// se suben guardan en base de datos

async function subir(event) {

    event.preventDefault();
    const datos = obtenerDatos();
    
    try {

        const response = await fetch('http://localhost:3000/registrar_ejercicio', {

            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos),

        });

        if (!response.ok) {

            throw new Error('error en la respuesta del servidor');

        }

        const results = await response.json();
        alert("entrenamiento registrado");
        window.location.href = `/deportista?dia=${dia}`;

    } catch (err) {

        console.log("error en front: ",err.message);

    }

}

// se agregan un inputs cuando se oprime el boton +

function agregar(){

    series += 1;

    console.log("se activo boton");
    const formulario = document.querySelector("#datos");
    const plantilla = document.querySelector("#plantilla-registro");
    const clon = plantilla.content.cloneNode(true);
    const numeroSerie = clon.querySelector("#numeroSerie");
    numeroSerie.textContent = "serie" + series.toString();
    numeroSerie.id = series;
    formulario.appendChild(clon);

}

function obtenerDatos() {

    const pesos = document.querySelectorAll(".peso");
    const repeticiones = document.querySelectorAll(".reps");
    const descansos = document.querySelectorAll(".descanso");
    fecha = document.querySelector("#fecha").value;
    comentario = document.querySelector("#comentario").value;

    // volvemos los datos enteros

    const pesosValores = [...pesos].map(x => Number(x.value));  
    const repeticionesValores = [...repeticiones].map(x => Number(x.value));

    //se saca promedio de peso, reps y descanso

    peso = (pesosValores.reduce( (acum, a) => acum+a, 0)) / series;
    reps = (repeticionesValores.reduce( (acum, a) => acum+a, 0)) / series;

    // evitamos dividir en 0 en descanso

    if (series > 1) { 
        
        const descansosValores = [...descansos].map(x => Number(x.value));
        descanso = (descansosValores.reduce( (acum, a) => acum+a, 0)) / (series-1); 
    }

    // para verificar que se obtienen los datos correctamente

    console.log("peso: ", peso);
    console.log("reps: ", reps);
    console.log("descanso: ", descanso);

    return {peso: peso, reps: reps, series:series, descanso:descanso, fecha: fecha, comentario: comentario, idEjercicio: idEjercicio};

}