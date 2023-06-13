import {signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import {auth} from './firebase.js'
import{mostrarMensaje} from './mensajeError.js'


const loginForm = document.querySelector('#form-login')

loginForm.addEventListener('submit', async e => {
    e.preventDefault()
 
    const correo = loginForm['usuario-login'].value
    const password = loginForm['password-login'].value
    console.log(correo, password)

    console.log(correo)

    try{
        const credenciales = await signInWithEmailAndPassword(auth,correo,password) 
        console.log(credenciales)
        mostrarMensaje("Bienvenido", "success")
        window.location.replace('../index.html');
        

    }catch(error){
        
        console.log(error.message)
        console.log(error.code)

        if(error.code === 'auth/wrong-password'){
            mostrarMensaje("Contraseña Incorrecta", "error")
        }
        if(error.code === 'auth/user-not-found'){
            mostrarMensaje("Usuario no encontrado", "error")
        }
        
    }

})

const btnRegistrar = document.getElementById('registrar');

btnRegistrar.addEventListener('click', () => {
  window.location.replace('registro-usuario.html');
});




    