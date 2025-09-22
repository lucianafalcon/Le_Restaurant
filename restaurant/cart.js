/*********************************************************************************
script del carrito: 
- asignacion de id unico a cada comida seleccionada
- remover productos: alerta mensaje para confirmar/eliminar 
*********************************************************************************/

let cartProducts = JSON.parse(localStorage.getItem("carrito")) || [];
//console.log(cartProducts);

let container = document.querySelector(".cart-products");

//--------------------
// Asignar cartId a los productos que no lo tengan
cartProducts = cartProducts.map((product) => {
  if (!product.idCart) {
    return { ...product, idCart: Date.now() + Math.random() };
  }
  return product;
});

// Guardar de nuevo en localStorage
localStorage.setItem("carrito", JSON.stringify(cartProducts));

const renderCartProducts = () => {
  let container = document.querySelector(".cart-products");
  let productsHTML = "";
  let total = 0; //console.log(container);

  cartProducts.forEach((product) => {
    productsHTML += `
    <div class="product">
        <h3>${product.nombre}</h3>
        <h5>$${product.precio}</h5>
        <button onclick="removeById(${product.idCart})">Remove from cart</button>
    </div>
    `;
    total += product.precio; // sumamos aquí
  });

  container.innerHTML = productsHTML;

  // Mostrar total al final
  const totalContainer = document.getElementById("total");
  if (totalContainer) totalContainer.innerText = `Total: $${total}`;
  return total; // opcional, si queremos usarlo fuera
};

renderCartProducts();

// -------------------
// Clear the entire cart with the "Clear cart" button
console.log(Swal);
let clearButton = document.getElementById("clear");

clearButton.addEventListener("click", () => {
  const totalContainer = document.getElementById("total");

  if (totalContainer && totalContainer.innerText !== "Total: $0") {
    Swal.fire({
      title: "Seguro limpiar carrito?",
      showDenyButton: true,
      confirmButtonText: "Sí, limpiar",
      denyButtonText: `cancelar`,
      timer: 3000, //duracion de la alerta
    }).then((res) => {
      console.log(res);
      if (res.isConfirmed) {
        localStorage.removeItem("carrito"); // Clear storage
        cartProducts = []; // Clear the DOM
        renderCartProducts();
        // resetear el total en el DOM
        if (totalContainer) totalContainer.innerText = "Total: $0";

        Swal.fire({
          title: "Carrito limpiado",
          icon: "success",
        });
      }
    });
  }
});

// -------------------
// Remove a single product from the cart
const removeById = (idCart) => {
  console.log(idCart);
  cartProducts = cartProducts.filter(
    (p) => Number(p.idCart) !== Number(idCart)
  );

  // Update localStorage with the remaining products
  localStorage.setItem("carrito", JSON.stringify(cartProducts));

  renderCartProducts();
};

//-------------------

let checkoutButton = document.getElementById("checkout");

checkoutButton.addEventListener("click", () => {
  const totalContainer = document.getElementById("total");

  Swal.fire({
    title: "Terminar pedido?",
    showDenyButton: true,
    confirmButtonText: "Confirmar",
    denyButtonText: "No, volver",
    timer: 3000, //duracion de la alerta
  }).then((res) => {
    console.log(res);
    if (res.isConfirmed && totalContainer.innerText !== "Total: $0") {
      const totalFinal = cartProducts.reduce((acc, p) => acc + p.precio, 0);
      localStorage.removeItem("carrito"); // Clear storage
      cartProducts = []; // Clear the DOM
      renderCartProducts();
      Swal.fire({
        title: `Pedido confirmado, total: $${totalFinal}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Volver al menu principal",
        cancelButtonText: "Salir",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "index.html"; // o donde sea tu menú
        } else if (result.isDismissed) {
          document.body.innerHTML = `
            <div style="display:flex;justify-content:center;align-items:center;height:100vh;">
              <h1>Gracias por tu visita</h1>
            </div>
          `;
        }
      });

      const totalContainer = document.getElementById("total");
      if (totalContainer) totalContainer.innerText = "Total: $0";
    } else if (res.isConfirmed && totalContainer.innerText === "Total: $0") {
      Swal.fire({
        title: `No existen productos para realizar el pedido`,
        icon: "info",
      });
    }
  });
});
