import {auth} from './firebase.js'
import {sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js"


function resetPassword() {
    const emailAddress = document.getElementById("recuperar-contra").value;
    sendPasswordResetEmail(auth, emailAddress)
      .then(() => {
        alert("Se ha enviado un correo electrónico para restablecer tu contraseña.");
      })
      .catch((error) => {
        alert(error.message);
      });
}

const btnRecuperar = document.getElementById("btn-recuperar");
btnRecuperar.addEventListener("click", () =>{
    resetPassword()
})