function obtenerIdUsuarioDesdeToken() {
  const token = localStorage.getItem("jwt");

  if (token) {
    const payloadBase64 = token.split(".")[1]; // El payload es la segunda parte del token
    const payloadDecoded = JSON.parse(atob(payloadBase64));
    const idUsuario = payloadDecoded.id_usuario; //aca puedo sacar cualquier dato del usuario, en este caso saque el id del data.
    console.log("id:", idUsuario);
    return idUsuario;
  } else {
    console.log("No se encontró ningún token en localStorage.");
    return null;
  }
}

const IdUsua = obtenerIdUsuarioDesdeToken();
console.log(IdUsua);
const token = localStorage.getItem("jwt");
obtenerTemasUsuario(IdUsua);

async function obtenerTemasUsuario(IdUsuario) {
  try {
    // Obtención de los datos de las tareas mediante promesa
    const promesaResponse = await fetch(`/back/usuarios/${IdUsuario}/temas`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Agregar el token al encabezado Authorization
        "Content-Type": "application/json",
      },
    });

    // Convertir la respuesta a JSON
    const temas = await promesaResponse.json();
    console.log(temas);

    // Llamar a la función para cargar las tarjetas con las tareas
    cargarTemas(JSON.stringify(temas));
  } catch (error) {
    console.error("Error al obtener los temas del usuario:", error);
  }
}

// Función para cargar las tarjetas con las tareas
function cargarTemas(datos) {
  // Obtener el contenedor de las tarjetas
  const cardContainer = document.querySelector("#cardContainer");
  // Limpiar el contenido anterior
  cardContainer.innerHTML = "";

  // Convertir de string a objeto (array de tareas)
  const temas = JSON.parse(datos);

  // Crear las tarjetas para cada tarea
  temas.forEach((tema) => {
    // Crear el contenedor de la tarjeta
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    // Crear el título de la tarea
    const taskTitle = document.createElement("h3");
    taskTitle.textContent = tema.titulo;

    // Crear el contenedor de la información de la tarea
    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");
    taskInfo.innerHTML = `
            <p><strong>ID:</strong> ${tema.id_tema}</p>
            <p><strong>Descripción:</strong> ${tema.descripcion}</p>
            <p><strong>ID Usuario:</strong> ${tema.id_usuario}</p>
          `;

    // Crear el contenedor de usuarios asignados
    const taskUsers = document.createElement("div");
    taskUsers.classList.add("task-users");
    taskUsers.innerHTML = "<p><strong>Usuarios Asignados:</strong></p>";

    // Crear el botón "Hacer comentarios"
    const hacerComentarioButton = document.createElement("button");
    hacerComentarioButton.textContent = "Hacer comentario";
    hacerComentarioButton.classList.add("btn-hacer-comentario");

    // Agregar evento para redirigir a la página de comentarios
    hacerComentarioButton.addEventListener("click", () => {
      // Redirigir a la página de comentarios con el id de la tarea
      window.location.href = `../Comentario/comentario.html?id_tema=${tema.id_tema}`;
    });

    // Añadir todos los elementos a la tarjeta
    taskCard.appendChild(taskTitle);
    taskCard.appendChild(taskInfo);
    taskCard.appendChild(taskUsers);
    taskCard.appendChild(hacerComentarioButton); // Agregar el botón a la tarjeta

    // Añadir la tarjeta al contenedor principal
    cardContainer.appendChild(taskCard);
  });
}

function verTodosTemas() {
  window.location.href = "../VerTodosTemas/verTodosTemas.html";
}

function logout() {
  localStorage.removeItem("jwt"); //Eliminar token de sesion
  window.location.href = "../index.html";
}
