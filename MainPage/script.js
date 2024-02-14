

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

  const logOutBtn = document.getElementById('logout_btn');
  const adminBtn = document.getElementById('adminPanel');

  // div for add info and add residence buttons
  const profileInfoButtons = document.getElementById('profileInfoButtons');
  // button to make above div visible
  const profileBtn = document.getElementById('userProfile');
  
  // user info form
  const userInfoForm = document.getElementById('addUserInfoForm');
  // button to make above form visible
  const userInfoBtn = document.getElementById('userInfoBtn');

  // user residence form
  const residenceForm = document.getElementById('residenceForm');
  // button to make above form visible
  const userResidenceBtn = document.getElementById('userResidenceBtn');

  // info message in user info section
  const userInfoMessage = document.getElementById('userProfileMessage');

  // button to load all the users in Admin Panel
  const adminUsersBtn = document.getElementById('adminUsersPanel');

  let userHasInfo = false;
  let userHasRes = false;
  



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

  // ================================= ALL THE NAV BUTTONS =================================
  // displays the buttons for user info and user residence
  profileBtn.addEventListener('click', function () {
    profileInfoButtons.classList.toggle('hidden');
  })

  // displays the user info form div
  userInfoBtn.addEventListener('click', function () {
    profileInfoDiv.classList.toggle('hidden');
    getUserInfoFromDB(currentUserToken).then((userInfo) => {
      console.log(userInfo);
  
      if (userInfo != null) {
        userHasInfo = true;
        // Additional logic if needed
      } else {
        userHasInfo = false;
        // Additional logic if needed
      }
    });
  })

  // displays the user residence form div
  userResidenceBtn.addEventListener('click', function () {
    profileResidenceDiv.classList.toggle('hidden');
    getUserResFromDB(currentUserToken).then((userRes) => {
      console.log(userRes);
  
      if (userRes != null) {
        userHasInfo = true;
        // Additional logic if needed
      } else {
        userHasInfo = false;
        // Additional logic if needed
      }
    });
  });

  adminBtn.addEventListener('click', function () {
    adminPanelDiv.classList.toggle('hidden');
  });


  logOutBtn.addEventListener('click', function () {
      window.location.href = '../index.html';    // relative path is better to use than local
      localStorage.removeItem('currentUser');
  });

  // =======================================================================================


  // ============= ADMIN STUFF - FETCHING ALL USERS AND DISPLAYING DYNAMICALLY =============
  // using 'async function' and 'await' before get all users because fetch is a promise object and is kinda like lazy loading

  adminUsersBtn.addEventListener('click', async function () {
    const usersList = await getAllUsersFromDB(currentUserToken);
    populateAdminPanel(usersList);


    const userHeaders = document.querySelectorAll('.user-header');

    userHeaders.forEach(header => {
      header.addEventListener('click', function () {
         const userItem = this.closest('.user-item');
         userItem.classList.toggle('open');
      });
    });


    const userDeleteButtons = document.querySelectorAll('.user-delete-button');

    userDeleteButtons.forEach(button => {
      button.addEventListener('click', async function() {
  
        const userIdToDelete = parseInt(this.id.split('-')[3]);
  
        console.log('Deleting user with ID:', userIdToDelete);

        // Assuming you have an API call to delete the user from the database
      await deleteUserFromDB(userIdToDelete, currentUserToken);

      // Remove the user item from the UI
      const userItem = this.closest('.user-item');
      userItem.remove();
  
      });
    });

  });



  // =======================================================================================


  // ====================== SUBMIT BUTTON FOR FIRST FORM - USER INFO =======================
  addUserInfoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    
    // Create a FormData object to handle file upload
    const formDataInfo = new FormData(addUserInfoForm);

    // Collect user info data
    const userInfoData = {
      // Get values from user info form fields
      // Example:
      name: formDataInfo.get('uName'),
      surname: formDataInfo.get('uSurname'),
      personalID: formDataInfo.get('uID'),
      phoneNumber: formDataInfo.get('uPhone'),
      email: formDataInfo.get('uMail'),
      // ... (collect other user info fields)
    };

    // Append the profile picture data to userInfoData
    // const userImageData = {
    //   Image: formData.get('uPicture')
    // }

    // const imageFile = formData.get('uPicture');
    const imageFile = new FormData();
    imageFile.append("Image", formDataInfo.get('uPicture'));

    // Check if residence form is visible
    // if (!residenceForm.classList.contains('hidden')) {
    //   // Collect residence info data
    //   const residenceInfoData = {
    //     // Get values from residence form fields
    //     // Example:
    //     residenceTown: document.getElementById('residenceTown').value,
    //     residenceStreet: document.getElementById('residenceStreet').value,
    //     // ... (collect other residence info fields)
    //   };

    //   // Include residence info data in user info data
    //   userInfoData.residenceInfo = residenceInfoData;
    // }

    // Send userInfoData to the backend (you need to implement this)
    // Example: send a POST request to the user info API endpoint
    console.log(userInfoData);
    console.log(imageFile);
    console.log(userInfoData);

    if(!userHasInfo) {
      // NEED TO SOMEHOW FIGURE OUT SEPARATE IMAGE AND USER INFO SAVING
      saveUserInfoToDB(userInfoData, currentUserToken);
      // saveImageToDB(imageFile, currentUserToken);
    }
    else if(userHasInfo){
      // NEED TO SOMEHOW FIGURE OUT SEPARATE IMAGE AND USER INFO SAVING
      // need to get user info in json and update it in DB
      updateUserInfoToDB(userInfoData, currentUserToken);
      // saveImageToDB(imageFile, currentUserToken);
    }
    // Reset forms and hide residence form
    // addUserInfoForm.reset();
    // residenceForm.classList.add('hidden');
  });
  // =======================================================================================

  // =================== SUBMIT BUTTON FOR FIRST FORM - USER RESIDENCE =====================
  addUserresidenceForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const formDataRes = new FormData(addUserresidenceForm);

    // Collect User Residence data
    const userResData = {
      town: formDataRes.get('urTown'),
      street: formDataRes.get('urStreet'),
      buildingNumber: formDataRes.get('urBuildingNr'),
      flatNumber: formDataRes.get('urFlatNr')
    };

    console.log(userResData);

    if(!userHasInfo) {
      // User has firstly to define personal information before residence
      document.getElementById('userProfileMessage2').innerHTML = 'CANNOT UPDATE USER RESIDENCE IF USER INFORMATION IS NOT FILLED IN!';
    }
    else if(userHasInfo){
      if(!userHasRes){
        // Creates new residence info for user
        saveUserResToDB(userResData, currentUserToken);
      }
      else{
        // Updates existing residence info for user
        updateUserResToDB(userResData, currentUserToken);
      }
    }
  });
// =======================================================================================


});   // DOM ENDS HERE


// ================================ JWT PARSING FUNCTION =================================
function parseJwt (token) {

  var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  
  // this is Node.js, not supported on browsers: return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};
// =======================================================================================

// ============================= USER INFORMATION FUNCTIONS ==============================
function saveUserInfoToDB(userInfoJS, JWTtoken){
  const url = "https://localhost:7041/api/UserAccountInfo/CreateUserInfo";

  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWTtoken}`
    },
    body: JSON.stringify(userInfoJS)
})
.then(response => {
    console.log(response);
    return response.text()}
    )
.then(result => {
    console.log('User Information was uploaded successfully');
    console.log(result);
})
.catch(error => console.log(error));

};

function getUserInfoFromDB(JWTtoken){
  const url = "https://localhost:7041/api/UserAccountInfo/GetUserInfo";

  return fetch(url, {
      method: 'GET',
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${JWTtoken}`
      }
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('userProfileMessage').innerHTML = 'User information <b>loaded</b>!';
        
        return response.json();
      } else if (response.status === 400) {
        // Handle specific 400 Bad Request error
        return response.text().then(errorMessage => {
          console.error(`Bad Request: ${errorMessage}`);
          // error message in user info form
          document.getElementById('userProfileMessage').innerHTML = errorMessage;
          throw new Error(`Bad Request: ${errorMessage}`);
        });
      } else {
        // Handle other errors
        console.error('Failed to fetch user information!');
        document.getElementById('userProfileMessage').innerHTML = '<b>Failed</b> to fetch user information!';
        throw new Error('Failed to fetch user information!');
      }
    })
    .then(result => {
      console.log(result);
      if(result != null)
      {
        document.getElementById('uName').value = result.name;
        document.getElementById('uSurname').value = result.surname;
        document.getElementById('uID').value = result.personalID;
        document.getElementById('uPhone').value = result.phoneNumber;
        document.getElementById('uMail').value = result.email;
        // if (uNameElement) {
            //     uNameElement.value = result.name;
            // }
      }
      else{
        console.log('Result is empty');
      }
      return result;
    })
    .catch(error => {
      console.log(error);
      return [];  // returns an empty array instead of result array in case of an error
    });
};

function updateUserInfoToDB(userInfoJS, JWTtoken){
  const url = "https://localhost:7041/api/UserAccountInfo/UpdateUserInfo";
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${JWTtoken}`
    },
    body: JSON.stringify(userInfoJS),
  })
    .then((response) => {
      if(response.status === 204){
        console.log('User Info was updated, but nothing is returned from backend!');
        document.getElementById('userProfileMessage').innerHTML = 'User Info was <b>updated</b>!';
        return null; // Nothing to return on 204
      }
      else if(response.ok){
        console.log('User Info was updated!')
        return response.json(); // If the response is 200Ok it might also have some json to return
      }
      else{
        console.error('Failed to update User Info!');
        document.getElementById('userProfileMessage').innerHTML = '<b>Failed</b> to update User Info!!';
        throw new Error('Failed to update User Info!');
      }
    })
    .then((result) => {
      console.log('User Info was updated successfuly');
      console.log(result);
    })
    .catch((error) => console.error(error));
};
// =======================================================================================

// ================================== IMAGE FUNCTIONS ====================================
function saveImageToDB(imageFile, JWTtoken) {
  const url = "https://localhost:7041/api/Image/uploadImage";
  
  // const formData = new FormData();
  // formData.append("Image", imageFile);
  console.log(imageFile);

  fetch(url, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${JWTtoken}`
          },
          body: imageFile
      })
      .then(response => {
          console.log(response);
          return response.text()}
          )
      .then(result => {
          console.log('Image was uploaded successfully');
          console.log(result);
      })
      .catch(error => console.log(error));
};
// =======================================================================================

// ============================= USER RESIDENCE FUNCTIONS ================================
function saveUserResToDB(userResJS, JWTtoken){
  const url = "https://localhost:7041/api/UserAccountInfo/CreateUserResidence";

  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWTtoken}`
    },
    body: JSON.stringify(userResJS)
})
.then(response => {
    console.log(response);
    return response.text()}
    )
.then(result => {
    console.log('User Residence was uploaded successfully');
    console.log(result);
})
.catch(error => console.log(error));

};

function getUserResFromDB(JWTtoken){
  const url = "https://localhost:7041/api/UserAccountInfo/GetUserResidence";

  return fetch(url, {
      method: 'GET',
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${JWTtoken}`
      }
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('userProfileMessage2').innerHTML = 'User Residence <b>loaded</b>!';
        
        return response.json();
      }
      else if (response.status === 404) {
        // Handle specific 404 Not Found error
        return response.text().then(errorMessage => {
          console.error(`Not Found 404: ${errorMessage}`);
          // error message in user info form
          document.getElementById('userProfileMessage2').innerHTML = errorMessage;
          throw new Error(`Not Found 404: ${errorMessage}`);
        });
      }
      else if (response.status === 400) {
        // Handle specific 400 Bad Request error
        return response.text().then(errorMessage => {
          console.error(`Bad Request: ${errorMessage}`);
          // error message in user info form
          document.getElementById('userProfileMessage2').innerHTML = errorMessage;
          throw new Error(`Bad Request: ${errorMessage}`);
        });
      } 
      else {
        // Handle other errors
        console.error('Failed to fetch User Residence!');
        document.getElementById('userProfileMessage2').innerHTML = '<b>Failed</b> to fetch User Residence!';
        throw new Error('Failed to fetch User Residence!');
      }
    })
    .then(result => {
      console.log(result);
      if(result != null)
      {
        document.getElementById('urTown').value = result.town;
        document.getElementById('urStreet').value = result.street;
        document.getElementById('urBuildingNr').value = result.buildingNumber;
        document.getElementById('urFlatNr').value = result.flatNumber;
      }
      else{
        console.log('Result is empty');
      }
      return result;
    })
    .catch(error => {
      console.log(error);
    });
};

function updateUserResToDB(userResJS, JWTtoken){
  const url = "https://localhost:7041/api/UserAccountInfo/UpdateUserResidence";
  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${JWTtoken}`
    },
    body: JSON.stringify(userResJS),
  })
    .then((response) => {
      if(response.status === 204){
        console.log('User Residence was updated, but nothing is returned from backend!');
        document.getElementById('userProfileMessage2').innerHTML = 'User Residence was <b>updated</b>!';
        return null; // Nothing to return on 204
      }
      else if(response.ok){
        console.log('User Residence was updated!')
        return response.json(); // If the response is 200Ok it might also have some json to return
      }
      else{
        console.error('Failed to update User Residence!');
        document.getElementById('userProfileMessage2').innerHTML = '<b>Failed</b> to update User Residence!!';
        throw new Error('Failed to update User Residence!');
      }
    })
    .then((result) => {
      console.log('User Residence was updated successfuly');
      console.log(result);
    })
    .catch((error) => console.error(error));
};
// =======================================================================================

// ================================= ADMIN FUNCTIONS =====================================
function getAllUsersFromDB(JWTtoken){
  const url = "https://localhost:7041/api/Users/GetAllUsers";

  return fetch(url, {
      method: 'GET',
      headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${JWTtoken}`
      }
    })
    .then(response => {
      if (response.ok) {
        document.getElementById('adminUsersPanelMsg').innerHTML = 'Users information <b>loaded</b>!';
        
        return response.json();
      } 
      else if (response.status === 400) {
        // Handle specific 400 Bad Request error
        return response.text().then(errorMessage => {
          console.error(`Bad Request: ${errorMessage}`);
          // error message in user info form
          document.getElementById('adminUsersPanelMsg').innerHTML = errorMessage;
          throw new Error(`Bad Request: ${errorMessage}`);
        });
      } 
      else {
        // Handle other errors
        console.error('Failed to fetch users information!');
        document.getElementById('adminUsersPanelMsg').innerHTML = '<b>Failed</b> to fetch users information!';
        throw new Error('Failed to fetch users information!');
      }
    })
    .then(result => {
      console.log(result);
      if(result != null)
      {
        
      }
      else{
        console.log('Result is empty');
      }
      return result;
    })
    .catch(error => {
      console.log(error);
    });
};

function populateAdminPanel(users) {
  // const userDropdownsContainer = document.getElementById('userDropdowns');
  // const userInfoPanelsContainer = document.getElementById('userInfoPanels');

  // // Clear existing content
  // userDropdownsContainer.innerHTML = '';
  // userInfoPanelsContainer.innerHTML = '';
  // // adminPanelDiv.innerHTML = '';

  // // Create dropdowns for each user
  // users.forEach(user => {
  //     const userDropdown = createUserDropdown(user);
  //     const userInfoPanel = createUserInfoPanel(user);
  //     // adminPanelDiv.appendChild(userDropdown);

  //     userDropdown.addEventListener('click', () => {
  //       // Toggle visibility for the user panel when dropdown is clicked
  //       userInfoPanel.classList.toggle('hidden');
  //     })

  //     userDropdownsContainer.appendChild(userDropdown);
  //     userInfoPanelsContainer.appendChild(userInfoPanel);

  // });

  const usersUL = document.getElementById('user-list');

  // Create dropdowns for each user
  users.forEach(user => {
    const userItem = document.createElement('li');
    userItem.classList.add('user-item');
    
    const userHeadersDiv = createUserDropdown(user);
    const userContentDiv = createUserInfoPanel(user);
      
      userItem.appendChild(userHeadersDiv);
      userItem.appendChild(userContentDiv);

      usersUL.appendChild(userItem);
  });
};

function createUserDropdown(user) {
  // const dropdownItem = document.createElement('div');
  // dropdownItem.classList.add('user-dropdown');

  // const userHeader = document.createElement('div');
  // if(user.userInfo != null)
  // {
  //   userHeader.innerHTML = `<b>${user.userName}</b> - ${user.userInfo.name} ${user.userInfo.surname}`;
  // }
  // else
  // {
  //   userHeader.innerHTML = `<b>${user.userName}</b> - no information yet`;
  // }
  // dropdownItem.appendChild(userHeader);

  // // Add a click event listener to show detailed user information
  // // dropdownItem.addEventListener('click', function () {
  // //     // Call a function to display detailed user information (you need to implement this)
  // //     createUserInfoPanel(user);
  // // });

  // return dropdownItem;

  const dropdownItem = document.createElement('div');
  dropdownItem.classList.add('user-header');

  if(user.userInfo != null)
  {
    dropdownItem.innerHTML = `<b>${user.userName}</b> - ${user.userInfo.name} ${user.userInfo.surname}`;
  }
  else
  {
    dropdownItem.innerHTML = `<b>${user.userName}</b> - no information yet`;
  }

  return dropdownItem;
};

function createUserInfoPanel(user) {
  const userContentDiv = document.createElement('div');
  userContentDiv.classList.add('user-content');
  
  // Populate user info in the panel
  const userContentDivInner = document.createElement('div');
  userContentDivInner.classList.add('user-content-inner');

  const userIdElement = document.createElement('p');
  userIdElement.textContent = `User ID: ${user.userId}`;
  userContentDivInner.appendChild(userIdElement);
  
  const emailElement = document.createElement('p');
  emailElement.textContent = `Email: ${user.email}`;
  userContentDivInner.appendChild(emailElement);
  
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML = 'Delete';
  deleteButton.classList.add('user-delete-button');
  deleteButton.id = 'user-delete-button-' + user.userId;
  userContentDivInner.appendChild(deleteButton);
  
  console.log('Display detailed user info:', user);
  userContentDiv.appendChild(userContentDivInner);
  return userContentDiv;
};

function deleteUserFromDB(userID, JWTtoken) {
  const url = `https://localhost:7041/api/Users/Delete/${userID}`;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${JWTtoken}`
  }
  })
  .then(response => {
    if(response.ok)
    {
      console.log(response);
      return response.json()
    }
    else if (response.status === 400) {
      // Handle specific 400 Bad Request error
      return response.text().then(errorMessage => {
        console.error(`Bad Request: ${errorMessage}`);
        // error message in user info form
        document.getElementById('adminUsersPanelMsg').innerHTML = errorMessage;
        throw new Error(`Bad Request: ${errorMessage}`);
      });
    } 
    else 
    {
      // Handle other errors
      console.error('Failed to fetch users information!');
      document.getElementById('adminUsersPanelMsg').innerHTML = '<b>Failed</b> to fetch users information!';
      throw new Error('Failed to fetch users information!');
    }
  })
  .then(result => {
    console.log('User was deleted successfully');
    console.log(result);
  })
  .catch(error => console.log(error));
};
// =======================================================================================