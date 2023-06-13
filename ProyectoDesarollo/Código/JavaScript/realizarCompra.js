import {
    getDocs,
    where,
    query,
    postVentaRef,
    guardarCompra,
    updatePostVenta,
    usuariosRef, 
    auth} from './firebase.js';
    import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";

import {v4} from "https://jspm.dev/uuid";

import{mostrarMensaje} from './mensajeError.js';

    let id = "";
    let inventarioString = "";
    let inventarioInt = 0; 
    let precio = 0;
    let venta;
    let total;
    let cantidad;
    let fecha;
    let refPago;
    let vendedor;
    let articulo;
    let comprador = "" + localStorage.getItem("correo");
   
    
    const datos  = document.getElementById("datos-postVenta");

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const tituloPostVenta = urlParams.get('id');
    console.log(urlParams);

    window.addEventListener("DOMContentLoaded", async () => {
        const consultaPostVenta = query(
            postVentaRef,
            where("titulo", "==", tituloPostVenta)
        );
        const querySnapshot = await getDocs(consultaPostVenta);
      
        let html = "";
        let mediaDB = "";
        let htmlUsuarios ="";

        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
            console.log(doc.id);
            const postVenta = doc.data();
            console.log(doc.data());
            console.log(datos);
            mediaDB = postVenta.url;
            precio = postVenta.precio;

            inventarioString = postVenta.cantidad;
            inventarioInt = parseInt(inventarioString);

            html += `
            
            <div class="datosPostVenta">
            <label class="editable" for="titulo">${postVenta.titulo}</label>
            <br><br>
      
            <div id="asignarImg"></div>
      
            <br><br>
      
            <label class="editable" for="price">$${postVenta.precio} mxn</label>
            <br><br>
      
            <label class="editable" for="cantidad">${postVenta.cantidad} disponibles</label>
      
              <br/><br/>
              <p>Descripcion</p>
            <label class="editableTF">${postVenta.descripcion}</label>
            
            <br><br>

            <label>Seleccione la cantidad que desea</label>
            <div><button id="disminuir">-</button>
              <label>  </label> <label id="contador-Cantidad">0</label> <label>  </label>
            <button id="incrementar">+</button></div>

            <div>
              <button id="comprar" class="btn-comprar" data-id="${doc.id}" data-vendedor="${postVenta.vendedor}" data-articulo="${postVenta.titulo}">Comprar</button>
            </div>
            <br><br>
            </div>

            <div>
            <button class="btn-conversacion" data-id="${doc.id}">Iniciar convesación</button>         
          </div>
        
            `;
            const consultaUsuario = query(
              usuariosRef,
              where('email', '==', postVenta.vendedor)
              
            );
            
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
                  localStorage.setItem('vendedor', htmlUsuarios)
                  console.log('Si llego a la consulta de usuario')
                  
                });
                  
              })
              .catch((error) => {
                console.log(error);
              });  
              html += ""+localStorage.getItem('vendedor');
              localStorage.removeItem('vendedor');     
      });   
     

      datos.innerHTML = html;

        //Cargar imagen desde la bd
        
        let htmlImagen = "";
        const selectImg = document.getElementById("asignarImg");
        
  
        htmlImagen += `
            
        <img class="img-fluid" src="${mediaDB}" width="250">
                    
            `;
        selectImg.innerHTML = htmlImagen;


        //Botones de incrementar y disminuir cantidad
        let contador = 0;
        const incrementar = document.getElementById("incrementar");
        const disminuir = document.getElementById("disminuir");
        const contadorCantidad = document.getElementById("contador-Cantidad");

        incrementar.addEventListener("click", () => {
            if (contador < inventarioInt) {
                contador++;
                contadorCantidad.innerHTML = contador;
            }
            }
        );

        disminuir.addEventListener("click", () => {
            if (contador > 0) {
                contador--;
                contadorCantidad.innerHTML = contador;
            }
            }
        );

        const btnConversacion = datos.querySelectorAll('.btn-conversacion');

        btnConversacion.forEach((btn) =>{
          btn.addEventListener('click',({ target: { dataset } }) => {
            window.location.replace(`chat.html?id=${dataset.id}`);
          }); 
        })

        //Boton de comprar
        const comprar = document.getElementById("comprar");

        comprar.addEventListener("click",({ target: { dataset } }) => {
            
          onAuthStateChanged(auth, async (user) => {
            if(user){
              if (contador > 0) {
                
                venta = dataset.id;
                cantidad = contador;
                total = precio * cantidad;
                fecha = Date.now()
                refPago = v4();
                vendedor = dataset.vendedor;
                articulo = dataset.articulo;

                guardarCompra(venta, cantidad, total, fecha, refPago, vendedor, comprador, articulo);
                

                //Actualizar inventario
                inventarioInt = inventarioInt - cantidad;
                updatePostVenta(venta, {cantidad: inventarioInt});

                setTimeout(function() {
                  window.location.replace(`checkout.html?id=${refPago}`);
                }, 2500);

               
            }
            else {
                mostrarMensaje("por favor seleccione una cantidad valida", "error");
            }
            }else{
                alert('Inicie sesión para realizar compras');
            }
        })
          
          
        }
        );

        
    });
    
