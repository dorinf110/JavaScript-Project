let fnameEl = document.getElementById("fname");
let lnameEl = document.getElementById("lname");
let emailEl = document.getElementById("email");
let ageEl = document.getElementById("age");
let userEl = document.getElementById("user");
let passwEl = document.getElementById("passw");
let rpasswEl = document.getElementById("rpassw");
let form = document.querySelector("#input_form");

// set focus on firstname input 
window.onload = function () {
  fnameEl.focus();
};

let regUsersArr = [];




// setting foucusout events (revert to normal class) on input elements. It is useful after an error when the element get another class
focusOut(fnameEl,"inp");
focusOut(lnameEl,"inp");
focusOut(emailEl,"inp");
focusOut(ageEl,"inp");
focusOut(userEl,"inp");
focusOut(passwEl,"inp");
focusOut(rpasswEl,"inp");

// validate input data
function validateInputData(fnam, lnam, em, ag, usr, psw, rpsw) {
  
  // define regex to test
  let unamReg = /^[A-Za-z](\w){5,}$/;
  let namReg = /^[A-Z][a-z]{2,20}$/;
  let paswReg =/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm;
  let emailReg =/^[a-z]{1}(\w\.?)+@[a-z]{1}([a-z]|\d)+(\.[a-z]{2,6})+([a-z]{2,3})?$/i;
  let ageReg = /^(1[8-9])|([2-5]\d)|6[1-5]$/;
  
  // read registered users from local storage
  let storRegUsr = localStorage.getItem('regUsers');
  if (storRegUsr){
    regUsersArr=JSON.parse(storRegUsr);
  }  
  
  // validate firstname
  if (!testInput(namReg, fnam)) {
    setClass(fnameEl, "inp_error");
    toastr.error("Please, enter a correct firstname!");
    fnameEl.focus();
    // fnameEl.addEventListener("focusout", (ev)=>{
    //   setClass(fnameEl, "inp");
    // });
    return false;
  }; 
  
  // validate lastname
  if (!testInput(namReg, lnam)) {
    setClass(lnameEl, "inp_error");
    toastr.error("Please, enter a correct lastname!");
    lnameEl.focus();
    return false;
  };

  // validate e-mail
  if (!testInput(emailReg, em)) {
    setClass(emailEl, "inp_error");
    toastr.error("Please, enter a correct e-mail!");
    emailEl.focus();
    return false;
  };

  // validate age
  if (!testInput(ageReg, ag) || ag < 18 || ag > 65) {
    setClass(ageEl, "inp_error");
    toastr.error("Please, enter a correct age!");
    ageEl.focus();
    return false;
  };

  // validate username
  if (!testInput(unamReg, usr)) {
    setClass(userEl, "inp_error");
    toastr.error("Please, enter a correct username!");
    userEl.focus();
    return false;
  };

// validate passwords
  if (!testInput(paswReg, psw)) {
    setClass(passwEl, "inp_error");
    toastr.error(
      "Please, enter a correct password! It must have minimum 6 characters and it must contain uppercase, lowercase, digits and special characters!");
    passwEl.focus();
    return false;
  };

  // check if the entered passwords are the same
  if (psw != rpsw) {
    toastr.error("The passwords are not the same!");
    rpasswEl.focus();
    setClass(passwEl,"inp_error");
    setClass(rpasswEl, "inp_error");
    return false;
  }

  // check if the username is already used 
  for (let el of regUsersArr){
    if (el.usr == usr){setClass(userEl, "inp_error");
    toastr.error("Username already used!");
    userEl.focus();
    return false;
  } else{
    setClass(userEl, "inp");
  }
}

// check if the email is already used
for (let el of regUsersArr){
    if (el.em == em){setClass(emailEl, "inp_error");
    setClass(emailEl, "inp_error");
    toastr.error("Email already used!");
    emailEl.focus();
    return false;
  } else{
    setClass(emailEl, "inp");
  }
}
  return true;
}

// 
form.addEventListener("submit", (event) => {
  event.preventDefault();
  // get input data from user
  let fname = fnameEl.value.toString();
  let lname = lnameEl.value;
  let email = emailEl.value;
  let age = ageEl.value;
  let user = userEl.value;
  let passw = passwEl.value;
  let rpassw = rpasswEl.value;
  // validate input data
  if (validateInputData(fname, lname, email, age, user, passw, rpassw)) {
    // create a new registered user object
    let regUserNew = new regUser(fname, lname, email,age,user,passw);
    // add new registered user object to array 
    regUsersArr.push(regUserNew);
    // save the registered users array to localstorage
    localStorage.setItem("regUsers",JSON.stringify(regUsersArr));
    // success message
    toastr.success("Registration successful!");
    // delay to allow previous message to be seen
    delay(2000).then(() => window.location.href="login.html");
  }
});
