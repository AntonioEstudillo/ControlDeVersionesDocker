import {
    getDocs,
    where,
    query,
    compraRef} from './firebase.js';
	const comprador = ''+localStorage.getItem('correo')
    const publicacionesContenedor = document.getElementById('listaCompras');
	const consultaVenta = query(compraRef, where("comprador", "==", comprador))
// Obtén los documentos de la colección de publicaciones
getDocs(consultaVenta).then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		// Obtén los datos del documento
		const docData = doc.data();

		// Crea un nuevo elemento div para la publicación
		const publicacionDiv = document.createElement('div');
		publicacionDiv.classList.add('publicacion');

		// Agrega el título y el extracto de la publicación al div
		publicacionDiv.innerHTML = `
				<h2>${docData.articulo}<h2>
				<p>Referencia de pago: ${docData.refPago}<p>
				<p>Fecha de realización: ${new Date(docData.fecha).toLocaleString()}</p>
			`;

		// Agrega un controlador de eventos al div para redirigir al usuario a la página de la publicación
		publicacionDiv.addEventListener('click', () => {
			window.location.replace(`checkout.html?id=${docData.refPago}`);
		});


		// Agrega el div al contenedor de publicaciones
		publicacionesContenedor.appendChild(publicacionDiv);
	});
}).catch((error) => {
	console.log(error);
});