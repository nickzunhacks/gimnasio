async function rol() {

    const response = await fetch(`http://localhost:3000/session_rol`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });

    const dato = await response.json();

    return dato.rol

}

document.addEventListener("DOMContentLoaded", async() => {

    const contenedor = document.querySelector(".contenedor-dias")
    
    contenedor.addEventListener("click", (objeto) => {

        if (objeto.target.tagName === "BUTTON") {

            const resultado = rol()

            if (resultado === "deportista"){

                const dia = objeto.target.name;
                window.location.href = `/deportista?dia=${dia}`;

            } else {

                const parametros = new URLSearchParams(window.location.search);
                const codigo = parametros.get('codigo')

                console.log(codigo);

                const dia = objeto.target.name;
                window.location.href = `/deportista?dia=${dia}&codigo=${codigo}`;       

            }

        }   


    });

});