/*********************************************************************************
script del carrito: 
- asignacion de id unico a cada comida seleccionada
- remover productos: alerta mensaje para confirmar/eliminar 
*********************************************************************************/

let cartProducts = JSON.parse(localStorage.getItem("carrito")) || [];

let container = document.querySelector(".cart-products");

// Asignar "cartId" a los productos (porque sino cuando pido mas de una comidas igual, y quiero eliminar alguna se eliminan todas por tenr el mismo id comidas)
cartProducts = cartProducts.map((product) => {
  if (!product.idCart) {
    return { ...product, idCart: Date.now() + Math.random() };
  }
  return product;
});

//--------------------
// Guardar de nuevo en localStorage
localStorage.setItem("carrito", JSON.stringify(cartProducts));

const renderCartProducts = () => {
  let container = document.querySelector(".cart-products");
  let productsHTML = "";
  let total = 0;

  cartProducts.forEach((product) => {
    productsHTML += `
    <div class="product">
        <h3 class="product-name">${product.nombre}</h3>
        <div class="product-p-r">
          <h4 class="product-price">$${product.precio}</h5>
          <button class="product-remove-btn" onclick="removeById(${product.idCart})">-</button>
        </div>
    </div>
    `;
    total += product.precio;
  });
  container.innerHTML = productsHTML;

  const totalContainer = document.getElementById("total");
  if (totalContainer) totalContainer.innerText = `Total: $${total}`;
};

renderCartProducts();

// ------------------
// limpio todo el carrito y storage con el boton "Clear cart"
let clearButton = document.getElementById("clear-btn");

clearButton.addEventListener("click", () => {
  const totalContainer = document.getElementById("total");
  if (totalContainer && totalContainer.innerText !== "Total: $0") {
    Swal.fire({
      title: "Clear cart?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `Cancel`,
      timer: 3000,
    }).then((res) => {
      if (res.isConfirmed) {
        localStorage.removeItem("carrito"); // limpio storage
        cartProducts = []; // limpio DOM
        renderCartProducts();
        // resetear el total en el DOM
        if (totalContainer) totalContainer.innerText = "Total: $0";
        Swal.fire({
          title: "Your cart is empty.",
          icon: "success",
        });
      }
    });
  }
});

// ------------------
// quitar un producto individual del carrito
const removeById = (idCart) => {
  cartProducts = cartProducts.filter((p) => p.idCart !== idCart);
  // updateo localStorage
  localStorage.setItem("carrito", JSON.stringify(cartProducts));
  renderCartProducts();
};

//--------------
// funcion con alert para confirmar el pedido y obtener el nro de orden
let checkoutButton = document.getElementById("checkout-btn");

let nroPedido = parseInt(localStorage.getItem("nroPedido")) || 1;

checkoutButton.addEventListener("click", () => {
  const totalContainer = document.getElementById("total");

  Swal.fire({
    title: "Place order?",
    showDenyButton: true,
    confirmButtonText: "Confirm",
    denyButtonText: "Back",
    timer: 3000, //duracion de la alerta
  }).then((res) => {
    if (res.isConfirmed && totalContainer.innerText !== "Total: $0") {
      const totalFinal = cartProducts.reduce((acc, p) => acc + p.precio, 0);
      localStorage.removeItem("carrito"); // Clear storage
      cartProducts = []; // Clear the DOM
      renderCartProducts();
      const nroPedidoActual = nroPedido;
      nroPedido++;
      localStorage.setItem("nroPedido", nroPedido);

      Swal.fire({
        title: `Order confirmed. Total: $${totalFinal} Order #${nroPedidoActual}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Back to main menu",
        cancelButtonText: "Exit",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "index.html";
        } else if (result.isDismissed) {
          document.body.innerHTML = `
            <div class="saludo-final">
              <h1>Thank you for visiting</h1>
            </div>
          `;
        }
      });

      const totalContainer = document.getElementById("total");
      if (totalContainer) totalContainer.innerText = "Total: $0";
    } else if (res.isConfirmed && totalContainer.innerText === "Total: $0") {
      Swal.fire({
        title: `Your cart is empty, no order can be placed.`,
        icon: "info",
      });
    }
  });
});
