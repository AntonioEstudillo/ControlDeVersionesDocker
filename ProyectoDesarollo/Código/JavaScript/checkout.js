import {db , compraRef, getDocs, query, where} from './firebase.js'

import {
    doc,
    getDoc
  } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

let consultaVenta;
let nombreP;
let urlIMG;

const ticket = document.getElementById("datos-ticket");
const nombreProducto = document.getElementById("nombrePorducto");
const imgProducto = document.getElementById("imgProducto");
const datosCompra = document.getElementById("datos-compra");


    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const refP = ""+urlParams.get('id');
    console.log(urlParams);

window.addEventListener("DOMContentLoaded", async () => {
    const consultaCompra = query(
      compraRef,
      where("refPago", "==", refP)
      );
    const querySnapshot = await getDocs(consultaCompra);

    let html = "";
    let html2 = "";
    let html3 = "";
    //let mediaDB = "";
        
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      console.log(doc.id);
      const datosTicket = doc.data();
      console.log(doc.data());
      console.log(datosTicket);
      consultaVenta = datosTicket.venta;
      const fechaCompra = new Date(datosTicket.fecha);
      const dia = fechaCompra.getDate();
      const mes = fechaCompra.getMonth() + 1; // los meses van de 0 a 11 en JavaScript
      const anio = fechaCompra.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${anio}`;

      let idPostVenta = datosTicket.venta;
      //mediaDB = post.url;

      html += `
      
      <label class="cantidad-producto">${"Cantidad: "+datosTicket.cantidad}</label>
      
      <label class="total">${"Total: "+datosTicket.total}</label>
      
       `;

      html2 += `<label class="fecha-compra">${"Fecha de Compra: "+new Date(datosTicket.fecha).toLocaleString()}</label>
      
      <label class="ref-pago">${"Referencia de Pago: "+datosTicket.refPago}</label>`;
    });
    ticket.innerHTML = html2;
    datosCompra.innerHTML = html;

    //consulta por id
    const docId = consultaVenta;
    
    const docRef = doc(db, 'ventas', docId);

    

    getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          console.log(doc.data().titulo);
          console.log('Datos del documento:', doc.data());
          nombreP = ""+doc.data().titulo;
          console.log(nombreP)
          urlIMG = ""+doc.data().url;
          html3 += `
          <h1 class="titulo-principal">Compra Realizada Exitosamente</h1>
          <hr>
          <h3 class="titulo-resumen">Resumen del Pedido</h3>

      <label class="nombre-producto">${nombreP}</label>
      <br>

      
          `;
          nombreProducto.innerHTML = html3;
          //Mostrar imagen
        let html4 = ` <hr> <img src="${urlIMG}" alt="" class="imgP">`;
        imgProducto.innerHTML = html4;
        } else {
          console.log('No se encontró el documento');
        }
        
      }).catch((error) => {
        console.error('Error al obtener el documento:', error);
      });

      

        

        


});