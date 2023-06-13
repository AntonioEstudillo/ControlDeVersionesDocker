import { signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import {auth} from './firebase.js'

const logout = document.querySelector('#logout-user');

logout.addEventListener('click', async () => {
   // Mostrar el modal de confirmación
   const confirmLogoutModal = new bootstrap.Modal(document.querySelector('#confirm-logout-modal'));
   confirmLogoutModal.show();

   const btnAceptar = document.getElementById('confirm-logout-btn');

   btnAceptar.addEventListener('click', async () => {
      await signOut(auth);
      localStorage.clear('correo');
      localStorage.clear('uid');
      console.log('signout');
      window.location.replace('../index.html');
   })

 });