import { deleteTask, createTask, getAllUsers,getTaskUsingUserID, getTask, updateTask } from "./requests.js";
const listUsers = document.getElementById('users');
const taskTable = document.getElementById('tasks');
const taskForm = document.getElementById('form-task');
const formTitle = document.getElementById('form-title')
const completedCheckbox = document.getElementById('completed');
const submitButton = document.getElementById('insert');
let pressedButtonId;

document.addEventListener('DOMContentLoaded',async ()=>{
    const allUsers = await getAllUsers();
    // console.log(allUsers);

    let template=listUsers.innerHTML;
    for (const user of allUsers) {
        template = template + `
        <option value="${user.id}">${user.fullname}</option>
        `
    }

    listUsers.innerHTML = template;
});

listUsers.addEventListener('change',async ()=>{
    const userTasks = await getTaskUsingUserID(listUsers.value);
    console.log(userTasks)

    let template = "";
    const tableBody = taskTable.children[1];
    for (const task of userTasks){
        let taskCompleted = "No completada"
        if (task.completed) {
            taskCompleted = "Completada"
        }
        template = template + `
        <tr id=tablerow${task.id}>
        <td>${task.id}</td>
        <td>${task.firstname}</td>
        <td>${task.title}</td>
        <td>${taskCompleted}</td>
        <td>
          <button class="btn btn-info btn-sm updateBtn" id="updateBtn${task.id}">
            <span>Update</span> <i class="nf nf-md-pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm deleteBtn" id="deleteBtn${task.id}">
            <span>Delete</span> <i class="nf nf-cod-trash"></i>
          </button>
        </td>
      </tr>        `
    }
    tableBody.innerHTML = template

  addDeleteButtonEvents();
  addUpdateButtonEvents();
  submitButton.innerText= "SAVE";
  formTitle.innerText = "Insert Task";
  submitButton.setAttribute("id","insert");
  taskForm.children[0].children[0].value =`` //TITULO

});


// AGREGAR TASK O UPDATE TASK
taskForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const formData = new FormData(taskForm);
  const completedValue = completedCheckbox.checked ? parseInt(1) : parseInt(0);
  formData.append('completed', completedValue);

  console.log(formData);

  //PARA INSERCION-----------------------------------------------------------------------------------------------------------------
  if (submitButton.id == 'insert'){
    console.log("TAREA INSERTADA");
    try {
      const response = await createTask(formData);
      if (response.success) {
        console.log("JSON ID",response.taskId)
        const taskInfo = await getTask(response.taskId)
        console.log("INFO",formData)
        // Update the DOM with the new task
        const newRow = document.createElement('tr');
        newRow.setAttribute("id",`tablerow${taskInfo.id}`)
        let taskCompleted = "No completada"
          if (taskInfo.completed) {
              taskCompleted = "Completada"
          }
        newRow.innerHTML = `
          <td>${taskInfo.id}</td>
          <td>${taskInfo.firstname}</td>
          <td>${taskInfo.title}</td>
          <td>${taskCompleted}</td>
          <td>
            <button class="btn btn-info btn-sm updateBtn" id="updateBtn${taskInfo.id}">
              <span>Update</span> <i class="nf nf-md-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm deleteBtn" id="deleteBtn${taskInfo.id}">
              <span>Delete</span> <i class="nf nf-cod-trash"></i>
            </button>
          </td>
        `;
        taskTable.children[1].appendChild(newRow);
  
      addUpdateButtonEvents();
      taskForm.children[0].children[0].value =`` //TITULO
      } else {
        console.error('Failed to create task');
      }
    } catch (error) {
      console.error('Error in INSERTING:', error);
    };
  };
  //FIN INSERCION------------------------------------------------------------------------------------------------------------------



  //PARA UPDATE----------------------------------------------------------------------------------------------------------------
  if (submitButton.id == 'update'){
    console.log("TAREA ACTUALIZADA");
    try {
      const response = await updateTask(formData,pressedButtonId)
      if (response.success) {
        const rowToUpdate = document.getElementById(`tablerow${pressedButtonId}`);
        const taskInfo = await getTask(pressedButtonId);
        let taskCompleted = "No completada"
        if (taskInfo.completed) {
            taskCompleted = "Completada"
        };
        rowToUpdate.innerHTML = `
          <td>${pressedButtonId}</td>
          <td>${taskInfo.firstname}</td>
          <td>${taskInfo.title}</td>
          <td>${taskCompleted}</td>
          <td>
            <button class="btn btn-info btn-sm updateBtn" id="updateBtn${taskInfo.id}">
              <span>Update</span> <i class="nf nf-md-pencil"></i>
            </button>
            <button class="btn btn-danger btn-sm deleteBtn" id="deleteBtn${taskInfo.id}">
              <span>Delete</span> <i class="nf nf-cod-trash"></i>
            </button>
          </td>
        `;
        //RESET BUTTON
        formTitle.innerText = "Insert Task";
        submitButton.innerText= "SAVE";
        submitButton.setAttribute("id","insert");
        taskForm.children[0].children[0].value =`` //TITULO

      } else {
        console.error("Response unsuccessful, failed to update task")
      }
    } catch (error) {
      console.error('Error in UPDATING:', error);
    }
  };
  //FIN UPDATE------------------------------------------------------------------------------------------------------------------
  
  addDeleteButtonEvents();  
  addUpdateButtonEvents();
});

function addUpdateButtonEvents() {
  const updateButtons = document.querySelectorAll('.updateBtn');
  updateButtons.forEach(button =>{
  button.addEventListener('click', async (e)=>{
      e.preventDefault()
      const taskId = button.id.replace('updateBtn','');
      const taskInfo = await getTask(taskId);
      let taskCheck;
      pressedButtonId = taskId;
      taskInfo.completed === true ? taskCheck='true' : taskCheck='';
      console.log(taskInfo);
      taskForm.children[0].children[0].value =`${taskInfo.title}` //NOMBRE DE TAREA
      formTitle.innerText = "Modify Task";//TITULO FORMULARIO
      taskForm.children[2].children[0].checked = taskCheck //COMPLETO
      submitButton.innerText= "UPDATE";
      submitButton.setAttribute("id","update");
      window.scrollTo({ top: 0, behavior:'smooth'});
  })
}); 
};

function addDeleteButtonEvents(){
  const deleteButtons = document.querySelectorAll('.deleteBtn');
        deleteButtons.forEach(button =>{
        button.addEventListener('click', async ()=>{
            const taskId = button.id.replace('deleteBtn','');
            console.log(taskId)
            const row = document.getElementById(`tablerow${taskId}`);
            row.remove();
            await deleteTask(taskId);
        });
      });
}