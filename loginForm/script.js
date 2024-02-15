document.getElementById('back_btn').addEventListener('click', function () {
    // Open the registration page in a new window or redirect to it
    // window.location.href = 'index.html';
    // history.go(-1);
    window.location.href = 'http://127.0.0.1:5500/index.html';
    // History.back();  // this method prompts user to fill the required form fields even on going back..
});

// retrieve the login data and display to console

const loginForm = document.getElementById('loginForm');
const textInputName = document.getElementById('name');
const textInputPass = document.getElementById('password');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
  
    const typedName = textInputName.value;
    const typedPass = textInputPass.value;

    

    console.log(`Typed name: ${typedName}, typed pass: ${typedPass}`);
    fetchData(typedName, typedPass);
});

function fetchData(login, pass){
    console.log("Login button clicked, trying to fetch data");

    const loginUserBody = {
        userName: login,
        password: pass
      };

    const resultMessage = document.getElementById('resultMessage');
    let notOk = false;
    const url = "https://localhost:7041/api/Users/Login";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(loginUserBody)
    })  // Grazina Promise objekta
    .then(response => {
        console.log("response status", response);
        if(response.status === 400)
        {
            return response.resultMessage;
        }
        if(response.ok === true)
        {
            notOk = true;
        }
        console.log(response);
        return response.text();
    })  //  Promise objektas sulaukiamas su then
    .then(result =>{
        console.log('%c User Token:', 'color:orange; font-weight: bold;')
        console.log({result});
        if(notOk === true) {
            resultMessage.style.color = '#36454F';

            // create a session storage and create a user there to transfer between pages, later create a local storage to keep users data after he creates something and etc.
            localStorage.setItem("currentUser", result);

            let countdown = 3;
            const countdownInterval = setInterval(function () {
                countdown--;

                // Update the displayed countdown
                resultMessage.innerHTML = `Log In <b>successful!</b> Redirecting in ${countdown}s...`;

                if (countdown <= 0) {
                    clearInterval(countdownInterval); // Clear the interval when countdown reaches 0
                    window.location.href = 'http://127.0.0.1:5500/MainPage/mainPage.html';
                    console.log("Delayed action after successful login");
                }
            }, 1000); // Update every 1000ms (1s)
        }
        else {
            resultMessage.style.color = '#ff0033';
            resultMessage.innerHTML = `<b>${result}</b>`;
        }
    })
    .catch(error =>{
        console.log("My error ==> ", error);
    });
    
};

