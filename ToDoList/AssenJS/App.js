// Elementos HTML
const userSelect = document.getElementById('select-users');
const userContainer = document.getElementById('user-container');
const taskContainer = document.getElementById('task-container');

// Variables para almacenar los datos de usuarios y tareas
let usersData = [];
let tasksData = [];

// Funciones
/**
 * Obtiene una lista de todos los usuarios que pueden existir
 * @returns {Promise<User[]>}
 */
async function getAllUsers() {
  const response = await fetch('http://127.0.0.7:5500/ToDolist/Data/Usuarios.json');
  usersData = await response.json();
}

/**
 * Obtiene una lista de todas las tareas que hay de todos los usuarios
 * @returns {Promise<Task[]>}
 */
async function getAllTasks() {
  const response = await fetch('http://127.0.0.7:5500/ToDoList/Data/Tareas.json');
  tasksData = await response.json();
}

/**
 * @typedef User Definición de un usuario
 * @property {number} id Identificador único del usuario
 * @property {string} firstname Primer nombre del usuario
 * @property {string} lastname Apellido del usuario
 * @property {string} email Correo electrónico del usuario
 */

/**
 * @typedef Task Definición de una tarea de usuario
 * @property {number} id Identificador único de la tarea
 * @property {number} userId Identificador del usuario a quien corresponde la tarea
 * @property {string} title Título de la tarea
 * @property {boolean} completed Estado de la tarea si está completada o no
 */

// Carga los usuarios y las tareas al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
  await getAllUsers();
  await getAllTasks();
  populateUserSelect();
  updateUserInformation(userSelect.value);
});

// Llena el select de usuarios con los datos obtenidos
function populateUserSelect() {
  userSelect.innerHTML = '';
  usersData.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = `${user.firstname} ${user.lastname}`;
    userSelect.appendChild(option);
  });
}

// Actualiza la información del usuario seleccionado
function updateUserInformation(userId) {
  const selectedUser = usersData.find(user => user.id == userId);

  // Actualizar información del usuario seleccionado
  userContainer.innerHTML = `
    <h3>Información del usuario seleccionado</h3>
    <ul>
      <li>Nombre completo: ${selectedUser.firstname} ${selectedUser.lastname}</li>
      <li>Email: ${selectedUser.email}</li>
    </ul>
  `;

  // Obtener tareas del usuario seleccionado y mostrarlas
  const userTasks = tasksData.filter(task => task.userId == userId);
  renderTasks(userTasks);
}

// Al cambiar de usuario, actualizar la información
userSelect.addEventListener('change', () => {
  updateUserInformation(userSelect.value);
});

/**
 * Renderiza la lista de tareas en el contenedor de tareas
 * @param {Task[]} tasks Lista de tareas a renderizar
 */
function renderTasks(tasks) {
  taskContainer.innerHTML = `
    <h3>Lista de tareas del usuario</h3>
    <ul>
      ${tasks.map(task => `
        <li>
          <span>${task.title}</span>
          <input type="checkbox" ${task.completed ? 'checked' : ''}>
        </li>
      `).join('')}
    </ul>
  `;
}
