document.addEventListener('DOMContentLoaded', function () {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  document.getElementById('userInfo').innerHTML = `Logged in as: <b>${currentUser.userName}</b>`;

  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const addTaskForm = document.getElementById('addTaskForm');
  const logOutBtn = document.getElementById('logout_btn');
  const taskList = document.getElementById('taskList');
  const editTaskBtn = document.getElementById('logout_btn');
  const deleteTaskBtn = document.getElementById('logout_btn');

  // NEED TO RETRIEVE THESE TASKS FROM 'TO DOS' TABLE
    
  getToDosArray().then(tasks => {
    console.log('All tasks:', tasks);
    // trying to filter all tasks from API with userid from local storage
    const userTasks = tasks.filter(task => task.userId === currentUser.id);
    console.log('User tasks:', userTasks);

    // sort the tasks by endDate for test and later try to implement visuals on tasks which are due sooner
    userTasks.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

    // display existing tasks
    userTasks.forEach(taskData => {
      const taskItem = createTaskElement(taskData);
      taskList.appendChild(taskItem);
    });
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
      userId: currentUser.id,
      type: taskType,
      content: taskContent,
      endDate: endDate
    };

    // SAVE THE TASK TO DB INTO 'TO DOS' TABLE
    saveTaskToDB(taskData);

    // Display the new task
    const taskItem = createTaskElement(taskData);
    taskList.appendChild(taskItem);

    addTaskForm.reset();
    taskForm.classList.add('hidden');
    // relaod window to fix the bugs of delete restriction
    location.reload();
  });

  logOutBtn.addEventListener('click', function () {
      window.location.href = '../index.html';    // relative path is better to use than local
      localStorage.removeItem('currentUser');
  });

  function createTaskElement(taskData) {
    const taskItem = document.createElement('li');
    const taskInfo = document.createElement('div');
    taskInfo.textContent = `Type: ${taskData.type}, Content: ${taskData.content}, End Date: ${taskData.endDate}`;
    taskItem.appendChild(taskInfo);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => editTask(taskData));
    taskItem.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', () => deleteTask(taskData));
    taskItem.appendChild(deleteButton);

    return taskItem;
  }
});
function saveTaskToDB(taskData) {
  const url = "https://localhost:7171/api/ToDo";
  fetch(url, {
          method: 'POST',
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify(taskData)
      })
      .then(response => {
          return response.json()}
          )
      .then(result => {
          console.log('Post was created successfully');
      })
      .catch(error => console.log(error));
};


function editTask(taskData) {
  const editForm = document.getElementById('editTaskForm');

  editForm.elements.type.value = taskData.type;
  editForm.elements.content.value = taskData.content;
  editForm.elements.endDate.value = taskData.endDate;   // update date

  editForm.classList.remove('hidden');

  editForm.addEventListener('submit', function (event) {
    event.preventDefault();

    taskData.type = editForm.elements.type.value;
    taskData.content = editForm.elements.content.value;
    taskData.endDate = editForm.elements.endDate.value;

    updateTaskInDb(taskData);

    // Hide the edit form
    editForm.classList.add('hidden');
    location.reload();
  });
}

function deleteTask(taskData) {
  const confirmation = window.confirm('Are you sure you want to delete this task?');
  if (confirmation) {
    // Send a DELETE request to remove the task from the database
    deleteTaskFromDb(taskData);

    // Remove the task item from the UI
    removeTaskFromUI(taskData);
  }
}

function updateTaskInDb(taskData) {
  const url = `https://localhost:7171/api/ToDo/${taskData.id}`;
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log('Task was updated successfuly');
    })
    .catch((error) => console.error(error));
}

function deleteTaskFromDb(taskData) {
  const url = `https://localhost:7171/api/ToDo/${taskData.id}`;
  fetch(url, {
    method: 'DELETE',
  })
    .then((response) => {
      if (response.ok) {
        console.log('Task was deleted successfuly');
        location.reload();
      } else {
        console.error(`Failed to delete task. Status: ${response.status}`);
      }
    })
    .catch((error) => console.error(error));
}


// not finished
// function getUserFromDb(){
//   const curentUser = sessionStorage.getItem('currUser');
//   console.log("Trying to fetch current user from db");
//     const resultMessage = document.getElementById('resultMessage');
//     let notOk = false;
//     const url = "https://localhost:7171/api/Auth" + '?username=' + name + '&password=' + pass;
//     fetch(url)  // Grazina Promise objekta
//     .then(response => {
//         console.log("response status", response);
//         if(response.ok === true) {notOk = true;}
//         return response.json()
//     })  //  Promise objektas sulaukiamas su then
//     .then(result =>{
//         console.log("result", result);
//         if(notOk === true) {
//             resultMessage.innerHTML = 'Log In <b>successful!</b> Redirecting in Xs...';
//             // create a session storage and create a user there to transfer between pages, later create a local storage to keep users data after he creates something and etc.
//             sessionStorage.setItem("currUser", name);
//             window.location.href = 'http://127.0.0.1:5500/ToDoPageAfterLogIn/ToDoPage.html';
//         }
//         else {
//             resultMessage.style.color = '#ff0033';
//             resultMessage.innerHTML = `<b>${result.error} !</b>`;
//         }
//     })
//     .catch(error =>{
//         console.log("My error ==> ", error);
//     });
// };

getToDosArray = () => {
  const url = "https://localhost:7171/api/ToDo";

  return fetch(url, {
      method: 'GET',
      headers: {
          'Content-type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(result => {
      console.log('ToDos were fetched successfully');
      // for (let i = 0; i < result.length; i++) {
      //   console.log(result[i]);
      // }
      return result;
    })
    .catch(error => {
      console.log(error);
      return [];  // returns an empty array instead of result array in case of an error
    });
};

// kidna not used
filterToDosArrayWithUserIdFromLocalStorage = () => {
  getToDosArray()
    .then(toDosArray => {
      toDosArray.forEach(element => console.log(element));
      // Now you can filter or sort the 'toDosArray' as needed
    })
    .catch(error => console.error(error));  // Add error handling here
};