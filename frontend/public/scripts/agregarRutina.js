const parametros = new URLSearchParams(window.location.search);
const codigo = parametros.get('codigo');
const dia = parametros.get('dia'); 
var ejercicio = 0;

async function existeRutina() {

    try {

        const response = await fetch(`https://gym-aka6fvgwfkbxbmh4.mexicocentral-01.azurewebsites.net/existe_rutina?codigo=${codigo}&dia=${dia}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });

        if(!response.ok) {

            throw new Error("error en verificar la existencia de la rutina")

        }

        const resultados = await response.json();
        return resultados

    } catch (err) {

        console.log(err.message);
        return {idRutina: -1, estado: false, error: err.message}

    }

}

async function crear() {

    const datos = {

        codigo: codigo,
        dia: dia,
        nombre: formulario.elements[0].value,

    }

    try {

        const response = await fetch(`https://gym-aka6fvgwfkbxbmh4.mexicocentral-01.azurewebsites.net/crear`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos),
        });

        if (!response.ok) {

            throw new Error("error en crear la rutina")

        }

        const resultados = await response.json();
        return resultados;

    } catch (err) {

        console.log(err);
        return {message: err.message};

    }

}

function datosForm () {

    const formulario = document.querySelector('#formulario');

    const datos = {

        peso: formulario.elements[1].value,
        reps: formulario.elements[2].value,
        series: formulario.elements[3].value,
        descanso: formulario.elements[4].value,


    }

    return datos

}

function grupoMuscular(){

    const select = document.querySelector('.gruposMusculares'); 
    const grupoMuscular = select.value
    return grupoMuscular;

}

async function agregar(idRutina) {
    
    if (ejercicio === 0){

        alert("Primero seleccione un ejercicio");;

    } else {

        const estadisticas = datosForm();
        console.log("datos del form: ", estadisticas);

        const datos = {

            idRutina: idRutina,
            idEjercicio: ejercicio,
            peso: estadisticas.peso,
            reps: estadisticas.reps,
            series: estadisticas.series,
            descanso: estadisticas.descanso,

        }

        try {

            const response = await fetch(`https://gym-aka6fvgwfkbxbmh4.mexicocentral-01.azurewebsites.net/agregar`, {

                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos),

            })

            const resultados = await response.json();

            if (!response.ok) {

                throw new Error(resultados.message);

            }

            return resultados.message;

        } catch (err) {

            console.log("Error: ",err);
            return {Error: err.message};

        }

    }

}

async function idRutina(codigo, dia) {
    
    try{


        const response = await fetch(`https://gym-aka6fvgwfkbxbmh4.mexicocentral-01.azurewebsites.net/id_rutina?codigo=${codigo}&dia=${dia}`,{

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

async function agregarEjercicio() {
    
    const existe = await existeRutina();

    if(existe.idRutina != -1) {

        if(existe.estado === false) {

            alert("no existe rutina, lo cual se crea");

            const creacionRutina = await crear();

            if(creacionRutina.message === "exito"){

                console.log("rutina creada con exito");

            } else {

                console.log("problema al crear la rutina");

            }

        } else {

            alert("si existe")

            const nombreRutina = document.querySelector('#nombreRutina');
            nombreRutina.style.display = "none";

        }

        const Rutina = await idRutina(codigo, dia);
        const addRutina = await agregar(Rutina);
        console.log(addRutina);
        return addRutina;

    } else {

        console.log(existe.error);
        return existe.idRutina;

    }

}

function plantilla(ejercicios) {

    const botones = document.querySelector('#plantilla');
    const contenedor = document.querySelector('#resultados');
    const clon = botones.content.cloneNode(true);
    const boton = clon.querySelector('.boton');
    boton.textContent = ejercicios.nombre;
    boton.value = ejercicios.id_ejercicio;
    contenedor.appendChild(clon);

    // este event listener lo que hace es que al hacer click en el boton, la variable global ejercicio se convierte en el id del ejercicio
    // para faciliar la peticion de agregar ejercicio

    boton.addEventListener("click", () => {

        ejercicio = ejercicios.id_ejercicio;
        console.log(ejercicio);

    });

}

async function listaEjercicios(grupoMuscular) {

    try {

        const response = await fetch(`https://gym-aka6fvgwfkbxbmh4.mexicocentral-01.azurewebsites.net/ejercicios?grupoMuscular=${grupoMuscular}`, {

        method: "GET",
        headers: {'Content-Type': 'application/json'},

        }); 

        const resultados = await response.json();

        if(!response.ok) {

            throw new Error("error en el servido al obtener ejercicios por grupo muscular");

        }

        console.log(resultados.message);
        return resultados.results;

    } catch(err) {

        console.log("error en conseguir lista de ejercicios por grupo muscular: ", err.message);

    }

}
    
async function resultados() {

    const contenedor = document.querySelector('#resultados');
    contenedor.innerHTML = "";
    var grupoMuscular = document.querySelector('.gruposMusculares').value;
    var ejercicios = await listaEjercicios(grupoMuscular);
    ejercicios.forEach(plantilla);
    
}

document.addEventListener("DOMContentLoaded", async () => {

    const formulario = document.querySelector('#formulario');
    const select = document.querySelector('.gruposMusculares');
    const contenedor = document.querySelector("#resultados");

    resultados();
    select.addEventListener("change", resultados);

    formulario.addEventListener('submit', async (event) => { 
        
        event.preventDefault();

        const resultado = await agregarEjercicio();

        // si no hay error redirige a la pagina anterior, (la funcion agregarRutina retorna la respuesta del servidor)
        // la respuesta del servidor en el objeto enviado con el atributo idRutina es -1 si existe error

        if (!resultado.idRutina !== -1) {
            window.location.href = `/deportista?dia=${dia}&codigo=${codigo}`;
        }
    }); 

    contenedor.addEventListener("click", (event) => {

        if(!event.target.classList.contains('boton')) return;

        contenedor.querySelectorAll('.boton').forEach(boton => boton.classList.remove('seleccionado'));

        event.target.classList.add('seleccionado');

    });

});

