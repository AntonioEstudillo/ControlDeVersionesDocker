import {postRef, getDocs, usuariosRef, query, where, auth} from './firebase.js'
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";

const publicacionesContenedor = document.getElementById('publicaciones-contenedor');
const agregarPost = document.getElementById('agregar-post');
// Obtén los documentos de la colección de publicaciones
// ...

getDocs(postRef)
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const publicacionDiv = document.createElement('div');
      publicacionDiv.classList.add('publicacion');

      publicacionDiv.innerHTML = `
        <h2>${docData.titulo}</h2>
        <p>${docData.descripcion}</p>
      `;

      publicacionDiv.addEventListener('click', () => {
        window.location.replace(`visualizarPost.html?id=${docData.titulo}`);
      });

      const autor = docData.autor;
      console.log(autor);

      

      publicacionesContenedor.appendChild(publicacionDiv);
    });
  })
  .catch((error) => {
    console.log(error);
  });

  agregarPost.addEventListener('click',()=> {
    onAuthStateChanged(auth, async (user) => {
      if(user){
        window.location.replace('CrearPost.html')
      }else{
          alert('Inicie sesión para agregar publicaciones');
      }
    })
  })
  


// ...
