function toasterOptions() {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-bottom-left",
    preventDuplicates: true,
    onclick: null,
    showDuration: "3000",
    hideDuration: "1000",
    timeOut: "2000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "show",
    hideMethod: "hide",
  };
}
toasterOptions();
// get HTML elements
let userpar = document.getElementById("user_p");
let timepar = document.getElementById("time");
let btn_logout = document.getElementById("logout");
let btn_addShift = document.getElementById("addShift");
let btn_delShift = document.getElementById("delShift");
let btn_editp = document.getElementById("edit_p");
let shift_form = document.querySelector("#shift_form");
let radioSearchByDate = document.getElementById("byDate");
let fDateEl = document.getElementById("fdate");
let eDateEl = document.getElementById("edate");
let btn_search  = document.getElementById("search");

// check if the user is logged in
let userLogged, storObj;
userLogged = getItemsFromLS(storObj, "loggedUser", userLogged);
if (!userLogged) {
  toastr.warning("User not logged in!");
  delay(1500).then(() => (window.location.href = "login.html"));
} else {
  // check if the user login time is no more than 1 hour ago
  let currDate = new Date();
  let time1 = currDate.getTime();
  let strTime2 = new Date(userLogged.loginTime);
  let time2 = strTime2.getTime();
  if (Math.abs((time1 - time2) / 60000) > 60) {
    toastr.warning("Login expired!");
    delay(1500).then(() => (window.location.href = "login.html"));
  }
}
// display logged user
userpar.innerHTML += ` <span>${userLogged.user}</span>`;

//function to display current date and time
let showDateTime = () => {
  let now = new Date();
  let month, seconds;
  if (now.getMonth() < 10) {
    month = `0${now.getMonth() + 1}`;
  } else {
    month = `${now.getMonth() + 1}`;
  }
  if (now.getMinutes() < 10) {
    minutes = `0${now.getMinutes()}`;
  } else {
    minutes = `${now.getMinutes()}`;
  }
  if (now.getSeconds() < 10) {
    seconds = `0${now.getSeconds()}`;
  } else {
    seconds = now.getSeconds();
  }
  let date_time = `Date: ${now.getDate()}-${month}-${now.getFullYear()} Time: ${now.getHours()}:${minutes}:${seconds}`;
  timepar.innerHTML = date_time;
};
// refresh date and time
setInterval(showDateTime, 1000);

//action logout
btn_logout.addEventListener("click", (ev) => {
  toastr.info("Logout successful!");
  delay(1500).then(() => (window.location.href = "login.html"));
});

function displayErrMesage(message) {
  toastr.error(message);
}

function displayInfoMesage(message) {
  toastr.info(message);
}

// setting foucusout events (revert to normal class) on input elements. It is useful after an error when the element get another class
focusOut(document.querySelector("#date"), "inp");
focusOut(document.querySelector("#sTime"), "inp");
focusOut(document.querySelector("#eTime"), "inp");
focusOut(document.querySelector("#hWage"), "inp");
focusOut(document.querySelector("#slug"), "inp");

// function to validate shift data
function validateShiftData(dat, st, et, hw, sl) {
  let now = new Date();
  if (dat == "") {
    setClass(document.querySelector("#date"), "inp_error");
    toastr.error("Please select the shift date!");
    document.querySelector("#date").focus();
    return false;
  }
  let inputDate = new Date(dat);
  if (inputDate > now) {
    toastr.error("The shift date cannot be in the future!");
    document.querySelector("#date").focus();
  }
  if (st == "") {
    setClass(document.querySelector("#sTime"), "inp_error");
    toastr.error("Please select the start time!");
    document.querySelector("#sTime").focus();
    return false;
  }
  if (et == "") {
    setClass(document.querySelector("#eTime"), "inp_error");
    toastr.error("Please select the end time!");
    document.querySelector("#eTime").focus();
    return false;
  }
  if (hw == "") {
    setClass(document.querySelector("#hWage"), "inp_error");
    toastr.error("Please enter a correct hourly wage!");
    document.querySelector("#hWage").focus();
    return false;
  }
  if (sl == "") {
    setClass(document.querySelector("#slug"), "inp_error");
    toastr.error("Please enter a correct shift ID!");
    document.querySelector("#slug").focus();
    return false;
  }
  return true;
}

// read shifts from local storage
let shiftArr = [];
let key = userLogged.user + "_shifts";
let stor = localStorage.getItem(key);

// function to add row with shift data to table
function addRow(date, stime, etime, hwag, place, id, profit) {
  let newRow = `<tr class="row"><td>${date}</td><td>${stime}</td><td>${etime}</td><td>${hwag}</td><td>${place}</td><td>${id}</td><td>${profit}</td></tr>`;
  return newRow;
}

// if there is shift data in local storage display the shifts table  
if (stor) {
  shiftArr = JSON.parse(stor);
  //   show table head
  document.getElementById("div_table").style.visibility = "visible";

    var monYearStrArr = [];
  //add table row for every shift found in localstorage
  for (let el of shiftArr) {
    document.querySelector("#tbody").innerHTML += addRow(
      el.addDate,
      el.startTime,
      el.endTime,
      el.hourlyWage,
      el.place,
      el.shiftId,
      el.profit
    );
    // create an array with years-months that have shift data
    monYearStrArr.push(monYearStr(el.addDate));
  }
  //   calculate most profitable month
  // calculate profit for every month
  // eliminate duplicates from years-months array
  let monYearStrSet = new Set(monYearStrArr);
  monYearStrArr = [...monYearStrSet];
  let monYeaStrMap = new Map();
  for (let el of monYearStrArr) {
    let sum = 0;
    for (let elem of shiftArr)
      if (monYearStr(elem.addDate) == el) {
        sum += +elem.profit;
      }
    monYeaStrMap.set(el, sum);
  }
  
  let mostProfMonth = "";
  const max = Math.max(...monYeaStrMap.values());
  for (const [key, value] of monYeaStrMap){
    if (value == max){
      mostProfMonth = key;
      break;
    }
   
  };
  document.getElementById("profitable").style.visibility="visible";
  document.getElementById("profitable").innerHTML=`<p>The most profitable month is: <span>${mostProfMonth}</span></p>`;
  }



// function to add days to a date (for the shifts that are started in the last day of the month and are ending on next day )
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

//assign shiftid to shift form
window.addEventListener("load", (ev) => {
  ev.preventDefault();
  let slug = createId(shiftArr);
  document.querySelector("#slug").value = slug;
});

// action add shift
btn_addShift.addEventListener("click", (ev) => {
  ev.preventDefault();
  
  // read shift input data
  let date = document.getElementById("date").value;
  let stime = document.getElementById("sTime").value;
  let etime = document.getElementById("eTime").value;
  let hWage = document.getElementById("hWage").value;
  let shiftId = document.querySelector("#slug").value;
  let place = document.getElementById("place").value;
  let comment = document.querySelector("#comment").value;
  let profit = 0;

  if (validateShiftData(date, stime, etime, hWage, place, shiftId)) {
    let d1 = new Date(`${date} ${etime}`);
    let t1 = d1.getTime();
    let d2 = new Date(`${date} ${stime}`);
    let t2 = d2.getTime();
    // modify date for end time if workperiod is over midnight
    if (t1 < t2) {
      d1 = addDays(d1, 1);
    }
    // recalculate time for modified date
    t1 = d1.getTime();
    let workDuration = (t1 - t2) / 3600000; // in hours
    profit = (+workDuration * +hWage).toFixed(2);
    let newShift = new Shift(
      date,
      stime,
      etime,
      hWage,
      place,
      shiftId,
      profit,
      comment
    );
    let idx = shiftArr.findIndex((el)=> el.shiftId == shiftId);
    if (idx == -1){
    shiftArr.push(newShift)}
    else{
      shiftArr.splice(idx,1,newShift);
    }
    btn_delShift.classList.add("hidden");
    setTimeout(displayInfoMesage("Adding shift data!"), 3000);
    setItemToLS(key, shiftArr);
    document.getElementById("cont_prog").classList.remove("hidden");
    let innerEl = document.querySelector(".inner");
    let perc = document.getElementById("perc");
    innerEl.style.transformOrigin="bottom left";
    let counter = 0;
    setInterval(()=>{
      if(counter == 360){
        clearInterval();
      }
      else{
        counter+=1;
        perc.innerText=`${Math.trunc(counter/3.6)}%`;
        innerEl.style.transform = `rotate(${counter}deg)`;}
    }, 8);
    shift_form.reset();
    delay(3000).then(()=>location.reload());
  } else {
    setTimeout(displayErrMesage("Invalid shift data!"), 3000);
  }
});

btn_delShift.addEventListener("click", ()=>{
  let shiftIdDel = document.querySelector("#slug").value;
  let idx = shiftArr.findIndex((el)=> el.shiftId == shiftIdDel);
  if (idx == -1){  return }
  else{
    shiftArr.splice(idx,1);
    setItemToLS(key, shiftArr);
    location.reload;
  }

});

// edit shift data when click on shifts table rows
const table = document.getElementById("table");
const rows = table.querySelectorAll(".row");
Array.from(rows).forEach((row) => {
  row.addEventListener("click", () => {
    const cells = row.getElementsByTagName("td");
    btn_addShift.innerHTML = "Update";
    btn_delShift.classList.remove("hidden");
    document.getElementById("date").value = cells[0].innerHTML;
    document.getElementById("sTime").value = cells[1].innerHTML;
    document.getElementById("eTime").value = cells[2].innerHTML;
    hWage = document.getElementById("hWage").value = cells[3].innerHTML;
    shiftId = document.querySelector("#slug").value = cells[5].innerHTML;
    place = document.getElementById("place").value = cells[4].innerHTML;
    let pos = shiftArr.findIndex((el) => el.shiftId == shiftId);
    document.querySelector("#comment").value = shiftArr[pos].comment;
  });
});

btn_search.addEventListener("click", ()=>{
  document.getElementById("div_shifts").classList.add("hidden");
  if(edit_pressed){edit_pressed=false};
  document.getElementById("div_profile").classList.add("hidden");
  document.getElementById("div_search").classList.remove("hidden");
});

// edit profile action
let edit_pressed = false;
btn_editp.addEventListener("click", ()=>{
    if (!edit_pressed) {
      document.getElementById("div_shifts").classList.add("hidden");
      document.getElementById("div_search").classList.add("hidden");
      document.getElementById("div_profile").classList.remove("hidden");
    // read registered users from local storage
    let regUsersArr = [];
    let storRegUsr = localStorage.getItem("regUsers");
    if (storRegUsr) {
      regUsersArr = JSON.parse(storRegUsr);
    }
    let readfName, readlName, readEmail, readAg, readUser, readPassw;
    // retrieve daa from localstorage for logged user
    for (let elem of regUsersArr) {
      if (elem.usr == userLogged.user) {
        readfName = elem.fnam;
        readlName = elem.lnam;
        readUser = elem.usr;
        readEmail = elem.em;
        readAg = elem.ag;
        readPassw = elem.psw;
      }
    }

    document.querySelector("#fname").value = readfName;
    document.querySelector("#lname").value = readlName;
    document.querySelector("#email").value = readEmail;
    document.querySelector("#age").value = readAg;
    document.getElementById("user").value = readUser;
    document.querySelector("#passw").value = readPassw;
    document.querySelector("#rpassw").value = readPassw;
    // set visible form edit profile to main section in HTML
    
    edit_pressed = true;
  }
});

// action save profile
document.getElementById("profile_form").addEventListener("submit", (ev) => {
  ev.preventDefault();

//    read profile modified data
  let fnameEl = document.getElementById("fname");
  let lnameEl = document.getElementById("lname");
  let emailEl = document.getElementById("email");
  let ageEl = document.getElementById("age");
  let userEl = document.getElementById("user");
  let passwEl = document.getElementById("passw");
  let rpasswEl = document.getElementById("rpassw");

focusOut(fnameEl, "inp");
focusOut(lnameEl, "inp");
focusOut(emailEl, "inp");
focusOut(ageEl, "inp");
focusOut(userEl, "inp");
focusOut(passwEl, "inp");
focusOut(rpasswEl, "inp");

  let fname = fnameEl.value;
  let lname = lnameEl.value;
  let email = emailEl.value;
  let age = ageEl.value;
  let user = userEl.value;
  let passw = passwEl.value;
  let rpassw = rpasswEl.value;



// validate profile read data
  function validateInputData(fnam, lnam, em, ag, psw, rpsw) {
    //     // define regex to test
    let namReg = /^[A-Z][a-z]{2,20}$/;
    let paswReg =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){6,15}$/gm;
    let emailReg =
      /^[a-z]{1}(\w\.?)+@[a-z]{1}([a-z]|\d)+(\.[a-z]{2,6})+([a-z]{2,3})?$/i;
    let ageReg = /^(1[8-9])|([2-5]\d)|6[1-5]$/;

    //     // read registered users from local storage
    let storRegUsr = localStorage.getItem("regUsers");
    if (storRegUsr) {
      regUsersArr = JSON.parse(storRegUsr);
    }

    //     // validate firstname
    if (!testInput(namReg, fnam)) {
      setClass(fnameEl, "inp_error");
      toastr.error("Please, enter a correct firstname!");
      fnameEl.focus();
      return false;
    }

    //     // validate lastname
    if (!testInput(namReg, lnam)) {
      setClass(lnameEl, "inp_error");
      toastr.error("Please, enter a correct lastname!");
      lnameEl.focus();
      return false;
    }

    //     // validate e-mail
    if (!testInput(emailReg, em)) {
      setClass(emailEl, "inp_error");
      toastr.error("Please, enter a correct e-mail!");
      emailEl.focus();
      return false;
    }

    //     // validate age
    if (!testInput(ageReg, ag) || ag < 18 || ag > 65) {
      setClass(ageEl, "inp_error");
      toastr.error("Please, enter a correct age!");
      ageEl.focus();
      return false;
    }

    // // validate passwords
    if (!testInput(paswReg, psw)) {
      setClass(passwEl, "inp_error");
      toastr.error(
        "Please, enter a correct password! It must have minimum 6 characters and it must contain uppercase, lowercase, digits and special characters!"
      );
      passwEl.focus();
      return false;
    }

    //     // check if the entered passwords are the same
    if (psw != rpsw) {
      toastr.error("The passwords are not the same!");
      rpasswEl.focus();
      setClass(passwEl, "inp_error");
      setClass(rpasswEl, "inp_error");
      return false;
    }

    //   // check if the email is already used
    for (let el of regUsersArr) {
      if (el.em == em && el.usr != userLogged.user) {
        setClass(emailEl, "inp_error");
        toastr.error("Email already used!");
        emailEl.focus();
        return false;
      } else {
        setClass(emailEl, "inp");
      }
    }
    return true;
  }

// validate input data for profile editing
  if (validateInputData(fname, lname, email, age, passw, rpassw)) {
    document.querySelector("#div_profile").classList.add("hidden");
    edit_pressed = false;
    let pos;
    for (let el of regUsersArr) {
      if (el.usr == userLogged.user) {
        pos = regUsersArr.indexOf(el);
        break;
      }}
      if (pos != -1){
      user = userLogged.user;
      // create new regUser object
      let modUser = new regUser(
        fname,
        lname,
        email,
        age,
        userLogged.user,
        passw
      );
      regUsersArr.splice(pos, 1, modUser);
      localStorage.setItem("regUsers", JSON.stringify(regUsersArr));
      }
  } else {
    return;
  }
  document.getElementById("div_shifts").classList.remove("hidden");
});

document.getElementById("cancel_profile").addEventListener("click", (ev)=>{
  ev.preventDefault();
  document.getElementById("profile_form").reset();
  document.getElementById("div_profile").classList.add("hidden");
  edit_pressed =false;
  document.getElementById("div_shifts").classList.remove("hidden");
});

focusOut(fDateEl,"inp_s");
focusOut(eDateEl,"inp_s");


//validate input dates for search  
function validDates(sDat, eDat){
  if (sDat==""){
    fDateEl.focus();
    toastr.error("Please select a start date to search!");
    return false;
  }
  if (eDat==""){
    eDateEl.focus();
    toastr.error("Please select an end date to search!");
    return false;
  }
  let sData = new Date(sDat);
  let eData = new Date(eDat);
  if(eData.getTime() < sData.getTime()){
    toastr.error("End date must be after the start date!")
    return false;
  }
  return true;
}

// display search shift form when click on search button
btn_search.addEventListener("click", ()=>{
  document.getElementById("div_search").classList.remove("hidden");
});


// function to update shifts table with search result
function updShTabl(shArr){
  if (shArr !=""){
    document.querySelector("#tbody").innerHTML="";
     for (let el of shArr) {
          document.querySelector("#tbody").innerHTML += addRow(
            el.addDate,
            el.startTime,
            el.endTime,
            el.hourlyWage,
            el.place,
            el.shiftId,
            el.profit
          );
          document.getElementById("profitable").style.visibility="hidden";
        }
        document.getElementById("search_form").reset();
  }
  else{
    toastr.info("No shift data meet your criteria!")
    document.getElementById("search_form").reset();
    document.querySelector("#tbody").innerHTML="";
    document.getElementById("profitable").style.visibility="hidden";
  };

}

// add action on click search button in search shift form 
document.getElementById("search_shift").addEventListener("click", (ev)=>{
  ev.preventDefault();
  if(radioSearchByDate.checked){
    let fDate = fDateEl.value;
    let eDate = eDateEl.value;
    if (validDates(fDate, eDate)){
      let fDateTime = new Date(fDate).getTime();
      let eDateTime = new Date(eDate).getTime();
      let srcShiftArr = shiftArr.filter((el)=>{
        let addDate = new Date(el.addDate);
        let addDateTime = addDate.getTime();
        if((addDateTime >= fDateTime) && (addDateTime <= eDateTime)){
          return true;
        }
        else return false;
        });
        updShTabl(srcShiftArr);
      
    }}
    else{
      // ShiftId search checked
      let shId = document.getElementById("shiftId").value;
      if (shId == ""){
        toastr.error("Please enter a shift Id to search!");
        document.getElementById("shiftId").focus();
        return;
      }
      else{
        let srcShiftArr = shiftArr.filter((el)=>{
          if (el.shiftId == shId){
            return true;
          }
          else{
            return false;
          }
        });
        updShTabl(srcShiftArr);
      }
    }
  });

  document.getElementById("cancel_search").addEventListener("click", (ev) =>{
    ev.preventDefault();
    document.getElementById("div_search").classList.add("hidden");
    document.getElementById("profitable").style.visibility="visible";
    location.reload();
  });
