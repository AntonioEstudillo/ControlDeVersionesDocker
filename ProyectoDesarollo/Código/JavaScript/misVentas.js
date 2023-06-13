import {
    getDocs,
    where,
    query,
    ventaRef} from './firebase.js';
	const vendedor = ''+localStorage.getItem('correo')
    const publicacionesContenedor = document.getElementById('ventas-contenedor');
	const consultaVenta = query(ventaRef, where("vendedor", "==", vendedor))
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
        <div class="d-flex flex-wrap align-items-center">
            <div class="col-md-2">
                <img class="img-perfil" src="${docData.url}">
            </div>
            <div class="col-md-10">
                <h2>${docData.titulo}</h2>
                <p>${docData.descripcion}</p>
            </div>
        </div>
			`;

		// Agrega un controlador de eventos al div para redirigir al usuario a la página de la publicación
		publicacionDiv.addEventListener('click', () => {
			window.location.replace(`vistaPostVenta.html?id=${docData.titulo}`);
		});


		// Agrega el div al contenedor de publicaciones
		publicacionesContenedor.appendChild(publicacionDiv);
	});
}).catch((error) => {
	console.log(error);
});