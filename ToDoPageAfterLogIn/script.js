document.addEventListener('DOMContentLoaded', function () {
  const currentUserToken = localStorage.getItem('currentUser');
  
  // ======================== PARSING JWT TOKEN ON DOM LOAD ================================
 
  const decodedToken = parseJwt(currentUserToken);
  
  console.log(decodedToken);
  
  const name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  
  console.log('Name:', name);
  console.log('Role:', role);
  
  
  // =======================================================================================
  
  // ======================== ASSIGN THE HTML ELEMENTS TO VARIABLES ========================

  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const addTaskForm = document.getElementById('addTaskForm');
  const logOutBtn = document.getElementById('logout_btn');
  const adminBtn = document.getElementById('adminPanel');
  const taskList = document.getElementById('taskList');
  const editTaskBtn = document.getElementById('logout_btn');
  const deleteTaskBtn = document.getElementById('logout_btn');

  const profileForm = document.getElementById('profileForm');
  const profileBtn = document.getElementById('userProfile');
  const residenceForm = document.getElementById('residenceForm');
  const residenceBtn = document.getElementById('userResidence');

  // =======================================================================================

  // =============== CHECCKING IF USER IS ADMIN FOR ADDITIONAL FUNCTIONALITY ===============

  if(role === "Admin")
  {
    document.getElementById('userInfo').innerHTML = `Logged in as: <b>${name}</b> (<span style="color: red; font-weight: bold;">Admin</span>)`;
    adminBtn.classList.toggle('hidden');
    // document.getElementById('userInfo').innerHTML = `Logged in as: <b>${name}</b> <span style="color: red; text-decoration: underline;">Admin</span>`;
  }
  else
  {
    document.getElementById('userInfo').innerHTML = `Logged in as: <b>${name}</b>`;
  }

  // =======================================================================================

  profileBtn.addEventListener('click', function () {
    profileForm.classList.toggle('hidden');
  })

  residenceBtn.addEventListener('click', function () {
    residenceForm.classList.toggle('hidden');
  })

  logOutBtn.addEventListener('click', function () {
      window.location.href = '../index.html';    // relative path is better to use than local
      localStorage.removeItem('currentUser');
  });

  addUserInfoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Collect user info data
    const userInfoData = {
      // Get values from user info form fields
      // Example:
      uName: document.getElementById('uName').value,
      uSurname: document.getElementById('uSurname').value,
      // ... (collect other user info fields)
    };

    // Check if residence form is visible
    if (!residenceForm.classList.contains('hidden')) {
      // Collect residence info data
      const residenceInfoData = {
        // Get values from residence form fields
        // Example:
        residenceTown: document.getElementById('residenceTown').value,
        residenceStreet: document.getElementById('residenceStreet').value,
        // ... (collect other residence info fields)
      };

      // Include residence info data in user info data
      userInfoData.residenceInfo = residenceInfoData;
    }

    // Send userInfoData to the backend (you need to implement this)
    // Example: send a POST request to the user info API endpoint

    // Reset forms and hide residence form
    addUserInfoForm.reset();
    residenceForm.classList.add('hidden');
  });

});   // DOM ENDS HERE

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

function parseJwt (token) {

  var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  
  // this is Node.js, not supported on browsers: return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

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