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
const token = localStorage.getItem("jwt");
// Función para cargar comentarios dinámicamente
async function obtenerTemas() {
  try {
    // Llamada a la API para obtener los comentarios
    const response = await fetch(`/back/temas`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Convertir la respuesta a JSON
    const temas = await response.json();
    console.log(temas);

    // Llamar a la función que muestra los temas en el DOM
    cargarTemas(temas);
  } catch (error) {
    console.error("Error al obtener los temas:", error);
  }
}

function cargarTemas(temas) {
  const temasList = document.getElementById("temas-list");
  isAdmin = verificarAdminToken();
  // Limpiar el contenedor de tema antes de cargar nuevos
  temasList.innerHTML = "";

  if (temas.length === 0) {
    temasList.innerHTML = "<p>No hay temas.</p>";
    return;
  }

  //elementos dinámicos por tema
  temas.forEach((tema) => {
    // Crear el contenedor de cada comentario
    const temaDiv = document.createElement("div");
    temaDiv.classList.add("tema");
    temaDiv.classList.add("task-card"); // Añadir la clase de estilo para las tarjetas

    // Mostrar el id del tema
    const idUsuarioTema = document.createElement("p");
    idUsuarioTema.textContent = `ID usuario: ${tema.id_usuario}`;

    // Mostrar la descripción del tema
    const descripcionTema = document.createElement("p");
    descripcionTema.textContent = `Descripción: ${tema.descripcion}`;

    // Mostrar el título del comentario
    const tituloTema = document.createElement("p");
    tituloTema.textContent = `Título: ${tema.titulo}`;

    // Mostrar el id de la tarea
    const idTema = document.createElement("p");
    idTema.textContent = `ID Tema: ${tema.id_tema}`;

    // Botón de Editar
    const btnEditar = document.createElement("button");
    btnEditar.classList.add("btn-ver-temas");
    btnEditar.textContent = "Ingresar Comentario";
    btnEditar.onclick = function () {
      window.location.href = `IngresarComentario/IngresarComentario.html?id=${tema.id}`;
    };

    // Botón de Eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn-ver-temas");
    btnEliminar.textContent = "Borrar Comentario";
    btnEliminar.onclick = function () {
      window.location.href = `EliminarComentario/eliminarComentario.html?id=${tema.id}`;
    };
    if (isAdmin) {
      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn-ver-temas");
      btnEliminar.textContent = "Editar Comentario";
      btnEliminar.onclick = function () {
        window.location.href = `EditarComentario/editarComentario.html?id=${tema.id}`;
      };
    }

    // Añadir los botones y los elementos de comentario al div del comentario
    temaDiv.appendChild(idUsuarioTema);
    temaDiv.appendChild(descripcionTema);
    temaDiv.appendChild(tituloTema);
    temaDiv.appendChild(idTema);
    temaDiv.appendChild(btnEditar);
    temaDiv.appendChild(btnEliminar);

    // Añadir el comentario al contenedor principal
    temasList.appendChild(temaDiv);
  });
}
// Llamar a la función para cargar los comentarios
obtenerTemas();
