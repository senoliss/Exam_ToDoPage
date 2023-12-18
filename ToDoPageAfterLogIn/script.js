document.addEventListener('DOMContentLoaded', function () {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  document.getElementById('userInfo').innerHTML = `Logged in as: <b>${currentUser.userName}</b>`;

  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const addTaskForm = document.getElementById('addTaskForm');
  const logOutBtn = document.getElementById('logout_btn');
  const taskList = document.getElementById('taskList');

  // Retrieve tasks from localStorage when the page loads
  // NEED TO RETRIEVE THESE TASKS FROM 'TO DOS' TABLE
  const userTasks = JSON.parse(localStorage.getItem(currentUser)) || [];

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
      userId: `${currentUser}`,
      type: taskType,
      content: taskContent,
      endDate: endDate
    };

    // Add the task to the array for the current user
    userTasks.push(taskData);

    // Save the updated userTasks array to localStorage
    // SAVE THE TASK TO DB INTO 'TO DOS' TABLE
    localStorage.setItem(currentUser, JSON.stringify(userTasks));

    // Display the new task
    const taskItem = createTaskElement(taskData);
    taskList.appendChild(taskItem);

    // Reset the form
    addTaskForm.reset();
    taskForm.classList.add('hidden');


  });

    logOutBtn.addEventListener('click', function () {
      window.location.href = 'http://127.0.0.1:5500/index.html';
      sessionStorage.removeItem('currUser');
  });

  function createTaskElement(taskData) {
    const taskItem = document.createElement('li');
    taskItem.textContent = `Type: ${taskData.type}, Content: ${taskData.content}, End Date: ${taskData.endDate}, Created by: ${taskData.createdBy}`;
    return taskItem;
  }
});

function getUserFromDb(){
  const curentUser = sessionStorage.getItem('currUser');
  console.log("Trying to fetch current user from db");
    const resultMessage = document.getElementById('resultMessage');
    let notOk = false;
    const url = "https://localhost:7171/api/Auth" + '?username=' + name + '&password=' + pass;
    fetch(url)  // Grazina Promise objekta
    .then(response => {
        console.log("response status", response);
        if(response.ok === true) {notOk = true;}
        return response.json()
    })  //  Promise objektas sulaukiamas su then
    .then(result =>{
        console.log("result", result);
        if(notOk === true) {
            resultMessage.innerHTML = 'Log In <b>successful!</b> Redirecting in Xs...';
            // create a session storage and create a user there to transfer between pages, later create a local storage to keep users data after he creates something and etc.
            sessionStorage.setItem("currUser", name);
            window.location.href = 'http://127.0.0.1:5500/ToDoPageAfterLogIn/ToDoPage.html';
        }
        else {
            resultMessage.style.color = '#ff0033';
            resultMessage.innerHTML = `<b>${result.error} !</b>`;
        }
    })
    .catch(error =>{
        console.log("My error ==> ", error);
    });
};

getToDosArray = () => {
  const url = "https://localhost:7171/api/ToDo";

  fetch(url, {
      method: 'GET',
      headers: {
          'Content-type': 'application/json'
      }
    })
    .then(response => {
      return response.json()}
      )
    .then(result => {
      console.log('ToDos were fetched successfully');
      for (let i=0; i< result.length; i++){
        console.log(result[i]);
      };
      return result.json();
    })
    .catch(error => console.log(error));
};

filterToDosArrayWithUserIdFromLocalStorage = () => {
  const toDosArray = getToDosArray();
  toDosArray.forEach(element => console.log(element));
};


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
