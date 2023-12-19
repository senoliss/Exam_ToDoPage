document.getElementById('back_btn').addEventListener('click', function () {
    // Open the registration page in a new window or redirect to it
    // window.location.href = 'Exam_ToDoPage/index.html';
    // history.go(-1); // or History. back();
    window.location.href = 'http://127.0.0.1:5500/index.html';
  });


// retrieve the register data and display to console for testing

const registerForm = document.getElementById('registerForm');
const textInputName = document.getElementById('name');
const textInputPass = document.getElementById('password');
const textInputMail = document.getElementById('email');

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
  
    const typedName = textInputName.value;
    const typedPass = textInputPass.value;
    const typedMail = textInputMail.value;

    console.log(`Typed name: ${typedName}, typed pass: ${typedPass}, typed email: ${typedMail}`);
    postData(typedName, typedPass, typedMail);
});

function postData(name, pass, email){
  console.log("Register button clicked, trying to post data");
  const resultMessage = document.getElementById('resultMessage');
  let notOk = false;
  const url = "https://localhost:7171/api/Auth/";

  const newUserBody = {
    "userName": name,
    "password": pass,
    "email": email
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUserBody)
  })  // Grazina Promise objekta
  .then(response => {
      console.log("response status", response);
      if(response.ok === true) {notOk = true;}
      return response;
  })  //  Promise objektas sulaukiamas su then
  .then(result =>{
      console.log("result", result);
      if(notOk === true) {
          resultMessage.style.color = 'black';
          resultMessage.innerHTML = `Register of user: ${name} is <b>successful!</b> Redirecting in few moments...`;
          // create a session storage and create a user there to transfer between pages, later create a local storage to keep users data after he creates something and etc.
        //   loginUserAndSaveDataToLocalStorage(newUserBody);
          window.location.href = 'http://127.0.0.1:5500/loginForm/loginForm.html';
      }
      else {
        resultMessage.style.color = '#ff0033';
        if(result.error === undefined)
        {
            resultMessage.innerHTML = `<b>User already exists !</b>`;
        }
        resultMessage.innerHTML = `<b>${result.error} !</b>`;
      }
  })
  .catch(error =>{
      console.log("My error ==> ", error);
  });
    
};

loginUserAndSaveDataToLocalStorage = (obj) => {
    let notOk = false;
    const url = "https://localhost:7171/api/Auth" + '?username=' + obj.userName + '&password=' + obj.password;
    fetch(url)  // Grazina Promise objekta
    .then(response => {
        console.log("response status", response);
        if(response.ok === true) {notOk = true;}
        return response.json()
    })  //  Promise objektas sulaukiamas su then
    .then(result =>{
        console.log("result", result);
        if(notOk === true) {
            // create a session storage and create a user there to transfer between pages, later create a local storage to keep users data after he creates something and etc.
            localStorage.setItem("curentUser", JSON.stringify(result));
            window.location.href = '../loginForm/loginForm.html';
        }
        else {
            resultMessage.style.color = '#ff0033';
            if(result.error === undefined)
            {
                resultMessage.innerHTML = `<b>User already exists !</b>`;
            }
            resultMessage.innerHTML = `<b>${result.error} !</b>`;
        }
    })
    .catch(error =>{
        console.log("My error ==> ", error);
    });
}