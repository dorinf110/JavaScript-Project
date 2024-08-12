// File for all used functions and objects 

// set Toaster options for warning messages
function toasterOptions() {
    toastr.options = {
      closeButton: true,
      debug: false,
      newestOnTop: true,
      progressBar: true,
      positionClass: "toast-top-right",
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

//set an element class function
function setClass(elem, clas) {
  elem.className = clas;
}

// define object class registered user
class regUser {
    constructor(fnam, lnam, em, ag, usr, psw) {
      this.fnam = fnam;
      this.lnam = lnam;
      this.em = em;
      this.ag = ag;
      this.usr = usr;
      this.psw = psw;
    }
  }  

  // define object logged user
class loggedUser {
    constructor(user, loginTime) {
      this.user = user;
      this.loginTime = loginTime;
    }
  }

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  // function to read data from local storage
  function getItemsFromLS(storObj,key, objArr){
    storObj = localStorage.getItem(key);
    if (storObj) {
      objArr=JSON.parse(storObj);
      return objArr;
    }
  }

  // function to set data to Local storage
function setItemToLS(key, obj){
    localStorage.setItem(key, JSON.stringify(obj));
  }


// create new shift ID
   function createId(shAr){
    let id;
    let foundId = false;
    do {id = Math.random().toString(36).substring(2,13);
      // check if the new created id is already used
      for (let item of shAr){
      if (item.shiftId == id){
        foundId = true;
        break;
      }
      }
    } while (foundId);
  // add newly created id to ids array and store ids array to localstorage
  return id;
 }

// define Shift object
   class Shift{
    constructor (addDate, startTime, endTime, hourlyWage, place, shiftId, profit, comment){
      this.addDate = addDate;
      this.startTime = startTime;
      this.endTime = endTime;
      this.hourlyWage = hourlyWage;
      this.place = place;
      this.shiftId = shiftId;
      this.profit = profit;
      this.comment = comment;
    }
  } 

//function to test against regEx
  function testInput(exp, elem) {
    if (exp.test(elem)) {
      return true;
    }
    return false;
  }

//change HTML element class for focusout event   
  function focusOut(elem,clas){
    elem.addEventListener("focusout", (ev)=>{
      setClass(elem, clas);
    });
  }
  
  // function to extract month-year string from shifts array
  function monYearStr(shift_date){
    let actDate = new Date(shift_date);
    let actYear = actDate.getFullYear();
    let actMonth = actDate.toLocaleString("default", {month: 'long'});
    return `${actMonth}-${actYear}`;
  } 
  
