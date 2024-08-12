// get HTML elements 
let userEl = document.getElementById("user");
let passwEl = document.getElementById("passw");
let npasswEl = document.getElementById("npassw");
let rpasswEl = document.getElementById("rpassw");
let btn_save = document.getElementById("save");
let btn_login = document.getElementById("login");
let div_pasEl = document.getElementById("div_pas");
let div_npasEl = document.getElementById("div_npas");
let div_rpasEl = document.getElementById("div_rpas");

// set focus on username input
window.onload = function () {
  userEl.focus();
};

// initiate array of registered users
let regUsersArr = [];

// read registered users from local storage
let storRegUsr;
regUsersArr = getItemsFromLS(storRegUsr,"regUsers",regUsersArr);

focusOut(userEl,"inp");
focusOut(passwEl,"inp");

// function to validate user inputs 
function validateUser(usr,psw){
  let unamReg = /^[A-Za-z](\w){5,}$/;
  let paswReg =/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm;
  if (!testInput(unamReg, usr)) {
    setClass(userEl, "inp_error");
    toastr.error("Please, enter a correct username!");
    userEl.focus();
    return false;
  };
  if (!testInput(paswReg, psw)) {
    setClass(passwEl, "inp_error");
    toastr.error(
      "Please, enter a correct password! It must have minimum 6 characters and it must contain uppercase, lowercase, digits and special characters!");
    passwEl.focus();
    return false;
  };
  return true;
}

// add event submit action
btn_login.addEventListener("click", (event) => {
  event.preventDefault();
  // read user input data
  let user = userEl.value;
  let passw = passwEl.value;
  let found = false;

  // check if the user data are valid
  if (validateUser(user,passw)){
  
  // check if user name is for a registered user and if the password is correct 
if (regUsersArr){
  for (let elem of regUsersArr) {
    if (elem.usr == user) {
      if (elem.psw == passw) {
        // create a new object loggedUser
        let logedUser = new loggedUser(user, new Date());
        // write loggedUser in local storage
        setItemToLS("loggedUser",logedUser);
        toastr.success("Login successful!");
        found = true;
  
        //add a delay to prevent next page to load so the success message can be seen
        delay(1000).then(() => window.location.href="homepage.html");
  
        // if password incorrect => error message
      } else {
        passwEl.className = "inp_error";
        toastr.error("Password incorrect!");
        passwEl.focus();
        return;
      }
    }
  };
  // if user not found in registered users, load registration page
  if (!found) {
    toastr.error("User not found! Please register!");
    delay(1500).then(() => (window.location.href = "register.html"));
  }
}
else {
  toastr.info("There are no registered users!");
  delay(1500).then(() => (window.location.href = "register.html"));
}
}});

// function displayInfoMesage(message) {
//   toastr.info(message);
// }

// add action for Forgot password

let fpas = document.getElementById("forg_pas");

// function to validate input data to change password
function validData(usr,psw,rpsw){
  let unamReg = /^[A-Za-z](\w){5,}$/;
  let paswReg =/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm;
  if (!testInput(unamReg,usr)){
    toastr.error("Username incorect!");
    setClass(userEl, "inp_error");
    userEl.focus();
    return false;
  }
  if (!testInput(paswReg,psw)){
    toastr.error("Passwords must have at least 6 characters, uppercase, lowercase, digits and special characters!");
    setClass(passwEl, "inp_error");
    passwEl.focus();
    return false;
  }
  if (psw != rpsw){
    toastr.error("Passwords do not match!");
    setClass(passwEl, "inp_error");
    setClass(rpasswEl, "inp_error");
    passwEl.focus();
    return false;
  }
  return true;
};

  focusOut(userEl, "inp");
  focusOut(passwEl, "inp");
  focusOut(rpasswEl, "inp");
  focusOut(npasswEl, "inp");

// add html elements to change password
let elm_added = false;
fpas.addEventListener("click", () =>{
  if(!elm_added){
    div_pasEl.classList.add("hidden");
    btn_login.classList.add("hidden");
    elm_added = true;
    // toastr.info("Se afiseaza ceva, sper!");
    div_npasEl.classList.remove("hidden");
    div_rpasEl.classList.remove("hidden");
    btn_save.classList.remove("hidden");
}});

btn_save.addEventListener("click", (ev)=>{
  ev.preventDefault();
  let npas = npasswEl.value;
  let rpas = rpasswEl.value;
  let usr = userEl.value;
  if(validData(usr,npas,rpas)){
    let regUsersArr = [];
    let storRegUsr = localStorage.getItem('regUsers');
    if (storRegUsr){
       regUsersArr=JSON.parse(storRegUsr);
        let pos = regUsersArr.findIndex((el)=> el.usr == usr);
        if (pos !=-1){
            regUsersArr[pos].psw = npas;
            setItemToLS("regUsers", regUsersArr);
            toastr.info("Password changed!");
            let key = usr + "_shifts";
            storRegUsr = localStorage.getItem(key);
            if (storRegUsr){
              localStorage.removeItem(key);
            }
            delay(1500).then(() => (window.location.href = "login.html"));
          }
          else {
            toastr.error("User not found! Please register!");
            delay(1500).then(() => (window.location.href = "register.html"));
            return;
          }
        }
        else{
          toastr.error("User not found! Please register first!");
          delay(1500).then(() => (window.location.href = "register.html"));
        };
  }
  else{
    return;
  }
});

// reset Add_shift form when pressing Escape 
let form_inp = document.getElementById("input_form");
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape"){
    div_npasEl.classList.add("hidden");
    div_rpasEl.classList.add("hidden");
    btn_save.classList.add("hidden");
    div_pasEl.classList.remove("hidden");
    btn_login.classList.remove("hidden");
    elm_added = false;
    // toastr.info("Se afiseaza ceva, sper!");
    
  }
});



// fpas.addEventListener("click", () =>{
//   let addField=`<div class="input">
//                   <label for="npassw" class="lab">New Password:</label>
//                   <input type="password", id="npassw", class="inp", placeholder="Enter new password!">
//                 </div>
//                 <div class="input">
//                   <label for="rpassw" class="lab">Reenter password:</label>
//                   <input type="password", id="rpassw", class="inp", placeholder="Confirm password!">
//                 </div>
//                 <button type="submit", id="save" class="bttn">Save</button>`;
//   if (!elm_added){
//     userEl.focus();
    
//     setClass(document.getElementById("login"), "hidden");
//     setClass(document.getElementById("lab_pas"), "hidden");
//     setClass(document.getElementById("passw"), "hidden");
//     div_pas.innerHTML += addField;
//     elm_added = true;
//     let sav = document.getElementById("save");
//     // action on click for Forgot password
//     sav.addEventListener("click", () =>{
//     let rpassw = document.getElementById("rpassw").value;
//     let user = userEl.value;
//     let npassw = document.getElementById("npassw").value;
//       if (validData(user,npassw,rpassw)){
//         alert("validare reusita");
//         let regUsersArr = [];
//         let storRegUsr = localStorage.getItem('regUsers');
//         if (storRegUsr){
//           regUsersArr=JSON.parse(storRegUsr);
//           let pos = regUsersArr.findIndex((el)=> el.usr == user);
//           if (pos !=-1){
//             regUsersArr[pos].psw = npassw;
//             setItemToLS("regUsers", regUsersArr);
//             toastr.info("Password changed!");
//             // de sters shifturile userului
//           }
//           else {
//             toastr.error("User not found! Please register first!");
//             return;
//           }
//         }
//         else{
//           toastr.error("User not found! Please register first!");
//           delay(1500).then(() => (window.location.href = "register.html"));
//         };

      
      
      
//     // // setTimeout(displayInfoMesage("Pasword changed!"), 30000);
//     // setTimeout(function(){console.log("Asteptare")}, 5000);
//     // location.reload(); 
//     };
    
//     })
//     }
//   });