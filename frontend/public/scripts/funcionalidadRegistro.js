function verificarCodigo(codigo) {

    if(isNaN(codigo)){
        return true;
    }else{
        return false;
    }

}

document.addEventListener('DOMContentLoaded', () => {

    const form = document.querySelector('form[name="datosFormulario"]');
    form.addEventListener('submit', capturarDatosRegistro);

});

async function capturarDatosRegistro(event) {

    event.preventDefault();

    const formulario = event.target;

    const datos = {
        "nombre": formulario.elements[0].value,
        "correo": formulario.elements[1].value,
        "codigo": formulario.elements[2].value,
        "contrasena": formulario.elements[3].value 
    }

    if(verificarCodigo(datos.codigo)) {
        alert('el codigo solo debe contener numeros')
    }else{

        try {
    
            const response = await fetch('http://localhost:3000/registrar', {
    
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos)
    
            });
    
            const resultado = await response.json();
            console.log(resultado.message);
    
            formulario.reset();
    
        } catch (err) {
    
            console.log('Error en el envio de datos:', err);
            alert('error al registrar el usuario')
    
        }
    }

}