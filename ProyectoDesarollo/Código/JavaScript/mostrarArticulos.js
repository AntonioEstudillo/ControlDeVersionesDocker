import {ventaRef, getDocs} from './firebase.js'

const publicacionesContenedor = document.getElementById('publicaciones-venta-contenedor');

// Obtén los documentos de la colección de publicaciones
getDocs(ventaRef).then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		// Obtén los datos del documento
		const docData = doc.data();

		// Crea un nuevo elemento div para la publicación
		const publicacionVentaDiv = document.createElement('div');
		publicacionVentaDiv.classList.add('publicacion-venta');

		// Agrega el título y el extracto de la publicación al div
		publicacionVentaDiv.innerHTML = `
			<div>
                <img class="img-perfil" src="${docData.url}">
            </div>
            <div>
                <h2>${docData.titulo}</h2>
				<p class="descripcion" >${docData.descripcion}</p>
                <p class="precio">$${docData.precio} mxn</p>
            </div>
			`;

		// Agrega un controlador de eventos al div para redirigir al usuario a la página de la publicación
		publicacionVentaDiv.addEventListener('click', () => {
			window.location.replace(`realizarCompra.html?id=${docData.titulo}`);
		});


		// Agrega el div al contenedor de publicaciones
		publicacionesContenedor.appendChild(publicacionVentaDiv);
	});
}).catch((error) => {
	console.log(error);
});