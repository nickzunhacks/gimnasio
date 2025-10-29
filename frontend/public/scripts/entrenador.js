function resultadosBuscador(resultados) {

    const resultadosContainer = document.getElementById("resultados-contenedor");
    const plantilla = document.getElementById("plantilla-resultados");

    const clon = plantilla.content.cloneNode(true);
    
    clon.getElementById("boton-resultado").content = `${resultados.code} - ${resultados.nombre}`;
    
    resultadosContainer.appendChild(clon);

}

document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.querySelector(".formulario-buscador");   
    formulario.addEventListener('submit', resultadosBusqueda);

});

async function resultadosBusqueda(event) {
    
    event.preventDefault();

    const formulario = document.querySelector(".formulario-buscador");
    const busqueda = formulario.elements[0].value;
    
    try {

        const response = await fetch(`http://localhost:3000/buscar_usuario?codigo=${busqueda}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},

        });

        const datos = await response.json();

        if(datos.length === 0){
            throw new Error("no coincidencias");
        }

        datos.forEach(resultadosBuscador);

    } catch(err) {

        console.log("error en la busqueda: ", err);

    }

}