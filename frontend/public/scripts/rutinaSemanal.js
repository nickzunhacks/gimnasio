document.addEventListener("DOMContentLoaded", () => {

    const contenedor = document.querySelector(".contenedor-dias")

    contenedor.addEventListener("click", (objeto) => {

        if (objeto.target.tagName === "BUTTON") {

            const dia = objeto.target.name;
            window.location.href = `/deportista?dia=${dia}`;

        }   

    });

});