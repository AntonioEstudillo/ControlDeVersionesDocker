import { guardarVenta, subirArchivo } from "./firebase.js";

window.addEventListener("DOMContentLoaded", () => {});

const taskForm = document.getElementById("postVenta-form");

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["postVenta-title"];
  const category = taskForm["postVenta-categoria"];
  const price = taskForm["postVenta-precio"];
  const amount = taskForm["postVenta-inventario"];
  const description = taskForm["postVenta-descripcion"];
  const vendedor =''+localStorage.getItem("correo");
  console.log(vendedor)

  const url = await subirArchivo(taskForm["fileInput"].files[0]);

  guardarVenta(title.value, category.value, price.value, amount.value, description.value, url, vendedor);
  setTimeout(function() {
    window.location.replace('../index.html');
  }, 2500);
  taskForm.reset();
});