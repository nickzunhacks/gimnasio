const parametros = new URLSearchParams(window.location.search);
const ejercicio = parametros.get('ejercicio');  
const codigo = parametros.get('codigo');
const dia = parametros.get('dia');

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

        console.log("Error: ",err);

    }

}

async function idRutina() {
    
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

addEventListener("DOMContentLoaded", () => {
    
    const formulario = document.querySelector("#variables");
    formulario.addEventListener("submit", editar);

    document.querySelector("#nombreEjercicio").textContent = ejercicio;

});

async function editar(event) {
    
    event.preventDefault();

    const formulario = document.querySelector("#variables");

    const Ejercicio = await idEjercicio(ejercicio); 
    const Rutina = await idRutina();

    const datos = {

        peso: formulario.elements[0].value,
        reps: formulario.elements[1].value,
        series: formulario.elements[2].value,
        descanso: formulario.elements[3].value,
        ejercicio: Ejercicio,
        rutina: Rutina,

    }

    try {

        const response = await fetch('http://localhost:3000/editar',{

            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos),

        });

        const resultado = await response.json();

        if (response.ok) {

            alert("Cambios hechos correctamente")
            window.location.href = `/deportista?dia=${dia}&codigo=${codigo}`;

        } else {

            console.log(resultado.message);
            
        }

    } catch (err) {

        console.log("Error: ",err);

    }

}