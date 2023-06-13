import { realtimeDB} from "./firebase.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";
import {onValue, set, ref, child } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js";

// Crear id de conversación
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const user = ''+localStorage.getItem('correo');
const recipient = ''+urlParams.get('id');
console.log('Usuario: '+ user)
const correoID = user.split('@')[0];
const correoIDsinPuntos = correoID.replace(/\./g, '');
console.log(correoIDsinPuntos)
//const conversationId = 'Prueba'
const conversationId = [recipient, correoID].sort().join('-');
console.log(conversationId)

const dbRef = ref(realtimeDB)

// Obtener los elementos de la interfaz de usuario
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.getElementById("chat-messages");

// Crear un nuevo mensaje y enviarlo a la base de datos
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = chatInput.value.trim();
  if (message === "") return;
  set(child(dbRef, "chat/"+conversationId), {
  message: message,
  sender: user,
  timestamp: Date.now(),
  });

  chatInput.value = "";
});

// Mostrar los mensajes en la interfaz de usuario
onValue(child(dbRef, "chat/"+conversationId), (snapshot) => {
  const message = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  if (message.sender === user) {
    messageElement.classList.add("sent");
  } else {
    messageElement.classList.add("received");
  }

  messageElement.innerHTML = `
    <div class="sender">${message.sender}</div>
    <div class="text">${message.message}</div>
    <div class="timestamp">${new Date(message.timestamp).toLocaleString()}</div>
  `;

  chatMessages.appendChild(messageElement);
});