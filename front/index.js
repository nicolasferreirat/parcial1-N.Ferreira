document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener valores de usuario y contraseña puestos en el login
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // POST al back
      const response = await fetch("http://localhost/back/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          contraseña: password,
        }),
      });

      errorMessage.style.display = "none";

      // Si la respuesta no es exitosa
      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          // Contraseña incorrecta o usuario no encontrado
          errorMessage.textContent =
            "El email o la contraseña son incorrectos.";
          errorMessage.style.display = "block"; // Mostrar el mensaje de error
        } else {
          throw new Error("Error en la autenticación");
        }
        return;
      }

      const data = await response.json();
      const token = data.token;

      // Almacenar el token en localStorage
      localStorage.setItem("jwt", token);

      function verificarAdminToken() {
        const token = localStorage.getItem("jwt");
        if (token) {
          const payloadBase64 = token.split(".")[1]; // El payload es la segunda parte del token
          const payloadDecoded = JSON.parse(atob(payloadBase64));
          const isAdmin = payloadDecoded.is_admin;
          return isAdmin;
        } else {
          console.log("No se encontró ningún token en localStorage.");
          return null;
        }
      }

      if (verificarAdminToken()) {
        window.location.href = "VerTodosTemas/verTodosTemas.html";
      } else {
        window.location.href = `MenuPrincipal/menuPrincipal.html`;
      }
    } catch (error) {
      // Mostrar cualquier error inesperado
      console.error("Error durante la autenticación:", error);
      errorMessage.textContent =
        "Hubo un problema con la autenticación. Por favor, intenta de nuevo.";
      errorMessage.style.display = "block"; // Mostrar el mensaje de error
    }
  });
});
