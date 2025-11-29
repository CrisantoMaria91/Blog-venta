// ---------------------------------------------
// SWIPER (solo si existe en esta página)
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".slider-wrapper")) {
    new Swiper(".slider-wrapper", {
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
  // MODAL DEL CARRITO
  // ---------------------------------------------
  const modal = document.getElementById("modal-carrito");
  const carritoIcono = document.querySelector(".carrito-icono");
  const cerrarModal = document.querySelector(".cerrar-modal");
  const cerrarBtn = document.querySelector(".cerrar-btn");

  carritoIcono.addEventListener("click", () => (modal.style.display = "flex"));
  cerrarModal.addEventListener("click", () => (modal.style.display = "none"));
  cerrarBtn.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  function mostrarNotificacionCarrito() {
    const notif = document.getElementById("carrito-notificacion");
    notif.style.display = "block";
  }

  function ocultarNotificacionCarrito() {
    const notif = document.getElementById("carrito-notificacion");
    notif.style.display = "none";
  }

  // ---------------------------------------------
  // CARRITO (localStorage)
  // ---------------------------------------------
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  actualizarCarrito();

  if (carrito.length > 0) mostrarNotificacionCarrito();

  const botonesAgregar = document.querySelectorAll(".add-to-cart");

  if (botonesAgregar.length > 0) {
    botonesAgregar.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.add("boton-cargando");
        btn.textContent = "";

        setTimeout(() => {
          btn.classList.remove("boton-cargando");
          btn.textContent = "AGREGAR AL CARRITO";

          const card = btn.closest(".card-item");
          const nombre = card.querySelector(".produc").textContent;

          const precioTexto = card.querySelector(".price").textContent;
          const precio = parseInt(
            precioTexto.replace("$", "").replace(/\./g, "")
          );

          const existe = carrito.find((item) => item.nombre === nombre);

          if (existe) existe.cantidad++;
          else carrito.push({ nombre, precio, cantidad: 1 });

          actualizarCarrito();
          mostrarNotificacionCarrito();
        }, 500);
      });
    });
  }

  // ---------------------------------------------
  // Actualizar carrito
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

    localStorage.setItem("carrito", JSON.stringify(carrito));

    let total = 0;

    carrito.forEach((producto, index) => {
      total += producto.precio * producto.cantidad;

      const precioFormateado = producto.precio.toLocaleString("es-AR");

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

    const totalFormateado = total.toLocaleString("es-AR");
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
  // VALIDACIÓN FORMULARIO CONTACTO
  // ---------------------------------------------
  const form = document.querySelector(".formulario-contacto form");

  if (form) {
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let valido = true;

      document.querySelectorAll(".error-text").forEach((small) => {
        small.textContent = "";
        small.classList.remove("error-mensaje");
      });

      // Validación campos vacíos
      if (nombre.value.trim() === "") {
        nombre.nextElementSibling.textContent = "El nombre es obligatorio";
        nombre.nextElementSibling.classList.add("error-mensaje");
        valido = false;
      }

      if (email.value.trim() === "") {
        email.nextElementSibling.textContent = "El email es obligatorio";
        email.nextElementSibling.classList.add("error-mensaje");
        valido = false;
      }

      if (mensaje.value.trim() === "") {
        mensaje.nextElementSibling.textContent =
          "El mensaje no puede estar vacío";
        mensaje.nextElementSibling.classList.add("error-mensaje");
        valido = false;
      }

      // Validación solo letras
      const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
      if (nombre.value.trim() !== "" && !soloLetras.test(nombre.value.trim())) {
        nombre.nextElementSibling.textContent =
          "El nombre solo puede contener letras";
        nombre.nextElementSibling.classList.add("error-mensaje");
        valido = false;
      }

      // Validación email debe contener @
      if (email.value.trim() !== "" && !email.value.includes("@")) {
        email.nextElementSibling.textContent =
          "El email debe contener '@' (formato inválido)";
        email.nextElementSibling.classList.add("error-mensaje");
        valido = false;
      }

      if (valido) {
        alert("Envío exitoso");
        form.reset();
      }
    });

    // -----------------------------
    // VALIDACIONES EN VIVO
    // -----------------------------

    // Quitar error cuando escribe algo
    function activarValidacionEnVivo(idCampo) {
      const campo = document.getElementById(idCampo);
      const error = campo.nextElementSibling;

      campo.addEventListener("input", () => {
        if (campo.value.trim() !== "") {
          error.textContent = "";
          error.classList.remove("error-mensaje");
        }
      });
    }

    activarValidacionEnVivo("nombre");
    activarValidacionEnVivo("email");
    activarValidacionEnVivo("mensaje");

    // Validación en vivo del nombre solo letras
    nombre.addEventListener("input", () => {
      if (soloLetras.test(nombre.value.trim())) {
        nombre.nextElementSibling.textContent = "";
        nombre.nextElementSibling.classList.remove("error-mensaje");
      }
    });

    // Validación en vivo del email (agregar @)
    email.addEventListener("input", () => {
      if (email.value.includes("@")) {
        email.nextElementSibling.textContent = "";
        email.nextElementSibling.classList.remove("error-mensaje");
      }
    });
  }
});
