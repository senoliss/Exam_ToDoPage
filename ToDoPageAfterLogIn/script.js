document.addEventListener('DOMContentLoaded', function () {
  const curentUser = sessionStorage.getItem('currUser');
  document.getElementById('userInfo').innerHTML = `Logged in as: <b>${curentUser}</b>`;

  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const addTaskForm = document.getElementById('addTaskForm');
  const logOutBtn = document.getElementById('logout_btn');
  const taskList = document.getElementById('taskList');

  // Retrieve tasks from localStorage when the page loads
  // NEED TO RETRIEVE THESE TASKS FROM 'TO DOS' TABLE
  const userTasks = JSON.parse(localStorage.getItem(curentUser)) || [];

  // Display existing tasks
  userTasks.forEach(taskData => {
    const taskItem = createTaskElement(taskData);
    taskList.appendChild(taskItem);
  });

  addTaskBtn.addEventListener('click', function () {
    taskForm.classList.toggle('hidden');
  });

  addTaskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const taskType = document.getElementById('taskType').value;
    const taskContent = document.getElementById('taskContent').value;
    const endDate = document.getElementById('endDate').value;

    // Create a task object
    const taskData = {
      type: taskType,
      content: taskContent,
      endDate: endDate,
      createdBy: `${curentUser}`,
    };

    // Add the task to the array for the current user
    userTasks.push(taskData);

    // Save the updated userTasks array to localStorage
    // SAVE THE TASK TO DB INTO 'TO DOS' TABLE
    localStorage.setItem(curentUser, JSON.stringify(userTasks));

    // Display the new task
    const taskItem = createTaskElement(taskData);
    taskList.appendChild(taskItem);

    // Reset the form
    addTaskForm.reset();
    taskForm.classList.add('hidden');


  });

    logOutBtn.addEventListener('click', function () {
      window.location.href = 'http://127.0.0.1:5500/Exam_ToDoPage/index.html';
      sessionStorage.removeItem('currUser');
  });

  function createTaskElement(taskData) {
    const taskItem = document.createElement('li');
    taskItem.textContent = `Type: ${taskData.type}, Content: ${taskData.content}, End Date: ${taskData.endDate}, Created by: ${taskData.createdBy}`;
    return taskItem;
  }
});



// document.addEventListener('DOMContentLoaded', function () {
//   // You would typically get user information from the backend after login
//   const curentUser = sessionStorage.getItem('currUser');
//   document.getElementById('userInfo').innerHTML = `Logged in as: <b>${curentUser}</b>`;

//   const addTaskBtn = document.getElementById('addTaskBtn');
//   const taskForm = document.getElementById('taskForm');
//   const addTaskForm = document.getElementById('addTaskForm');
//   const logOutBtn = document.getElementById('logout_btn');
//   const taskList = document.getElementById('taskList');

//    // Retrieve tasks from localStorage when the page loads
//    const userTasks = JSON.parse(localStorage.getItem(curentUser)) || [];

//    // Display existing tasks
//     userTasks.forEach(taskData => {
//       const taskItem = createTaskElement(taskData);
//       taskList.appendChild(taskItem);
//   });

//   addTaskBtn.addEventListener('click', function () {
//     taskForm.classList.toggle('hidden');
//   });

//   addTaskForm.addEventListener('submit', function (event) {
//     event.preventDefault();

//     const taskType = document.getElementById('taskType').value;
//     const taskContent = document.getElementById('taskContent').value;
//     const endDate = document.getElementById('endDate').value;

//     // You would typically send this data to the backend for storage in a database
//     const taskData = {
//       type: taskType,
//       content: taskContent,
//       endDate: endDate,
//       createdBy: `${curentUser}`
//     };

//     // Add the task to the array for the current user
//     userTasks.push(taskData);

//     // Save the updated userTasks array to localStorage
//     localStorage.setItem(curentUser, JSON.stringify(userTasks));

//     // Display the new task
//     const taskItem = createTaskElement(taskData);
//     taskList.appendChild(taskItem);

//     // Reset the form
//     addTaskForm.reset();
//     taskForm.classList.add('hidden');
//   });

//   logOutBtn.addEventListener('click', function () {
//     window.location.href = 'http://127.0.0.1:5500/Exam_ToDoPage/index.html';
//     sessionStorage.removeItem('currUser');
//   });

//   function createTaskElement(taskData) {
//     const taskItem = document.createElement('li');
//     taskItem.textContent = `Type: ${taskData.type}, Content: ${taskData.content}, End Date: ${taskData.endDate}, Created by: ${taskData.createdBy}`;
//     return taskItem;
//   }
// });
