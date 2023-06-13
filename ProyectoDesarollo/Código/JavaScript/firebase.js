// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-analytics.js";
import { getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";

import {getDatabase} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js'

import{mostrarMensaje} from './mensajeError.js';

import {
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  getDocs,
  getDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";

import {v4} from "https://jspm.dev/uuid";
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyA86pU7UjqYf0WONz6Q92BhViGt1HXuEs0",

  authDomain: "trashmarket-e84ca.firebaseapp.com",

  projectId: "trashmarket-e84ca",

  storageBucket: "trashmarket-e84ca.appspot.com",

  messagingSenderId: "887542065701",

  appId: "1:887542065701:web:110e6ca398709669ecedcc",

  measurementId: "G-RE9T5N2LY2",

  databaseURL: 'https://trashmarket-e84ca-default-rtdb.firebaseio.com/'
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

export const realtimeDB = getDatabase();

export const db = getFirestore();

export const storage = getStorage(app);

export const auth = getAuth(app);

export const saveUsuario = (
  nombre,
  apellido,
  email,
  telefono,
  contraseña,
  calle,
  codigo_postal,
  num_exterior,
  descripcion,
  url
) =>
  addDoc(collection(db, "usuarios"), {
    nombre,
    apellido,
    email,
    telefono,
    contraseña,
    calle,
    codigo_postal,
    num_exterior,
    descripcion,
    url
  });

//export const realtimeDBRef = ref(realtimeDB, "chats");

export const getUsuarios = () => getDocs(collection(db, "usuarios"));

export const usuariosRef = collection(db, "usuarios");

export { query, where, getDocs, orderBy, limit };

export const onGetUsuario = (callback) =>
  onSnapshot(collection(db, "usuarios"), callback);

export const deleteUsuario = (id) => deleteDoc(doc(db, "usuarios", id));

export const getUsuario = (id) => getDoc(doc(db, "usuarios", id));

export const updateUsuario = (id, nuevosCampos) =>
  updateDoc(doc(db, "usuarios", id), nuevosCampos);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const emailActivo = user.email;
      localStorage.setItem('correo',emailActivo)
      const uid = user.uid;
      localStorage.setItem('uid', uid)
    } else {
      // User is signed out
      // ...
    }
  });

  console.log(localStorage.getItem('correo'))

      //Vista post
  
      export const postRef = collection(db, "post");

      export const deletePost = id => deleteDoc(doc(db,'post',id));

      //Crear post
      export const guardarPost = (title, description, url, video, autor) =>{
        addDoc(collection(db, "post"),{
          titulo: title,
          descripcion: description,
          url : url,
          video : video,
          autor : autor
        }).then(()=>{
          mostrarMensaje("Post Guardado", "success");
        });
      }
      
      export function subirArchivo(file) {
      const storageRef = ref(storage, "post/" + v4());
      return uploadBytes(storageRef, file)
        .then(snapshot => {
          return getDownloadURL(snapshot.ref);
        })
        .then(url => {
          return url;
        });
      }
      
      //Actualizar Post
      export const updatePost = (id, nuevosCampos) =>
      updateDoc(doc(db, "post", id), nuevosCampos);


    //PostVenta
    export const ventaRef = collection(db, "ventas");

      export const deleteVenta = id => deleteDoc(doc(db,'ventas',id));

      export const guardarVenta = (title, category, price, amount, description, urlImg, vendedor) =>{
        addDoc(collection(db, "ventas"),{
          titulo: title,
          categoria: category,
          precio: price,
          cantidad: amount,
          descripcion: description,
          url : urlImg,
          vendedor: vendedor
        }).then(()=>{
          mostrarMensaje("Post de venta Guardado", "success");
        });
      }

      //Vista postVenta
  
      export const postVentaRef = collection(db, "ventas");

      export const deletePostVenta = id => deleteDoc(doc(db,'ventas',id));

      //Actualizar PostVenta
      export const updatePostVenta = (id, nuevosCampos) =>
      updateDoc(doc(db, "ventas", id), nuevosCampos);


      //Guardar Compra
      export const compraRef = collection(db, "compras");
      export const guardarCompra = (venta, cantidad, total, fecha, refPago, vendedor, comprador, articulo) =>{
        addDoc(collection(db, "compras"),{
          venta: venta,
          cantidad: cantidad,
          total: total,
          fecha: fecha,
          refPago: refPago,
          vendedor: vendedor,
          comprador: comprador,
          articulo: articulo
        }).then(()=>{
          mostrarMensaje("Compra Realizada con Exito", "success");
        });
      }

