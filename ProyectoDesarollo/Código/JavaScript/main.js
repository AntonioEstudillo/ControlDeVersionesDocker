import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import {auth } from './firebase.js'
import {loginCheck} from './loginCheck.js'

//import './login.js'
import './logout.js'
//import './registro.js'

const divTienda = document.getElementById('tienda')
const divComunidad = document.getElementById('comunidad')
const divPuntos = document.getElementById('puntosInt')

onAuthStateChanged(auth, async (user) => {
    if(user){
        loginCheck(user)
    }else{
        loginCheck(user)
    }
})

document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que el formulario se envíe
    var searchTerm = document.getElementsByName('search')[0].value; // Obtiene el término de búsqueda
    const currentPath = window.location.pathname;
          console.log(currentPath);
          const newPath = currentPath.includes('index.html') ? `./HTML/resultados-busqueda.html?id=${searchTerm}` : `./resultados-busqueda.html?id=${searchTerm}`;
         // window.location.replace(newPath);
        window.location.href = newPath;
  });

  divComunidad.addEventListener('click', () => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.includes('index.html') ? './HTML/comunidad.html' : './comunidad.html';
    window.location.replace(newPath);
});

divTienda.addEventListener('click', () => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.includes('index.html') ? './HTML/tienda.html' : './tienda.html';
    window.location.replace(newPath);
});

divPuntos.addEventListener('click', () => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.includes('index.html') ? './HTML/puntosInt.html' : './puntosInt.html';
    window.location.replace(newPath);
});

  