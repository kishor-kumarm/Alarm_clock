////////////////////////////////////////JS Logics are here////////////////////////////////////////////////
const setHours = document.querySelector('#setHours');
const setMinutes = document.querySelector('#setMinutes');
const setSeconds = document.querySelector('#setSeconds');
const setSession = document.querySelector('#setSession');

const setAlarmButton = document.querySelector("#setAlarm");
const alarmList = document.querySelector("#alarmList");
// const alarmTone = new Audio("/assets/Alarm-Clock.mp3");

//Displaying the current time --live
function displayCurrentTime() {
    let dateTime = new Date();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();
    let session = document.getElementById('session');
    //changing the session(before noon/after noon) according to the hours logic if it passed 12 than PM else AM.
    if(hours>=12){
        session.innerHTML = 'PM';
        if(hours>12){
            hours -= 12;
        }
    } else {
        session.innerHTML = 'AM';
    }
    //getting and setting the hours/minutes/seconds/session corresponding to there element id.
    document.getElementById('hours').innerHTML = hours<10 ? '0'+hours : hours;
    document.getElementById('minutes').innerHTML = minutes<10 ? '0'+minutes : minutes;
    document.getElementById('seconds').innerHTML = seconds<10 ? '0'+seconds : seconds;
}
// set interval to update the display time
setInterval(displayCurrentTime,1000); 
// This funtion will set the input form alarm time initially as dropdown
function selectTimeOption(minValue, maxValue, element){
    for (let val=minValue; val<=maxValue;val++) {
        const selectTime = document.createElement('option');
        selectTime.value = val<10 ? '0'+val : val;
        selectTime.innerHTML = val<10 ? '0'+val : val;
        element.appendChild(selectTime);
    }
}
// added eventListener to set the intial data in the dom content 
// like alarm input field data and also fetch the saved date from the local storage and display to the UI
document.addEventListener("DOMContentLoaded",()=>{
    selectTimeOption(0,12,setHours);
    selectTimeOption(0,59,setMinutes);
    selectTimeOption(0,59,setSeconds);
    const alarms = existingAlarams();
    alarms.forEach((time) => {
        setAlarm(time, true);
    });
});

// Event Listener added to Set Alarm Button
setAlarmButton.addEventListener("click", getAlarm);
// this funtion will get the input from the UI as used sets and trigger the setAlarm funtion to save it.
function getAlarm(event){
    event.preventDefault();
    const hrValue= setHours.value;
    const minValue = setMinutes.value;
    const secValue = setSeconds.value;
    const sessionValue = setSession.value;
    const time = `${parseInt(hrValue)}:${minValue}:${secValue} ${sessionValue}`;
    setAlarm(time);
}
// This function will set the Alarm triggering saveAlarm funtion 
// and also keeps tracking the alarm to trigger the alert at interval of second.
function setAlarm(time, fetching = false) {
    const alarm = setInterval(() => {
      if (time === fetchCurrentTime()) {
        // alarmTone.play();
        alert("Hi There! Alarm is Ringing");
      }
    }, 1000);
  
    addAlaramToTheList(time, alarm);
    if (!fetching) {
      saveAlarm(time);
    }
}
// To fetch the current system time on 12 hr format.
function fetchCurrentTime() {
    let currentTime = new Date();
    currentTime = currentTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    return currentTime;
}
// this will update the dom by updating the new Alarm to the List.
function addAlaramToTheList(time, alarmId) {
    const newAlarm = document.createElement("div");
    newAlarm.classList.add("alarm");
    newAlarm.innerHTML = `<div class="alarm-time">${time}</div>
    <button class="delete-alarm-button" data-id=${alarmId}>Delete</button>`;
    const deleteAlarmButton = newAlarm.querySelector(".delete-alarm-button");
    deleteAlarmButton.addEventListener("click", (event) => {
        deleteAlarm(event, time, alarmId);
    });
    alarmList.prepend(newAlarm);
}
  
// save alarm to the local storage
function saveAlarm(time) {
    const alarms = existingAlarams();
    alarms.push(time);
    localStorage.setItem("AlarmClockApp_Alarms", JSON.stringify(alarms));
}
// To fetch all the saved alarms list from the local storage. 
function existingAlarams() {
    let alarms = [];
    const isPresent = localStorage.getItem("AlarmClockApp_Alarms");
    if (isPresent) alarms = JSON.parse(isPresent);
    return alarms;
}
// Delete feature- once delete alarm button clicked this function will triggered 
// and deletes the particular alarm date from session and from the local storage save.
function deleteAlarm(event, time, alarmId) {
    const self = event.target;
    clearInterval(alarmId);
    const alarm = self.parentElement;
    const existingAlaramList = existingAlarams();
    const index = existingAlaramList.indexOf(time);
    existingAlaramList.splice(index, 1);
    localStorage.setItem("AlarmClockApp_Alarms", JSON.stringify(existingAlaramList));
    alarm.remove();
}

