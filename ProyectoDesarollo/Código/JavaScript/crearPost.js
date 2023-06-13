import { guardarPost, storage, subirArchivo } from "./firebase.js";

window.addEventListener("DOMContentLoaded", () => {});

const taskForm = document.getElementById("task-form");

let url = "null";

let videoUrl = "null";

let video = false;

const btnInsertVideo = document.getElementById('btn-insert-video');
const videoUrlInput = document.getElementById('video-url-input');
const btnGuardar = document.getElementById('btn-task-save')

// Agregar un controlador de eventos al botón "Insertar Video"
btnInsertVideo.addEventListener('click', (event) => {
  // Mostrar u ocultar el campo de entrada del enlace del video según su estado actual
  if (videoUrlInput.style.display === 'none') {
      videoUrlInput.style.display = 'block';
      video = true
  } else {
      videoUrlInput.style.display = 'none';
      video = false;
  }
  
  event.preventDefault(); // Evitar que el evento de clic se propague al formulario
});


taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  if(taskForm["fileInput"].files[0] != null){
       url = await subirArchivo(taskForm["fileInput"].files[0]);
  }
  

  if(video === true){
    const youtubeUrl = taskForm["video-url-input"].value;
    console.log(youtubeUrl)
    const youtubeId = youtubeUrl.split("=")[1];
    videoUrl = "https://www.youtube.com/embed/"+youtubeId;
  }

  const autor = ''+localStorage.getItem('correo');

  console.log(videoUrl)

  guardarPost(title.value, description.value, url, videoUrl, autor);
  taskForm.reset();
  setTimeout(function() {
    window.location.replace('../index.html');
  }, 2500);  
  
});


