document.addEventListener('DOMContentLoaded', () => {

    const formulario = document.querySelector('form[name=datosFormularioLogIn]');
    formulario.addEventListener('submit', iniciarSesion)
})

async function iniciarSesion(event) {
  
    event.preventDefault();


    const formulario = document.forms['datosFormularioLogIn'];


    const datos = {

      codigo: formulario.elements[0].value,
      contrasena: formulario.elements[1].value,

    }

    try {

      const response = await fetch('https://gym-aka6fvgwfkbxbmh4.mexicocentral-01.azurewebsites.net/login', {

        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(datos),

      });

      const resultado = await response.json();

      if (response.ok){

        localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

        if(resultado.usuario.rol === 'entrenador') {
          window.location.href = '/entrenador';
        }else {
          window.location.href = '/rutina_semanal';
        }

      } else {
        alert(resultado.message);
      }

    } catch(err) {
      
      console.log('error al iniciar sesion: ', err);

    }

  

}


