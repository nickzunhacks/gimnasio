const parametros = new URLSearchParams(window.location.search);
const nombreEjercicio = parametros.get('nombre');
const idEjercicio = parametros.get('id');
const dia = parametros.get('dia');
let codigo = null;
let rolCache = null

document.addEventListener("DOMContentLoaded", async() => {

    document.querySelector("#tituloPrincipal").textContent = nombreEjercicio;

    const Rol = await rol();

    if (Rol === "entrenador") codigo = parametros.get('codigo');

    const salir = document.querySelector('#salir');

    salir.addEventListener("click", () => {window.location.href = `/deportista?codigo=${codigo}&dia=${dia}`});

    try{
    //enviamos peticion con idEjercicio y codigo correspondiente solo encaso de entrenador el codigo, si no es entrenador es NULL y se sabe que es deportista

        const response = await fetch(`/mostrar_progreso?idEjercicio=${idEjercicio}&codigo=${codigo}`, {

            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'

        });

        if(!response.ok) {
            throw new Error('error al obtener registro de entrenamientos');
        }

        var  datos = await response.json();
        console.log(datos);

        if(datos.length === 0){
            alert('no hay registros para este ejercicio')
        } else {
            
            const fecha = datos.map(d => d.fecha);
            const soloFecha = fechaFormateada(fecha);

            // modificamos el atributo fecha a fecha formateada

            datos = datos.map((d, i) => ({
                ...d,
                fecha: soloFecha[i]
            }));

            //organizamos por fecha de menor a mayor

            datos.sort((a, b) => a.fecha.localeCompare(b.fecha));

            
            console.log(datos);
            const fintness = datos.map(d => (d.peso*d.reps*d.series)/(d.descanso));
            const ctx = document.getElementById("grafica").getContext("2d");
            crearGrafica(soloFecha, fintness, ctx);
            datos.forEach(mostrarDatos);

        }


    } catch (err) {

        console.log(err.message);

    }

});

// se formate fecha solamente año-mes-dia

function fechaFormateada(fechas){

    const fecha = fechas.map(d => d.slice(0,10));
    return fecha

}

function crearGrafica(fecha, fintness, ctx) {

    new Chart(ctx, {    
        type: "line",
        data: {
            labels: fecha,       // eje X
            datasets: [{
                label: "Fitness",
                data: fintness,        // eje Y
                borderWidth: 2,
                tension: 0.3,         // suavidad de curva
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

}

// se obtiene plantilla, se ponen los datos correspondientes y se inserta en plantilla

function mostrarDatos(entrenamiento) {

    const plantilla = document.querySelector("#plantilla-registros");
    const contenedor = document.querySelector("#scroll");
    const clon = plantilla.content.cloneNode(true);

    clon.querySelector(".fecha").textContent = entrenamiento.fecha;
    clon.querySelector(".peso").textContent = entrenamiento.peso;
    clon.querySelector(".reps").textContent = entrenamiento.reps;
    clon.querySelector(".series").textContent = entrenamiento.series;
    clon.querySelector(".descanso").textContent = entrenamiento.descanso;

    contenedor.appendChild(clon);

}

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