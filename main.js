/*********************************************************************************
 *                        Restaurante — Gestión de Pedidos
 *
 * Funcionalidades:
 *  - Mostrar menú de productos
 *  - Agregar productos al carrito
 *  - Modificar pedidos existentes
 *  - Simular orden
 *
 *********************************************************************************/

// las categorías de la API
const obtenerPosteos = async () => {
  let contenedor = document.getElementById("container");

  try {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await res.json();

    let htmlPosteos = "";
    data.categories.forEach((categoria) => {
      htmlPosteos += `
        <div class="category-card">
          <img src="${categoria.strCategoryThumb}" alt="${categoria.strCategory}" width="200"/>
          <div class="title-card">
            <h2>${categoria.strCategory}</h2>
            <button class="btn-card" type="button" onclick="mostrarComidas('${categoria.idCategory}')">+</button>
          </div>
        </div>
      `;
    });

    contenedor.innerHTML = htmlPosteos;
  } catch (error) {
    contenedor.innerHTML = "<div><h2>Algo salió mal</h2></div>";
  }
};

//------------------
// menú - json
let comidasPorCategoria = [];

const cargarComidas = async () => {
  const rta = await fetch("./comidas.json");
  comidasPorCategoria = await rta.json();
};

//funcion para obtener los elementos locales de la categoria seleccionada
const mostrarComidas = (idCategory) => {
  const contenedor = document.getElementById("container");
  contenedor.innerHTML = "";
  const cat = comidasPorCategoria.find(
    (c) => c.idCategoria === Number(idCategory)
  );
  if (cat) {
    let htmlCompleto = "";
    cat.comidas.forEach((comida) => {
      htmlCompleto += `
          <div class="comida-card">
            <p class="comida-nombre">${comida.nombre}</p>
            <p class="comida-descripcion">Description: ${comida.descripcion}</p>
            <p class="comida-precio"> Price: $${comida.precio}</p>
            <button class="btn-agregar" onClick="agregarProducto(${comida.id})">Add to cart</button>
          </div>
        `;
    });
    contenedor.innerHTML = htmlCompleto;
  } else {
    contenedor.innerHTML = "<p>No hay comidas en esta categoría.</p>";
  }
};

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const agregarProducto = (id) => {
  let productoEncontrado;
  // Buscar producto en todas las categorías:
  for (let categoria of comidasPorCategoria) {
    productoEncontrado = categoria.comidas.find((comida) => comida.id === id);
    if (productoEncontrado) break;
  }
  carrito.push(productoEncontrado); // pusheo al carrito
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

//------------------
// llamo a las funciones en orden porqe hay q esperar a q el json argue
const init = async () => {
  await cargarComidas(); // primero cargamos el JSON
  await obtenerPosteos(); // después mostramos las categorías
};

init();
