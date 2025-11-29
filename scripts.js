// ---------------------------------------------
// SWIPER (solo si existe en esta página)
// ---------------------------------------------
if (document.querySelector(".slider-wrapper")) {
  const swiper = new Swiper(".slider-wrapper", {
    loop: true,
    grabCursor: true,
    spaceBetween: 5,

    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: true,
    },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
}

// ---------------------------------------------
// TODO EL CÓDIGO VA DENTRO DEL DOMContentLoaded
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------------------------
  // VARIABLES DEL MODAL
  // ---------------------------------------------
  const modal = document.getElementById("modal-carrito");
  const carritoIcono = document.querySelector(".carrito-icono");
  const cerrarModal = document.querySelector(".cerrar-modal");
  const cerrarBtn = document.querySelector(".cerrar-btn");

  // ---------------------------------------------
  // FUNCIONES DEL PUNTO ROJO (notificación)
  // ---------------------------------------------
  function mostrarNotificacionCarrito() {
    const notif = document.getElementById("carrito-notificacion");
    notif.style.display = "block";
  }

  function ocultarNotificacionCarrito() {
    const notif = document.getElementById("carrito-notificacion");
    notif.style.display = "none";
  }

  // ---------------------------------------------
  // CARRITO: Cargar desde localStorage
  // ---------------------------------------------
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Actualizar la pantalla al cargar
  actualizarCarrito();

  // Mostrar puntito si el carrito tiene cosas
  if (carrito.length > 0) {
    mostrarNotificacionCarrito();
  }

  // ---------------------------------------------
  // BOTONES "AGREGAR AL CARRITO" (solo en index)
  // ---------------------------------------------
  const botonesAgregar = document.querySelectorAll(".add-to-cart");

  if (botonesAgregar.length > 0) {
    botonesAgregar.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Loader en el botón
        btn.classList.add("boton-cargando");
        btn.textContent = "";

        setTimeout(() => {
          btn.classList.remove("boton-cargando");
          btn.textContent = "AGREGAR AL CARRITO";

          // Obtener datos del producto
          const card = btn.closest(".card-item");
          const nombre = card.querySelector(".produc").textContent;

          // Leemos el texto del precio, por ejemplo "$29.000"
          const precioTexto = card.querySelector(".price").textContent;

          const precioLimpio = precioTexto
            .replace("$", "")
            .replace(/\./g, "")
            .trim();

          // Lo convertimos a número: "29000" → 29000
          const precio = parseInt(precioLimpio, 10);

          // Revisar si ya existe
          const existe = carrito.find((item) => item.nombre === nombre);

          if (existe) {
            existe.cantidad++;
          } else {
            carrito.push({ nombre, precio, cantidad: 1 });
          }

          actualizarCarrito();
          mostrarNotificacionCarrito();
        }, 500);
      });
    });
  }

  // ---------------------------------------------
  // FUNCIONES DEL CARRITO
  // ---------------------------------------------
  function actualizarCarrito() {
    const carritoItems = document.getElementById("carrito-items");
    carritoItems.innerHTML = "";

    if (carrito.length === 0) {
      carritoItems.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío por ahora.</p>`;
      document.getElementById("carrito-total-precio").textContent = "$0";

      ocultarNotificacionCarrito();
      return;
    }

    // Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    let total = 0;

    carrito.forEach((producto, index) => {
      total += producto.precio * producto.cantidad;

      // Formateamos el precio: 29000 → "29.000"
      const precioFormateado = producto.precio.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      carritoItems.innerHTML += `
    <div class="carrito-item">
      <div class="carrito-info">
        <span>${producto.nombre}</span>
        <span class="carrito-precio">$${precioFormateado}</span>
      </div>

      <div class="cantidad">
        <button class="btn-cant" onclick="cambiarCantidad(${index}, -1)">-</button>
        <span>${producto.cantidad}</span>
        <button class="btn-cant" onclick="cambiarCantidad(${index}, 1)">+</button>
      </div>
    </div>
  `;
    });

    const totalFormateado = total.toLocaleString("es-AR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    document.getElementById(
      "carrito-total-precio"
    ).textContent = `$${totalFormateado}`;
  }

  window.cambiarCantidad = function (index, cambio) {
    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);

    actualizarCarrito();
  };

  // ---------------------------------------------
  // EVENTOS DEL MODAL
  // ---------------------------------------------
  carritoIcono.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cerrarBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
});
