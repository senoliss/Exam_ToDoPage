document.getElementById('back_btn').addEventListener('click', function () {
    // Open the registration page in a new window or redirect to it
    // window.location.href = 'index.html';
    // history.go(-1);
    window.location.href = 'http://127.0.0.1:5500/Exam_ToDoPage/index.html';
    // History.back();  // this method prompts user to fill the required form fields even on going back..
});

// retrieve the login data and display to console

const loginForm = document.getElementById('loginForm');
const textInputName = document.getElementById('name');
const textInputPass = document.getElementById('password');
const displayText = document.getElementById('leleTextas');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
  
    const typedName = textInputName.value;
    const typedPass = textInputPass.value;

    console.log(`Typed name: ${typedName}, typed pass: ${typedPass}`);
    fetchData(typedName, typedPass);
});

function fetchData(name, pass){
    console.log("Login button clicked, trying to fetch data");
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
            window.location.href = 'http://127.0.0.1:5500/Exam_ToDoPage/ToDoPageAfterLogIn/ToDoPage.html';
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