import {
    getDocs,
    where,
    query,
    postRef,
    deletePost,
    usuariosRef,
    updatePost} from './firebase.js';

    let id = "";
    
    const titulo = document.getElementById("datos-post");

    const cuerpo = document.getElementById("cuerpoPost");
    
    const media = document.getElementById("mediaPost");

    const correo = ''+localStorage.getItem('correo')
    
    const confirmDeleteModal = new bootstrap.Modal(document.querySelector('#confirm-delete-modal'));
  
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tituloPost = urlParams.get('id');
    console.log(urlParams);

    window.addEventListener("DOMContentLoaded", async () => {
        const consultaPost = query(
          postRef,
          where("titulo", "==", tituloPost)
        );
        console.log(consultaPost)
        const querySnapshot = await getDocs(consultaPost);
      
        let html = "";
        let mediaDB = "";
        let htmlUsuarios = "";
            
        querySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          console.log(doc.id);
          const post = doc.data();
          console.log(doc.data());
          console.log(titulo);
          mediaDB = post.url;
          
          html += `
              
          <label class="editable" style="margin-left: 40px; margin-top: 5px; font-size: 50px;" for="titulo">${post.titulo}</label>
          
            <br/><br/>
          <label class="editableTF" style="margin-left: 40px; margin-right: 40px; text-align: justify;" for="descripcion">${post.descripcion}</label>
            <br/><br/>            

              `;

              if(mediaDB != "null" ){
                html += `
                <div id="asignarImg" style="display: flex; justify-content: center; align-items: center;">
                <img class="img-fluid" src="${mediaDB}"/>
                <br/>
              </div>
                `
              }

              if(post.video != "null"){
                
                html += ` 
                <div style="display: flex; justify-content: center;">
                  <iframe width="560" height="315" src="${post.video}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>

                `
               console.log('video') 
              }

              
              if(correo === post.autor){
                html += ` 
                <button class='btn-editar' data-id="${doc.id}"><i class="fa-solid fa-pencil"></i>editar</button>
                <button class='btn-eliminar' data-id="${doc.id}"><i class="fa-solid fa-trash"></i>Eliminar Post</button>
                <button class="btn-guardar" type="submit" style="display:none;">Guardar cambios</button> `
              }

              const consultaUsuario = query(
                usuariosRef,
                where('email', '==', post.autor)
                
              );

              console.log(post.autor)
        
              getDocs(consultaUsuario)
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    const nombreAutor = docData.nombre;
        
                    htmlUsuarios+= `
                    <h2>Datos del Autor</h2>
                    <div>
                      <div id="perfil-autor" class="datosAutor d-flex flex-wrap align-items-center" onclick="window.location.replace('vista-otro-usuario.html?id=${docData.email}')">
                        <div class="col-md-1" >
                          <img src="${docData.url}" style="border-radius: 100%; max-width: 125px;" />
                        </div>
                        <div col-md-11" style="margin-left: 60px;">
                          <p>${docData.nombre} ${docData.apellido}</p>
                          <p>${docData.descripcion}</p>
                        </div>
                      </div>
                    </div>
                    `
                    localStorage.setItem('autor', htmlUsuarios)
                    console.log('Si llego a la consulta de usuario')
                    
                    
                  });
                    
                })
                .catch((error) => {
                  console.log(error);
                });  
                html += ""+localStorage.getItem('autor');
                localStorage.removeItem('autor');
                
                

        });
        titulo.innerHTML = html


        const btnEliminar = titulo.querySelectorAll(".btn-eliminar");

        btnEliminar.forEach((btn) => {
          btn.addEventListener("click", async ({ target: { dataset } }) => {
            confirmDeleteModal.show();

            const idPost = dataset.id;
      
            const btnAceptar = document.getElementById('confirm-delete-btn');
            btnAceptar.addEventListener('click', async () => {
              deletePost(idPost);
              
              setTimeout(function() {
                console.log(idPost)
                window.location.replace('../index.html');
                console.log(dataset.id);
              }, 2500);
             
            })
          })
        });


        const btnEditar = titulo.querySelectorAll(".btn-editar");
        btnEditar.forEach((btn) => {
        btn.addEventListener("click", (e) => {
      
        e.target.style.display = 'none';

        // mostrar botón de guardar cambios
        const btnGuardar = document.createElement('button');
        //btnGuardar.type = 'submit'
        btnGuardar.classList.add('btn-guardar');
        btnGuardar.textContent = 'Guardar cambios';
        e.target.parentNode.appendChild(btnGuardar);


        const editableLabels = titulo.querySelectorAll(".editable");
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


      const editableTA = titulo.querySelectorAll(".editableTF");
      editableTA.forEach((label) => {
        const textarea = document.createElement("textarea");
        textarea.value = label.textContent;
        textarea.rows = 12;
        textarea.cols = 100;
        //textarea.dataset.originalValue = textarea.value; // Guarda el valor original para poder restaurarlo después si se cancela la edición
        textarea.id = `${label.getAttribute("for")}-input`;
        label.parentNode.replaceChild(textarea, label);

        //estadoEditar = true
        id =  e.target.dataset.id;
        console.log("Si llego a btnEditar")
      });
    });
  });

       

        titulo.addEventListener('click', (e) => {
          if (e.target.classList.contains('btn-guardar')) {
            // obtener los nuevos valores de los inputs
            const inputs = e.target.parentNode.querySelectorAll('input');
            const textareas = e.target.parentNode.querySelectorAll('textarea');
            console.log(inputs)
            
        
            const tituloInput = document.getElementById("titulo-input")
            const descripcionInput = document.getElementById('descripcion-input');
            
        
            const nuevoTitulo = tituloInput.value;
            const nuevaDescripcion = descripcionInput.value;
            
            console.log(id);
        
            // actualizar los datos en la base de datos
            updatePost(id, {
              titulo: nuevoTitulo,
              descripcion: nuevaDescripcion
            });
        
            // volver a mostrar los labels con los nuevos valores
            inputs.forEach((input) => {
              const label = document.createElement('label');
              label.textContent = input.value;
              input.replaceWith(label);
            });

            textareas.forEach((textarea) => {
              const label = document.createElement('label');
              label.textContent = textarea.value;
              textarea.replaceWith(label);
            });
        
            // ocultar el botón de guardar cambios y mostrar el botón de editar
            const btnEditar = e.target.parentNode.querySelector('.btn-editar');
            btnEditar.style.display = 'inline-block';
            e.target.style.display = 'none';
          }
        });



    });
  