var rolCache = null;

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

document.addEventListener("DOMContentLoaded", async() => {

    const usuario = await rol();
    const contenedor = document.querySelector(".contenedor-dias")
    
    contenedor.addEventListener("click", (objeto) => {

        if (objeto.target.tagName === "BUTTON") {

            const parametros = new URLSearchParams(window.location.search);
            const codigo = parametros.get('codigo')
            const dia = objeto.target.name;
            window.location.href = `/deportista?dia=${dia}&codigo=${codigo}`;       

        }   


    });

    const salir = document.querySelector('#salir');
    salir.addEventListener("click", () => { 
        if (usuario === "deportista") window.location.href = '/login' 
        else window.location.href = '/entrenador';
    });

});

