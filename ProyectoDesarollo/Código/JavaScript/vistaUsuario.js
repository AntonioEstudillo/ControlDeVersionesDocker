import {
  getDocs,
  where,
  query,
  usuariosRef,
  deleteUsuario,
  updateUsuario,
  subirArchivo,
  postRef,
  orderBy,
  limit
} from "./firebase.js";

import { signOut } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import {auth} from './firebase.js'

import{mostrarMensaje} from './mensajeError.js'


let id = "";

const perfilUsuario = document.getElementById("visualizar-usuario");

const imagenPerfil = document.getElementById("imagen-perfil");

const ultimasPublicacioesn = document.getElementById("articulos-recientes");

const confirmDeleteModal = new bootstrap.Modal(document.querySelector('#confirm-delete-modal'));

let urlImg = "";

window.addEventListener("DOMContentLoaded", async () => {
  
let correo = ''
correo = localStorage.getItem('correo')

  console.log(correo)
  const consultaUsuario = query(
    usuariosRef,
    where("email", "==", correo)
  );
  const querySnapshot = await getDocs(consultaUsuario);

  let html = "";

  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    console.log(doc.id);
    const usuarios = doc.data();
    console.log(doc.data());
    console.log(perfilUsuario);
    html += `   
    <div id="info-usuario">
      <label for="nombre">Nombre:</label>
      <label class='editable' for="nombre">${usuarios.nombre}</label>
      <label class='editable apellido' for="apellido">${usuarios.apellido}</label>
      <br /><br />
      <label>Correo:</label>
      <label  for="correo">${usuarios.email}</label>
      <br /><br />
      <label>Telefono:</label>
      <label class='editable' for="telefono">${usuarios.telefono}</label>
      <br /><br />
      <label for="direccion">Direccion:</label>
      <label class='editable' for="calle">${usuarios.calle}</label>
      <label class="caracter-especial">#</label>
      <label class='editable' for="num_exterior">${usuarios.num_exterior}</label>
      <label class="caracter-especial">C.P.</label>
      <label class='editable' for="codigo_postal">${usuarios.codigo_postal}</label>
      <br /><br />
      <label>Descripción:</label>
      <br />
      <label class='editable' for="descripcion">${usuarios.descripcion}</label>
      <br /><br />
      <button class='btn-editar' data-id="${doc.id}"><i class="fa-solid fa-pencil"></i>Editar usuario</button>
      <button class='btn-eliminar' data-id="${doc.id}"><i class="fa-solid fa-trash"></i>Eliminar usuario</button>
      <button class="btn-guardar" type="submit" style="display:none;">Guardar cambios</button>
   </div>
        
        `;

        let htmlImagen = "";

        htmlImagen += `
        <img src="${usuarios.url}" class="imagen-perfil" width="200px" height="200px" style="border-radius: 100%;" />
        <br />
        <form id="task-form" class="asignarImg">
          <input class="col-7" type="file" id="fileInput" required>
          <button class="btn-task-save" data-id="${doc.id}" id="btn-task-save">Cambiar Imagen</button>
        </form>
          
          `;
        imagenPerfil.innerHTML = htmlImagen;
              
        const taskForm = imagenPerfil.querySelector(".asignarImg"); //Actualizar Imagen
        console.log(imagenPerfil);
        console.log(taskForm);


        const btnGuardarImg = imagenPerfil.querySelector(".btn-task-save");

        btnGuardarImg.addEventListener("click", async (e) => {
          e.preventDefault();
        
          console.log("llegue aqui")
          urlImg = await subirArchivo(taskForm["fileInput"].files[0]);
          localStorage.setItem('urlImagen',urlImg)
          console.log(localStorage.getItem('urlImagen')) 
          
          let x = ""+localStorage.getItem('urlImagen')
          
            console.log(x)
            id =  e.target.dataset.id;
            console.log(id)
            console.log(btnGuardarImg)
            console.log("llegue a btn-task-save")
            console.log(id);
            updateUsuario(id, {
              url: x
            });

            mostrarMensaje("Imagen actualizada correctamente","success");
            localStorage.removeItem('urlImagen')
            setTimeout(function() {
              window.location.reload();
            }, 2500);            
        });
    });
    
    const consultaVenta = query(postRef, where("autor", "==", correo), limit(3));
    
    const querySnapshotVenta = await getDocs(consultaVenta);

    querySnapshotVenta.forEach((doc)=>{
      console.log(doc.id, "=>", doc.data());
      console.log(doc.id);
      const post = doc.data();
      console.log(doc.data());

      let hmtlUltimasPublicaciones = "";
      
        hmtlUltimasPublicaciones += `
        <h1>Últimas publicaciones</h1>
        <div class="col-md-12">
          <div id="articulos-recientes">
            <div class="datosPost" style="margin-right: 20px;">
              <p> ${post.titulo} </p>
              <p> ${post.descripcion} </p>
            </div>
            <img src="${post.url}" style="border-radius: 100%; max-width: 150px;" />
          </div>
          `;
        ultimasPublicacioesn.innerHTML = hmtlUltimasPublicaciones;
      
    })

    
    


  perfilUsuario.innerHTML = html;

  const btnEliminar = perfilUsuario.querySelectorAll(".btn-eliminar");

  btnEliminar.forEach((btn) => {
    btn.addEventListener("click", async ({ target: { dataset } }) => {
      confirmDeleteModal.show();

      const btnAceptar = document.getElementById('confirm-delete-btn');
      btnAceptar.addEventListener('click', async () => {
        deleteUsuario(dataset.id);
        

        await signOut(auth)
        window.location.replace('index.html');
        console.log(dataset.id);
      })
      
    });
  });

  const btnEditar = perfilUsuario.querySelectorAll(".btn-editar");
  btnEditar.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      
      const btnEliminar = e.target.parentNode.querySelector('.btn-eliminar');
      btnEliminar.style.display = 'none';
      
      e.target.style.display = 'none';

      // mostrar botón de guardar cambios
      const btnGuardar = document.createElement('button');
      //btnGuardar.type = 'submit'
      btnGuardar.classList.add('btn-guardar');
      btnGuardar.textContent = 'Guardar cambios';
      e.target.parentNode.appendChild(btnGuardar);


      const editableLabels = perfilUsuario.querySelectorAll(".editable");
      editableLabels.forEach((label) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = label.textContent;
        //input.dataset.originalValue = input.value; // Guarda el valor original para poder restaurarlo después si se cancela la edición
        input.id = `${label.getAttribute("for")}-input`;
        label.parentNode.replaceChild(input, label);

        //estadoEditar = true
        id =  e.target.dataset.id;
        console.log("Si llego a btnEditar")
      });
    });
  });

  console.log(btnEliminar);

});







perfilUsuario.addEventListener('click', (e) => {

    
  if (e.target.classList.contains('btn-guardar')) {
    
    
    // obtener los nuevos valores de los inputs
    const inputs = e.target.parentNode.querySelectorAll('input');
    console.log(inputs)

    const nombreInput = document.getElementById("nombre-input")
    const apellidoInput = document.getElementById('apellido-input');
    const telefonoInput = document.getElementById('telefono-input');
    const calleInput = document.getElementById('calle-input');
    const numExteriorInput = document.getElementById('num_exterior-input');
    const codigoPostalInput = document.getElementById('codigo_postal-input');
    const descripcionInput = document.getElementById('descripcion-input');

    const nuevoNombre = nombreInput.value;
    const nuevoApellido = apellidoInput.value;
    const nuevoTelefono = telefonoInput.value;
    const nuevaCalle = calleInput.value;
    const nuevoNumExterior = numExteriorInput.value;
    const nuevoCodigoPostal = codigoPostalInput.value;
    const nuevaDescripcion = descripcionInput.value;

    // actualizar los datos en la base de datos
    updateUsuario(id, {
      nombre: nuevoNombre,
      apellido: nuevoApellido,
      telefono: nuevoTelefono,
      calle: nuevaCalle,
      num_exterior: nuevoNumExterior,
      codigo_postal:nuevoCodigoPostal,
      descripcion:nuevaDescripcion,

    });

    // volver a mostrar los labels con los nuevos valores
    inputs.forEach((input) => {
      const label = document.createElement('label');
      label.textContent = input.value;
      input.replaceWith(label);
    });

    // ocultar el botón de guardar cambios y mostrar el botón de editar
    const btnEditar = e.target.parentNode.querySelector('.btn-editar');
    btnEditar.style.display = 'inline-block';
    e.target.style.display = 'none';
    btnEliminar.style.display = 'inline-block';

    mostrarMensaje("Datos actualizados correctamente", "success")
  }
});


