document.addEventListener("DOMContentLoaded", async() => {

    const contenedor = document.querySelector(".contenedor-dias")
    
    contenedor.addEventListener("click", (objeto) => {

        if (objeto.target.tagName === "BUTTON") {

            const parametros = new URLSearchParams(window.location.search);
            const codigo = parametros.get('codigo')
            const dia = objeto.target.name;
            window.location.href = `/deportista?dia=${dia}&codigo=${codigo}`;       

        }   


    });

});