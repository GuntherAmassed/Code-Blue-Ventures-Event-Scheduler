
const HOURHAND = document.getElementsByClassName("hour");
const MINUTEHAND = document.getElementsByClassName("minute");
const SECONDHAND = document.getElementsByClassName("second");
const clockFrameRow = document.getElementById('row-clock-frame-box');
const LocationFrameRow = document.getElementById('row-location-frame');
const NameOfCity = document.getElementsByClassName("Name-Of-City");
const DayOfWeek = document.getElementsByClassName("Day-Of-Week");
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


async function ClockStart() {
  let response = await fetch('https://codebluetimes.com/app/ClockAmount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  let data = await response.json();
  LocationFrameRow.innerHTML += data.locationFrame;
  StartClocks(data);
}

function StartClocks(data) {
  let clockFrame = data.clockFrame;
  clockFrameRow.innerHTML = clockFrame;
  let TimeZones = data.TimeZones;
  const digitalClock = document.querySelectorAll('.digital-clock');
  const timedif = document.querySelectorAll('.Time-dif');
  const dayoflocal = document.querySelectorAll('.Day-Of-Local');

  for (let i = 0; i < TimeZones.length; i++) {
    let currentTime = new Date().toLocaleString('en-US', { timeZone: TimeZones[i].timeZone })
    let hr = new Date(currentTime).getHours();
    let min = new Date(currentTime).getMinutes();
    let sec = new Date(currentTime).getSeconds();
    let Day = weekday[new Date(currentTime).getDay()]
    let fullcityName = ''
    for (let k = 0; k < TimeZones[i].PlaceOfCity.split(',').length; k++) {
      if (k === 0 || k === TimeZones[i].PlaceOfCity.split(',').length - 1) {
        fullcityName += TimeZones[i].PlaceOfCity.split(',')[k]
      }
    }
    NameOfCity[i].innerHTML = fullcityName
    console.log(DayOfWeek[i]);
    DayOfWeek[i].innerText = Day+', ';
    dayoflocal[i].innerHTML = 'Today, '
    setClockDigital(digitalClock[i], currentTime, timedif[i])
    let hrPosition = (hr * 360) / 12 + (min * (360 / 60)) / 12;
    let minPosition = (min * 360) / 60 + (sec * (360 / 60)) / 60;
    let secPosition = (sec * 360) / 60;
    let runClock = () => {
      hrPosition = hrPosition + 3 / 360;
      minPosition = minPosition + 6 / 60;
      secPosition = secPosition + 6;
      HOURHAND[i].style.transform = "rotate(" + hrPosition + "deg)";
      MINUTEHAND[i].style.transform = "rotate(" + minPosition + "deg)";
      SECONDHAND[i].style.transform = "rotate(" + secPosition + "deg)";
    };
    setInterval(runClock, 1000);
  }
}

function setClockDigital(clockOfUser, currentTime, timedif) {
  let FullTime;
  let SecondOfUser = new Date(currentTime).getSeconds();
  let MinuteOfUser = new Date(currentTime).getMinutes();
  let HourOfUser = new Date(currentTime).getHours();
  let realHour;
  let finalHour;

  console.log(currentTime);
  let RunClockOfUser = () => {
    SecondOfUser++;
    if (SecondOfUser === 60) {
      SecondOfUser = 0;
      MinuteOfUser++;
      if (MinuteOfUser === 60) {
        MinuteOfUser = 0;
        HourOfUser++;
      }
    }
    let finalMinute = MinuteOfUser <= 9 ? '0' + MinuteOfUser : MinuteOfUser;
    if (HourOfUser >= 12) {
      finalHour = HourOfUser;
      if (HourOfUser >= 13) {
        finalHour -= 12;
      }
      FullTime = `${finalHour}:${finalMinute} PM`;
    }
    else {
      realHour = HourOfUser;
      if (HourOfUser === 0) {
        realHour = 12;
      }
      FullTime = `${realHour}:${finalMinute} AM`;
    }
    clockOfUser.innerHTML = FullTime;
    console.log();
    let hoursoflocal = new Date().getHours();
    if (hoursoflocal >= 13) {
      hoursoflocal -= 12;
    }
    let hourcurrentofuser;
    if (realHour) {
      hourcurrentofuser = realHour
    }
    if (finalHour) {
      hourcurrentofuser = finalHour
    }
    timedif.innerHTML = (hourcurrentofuser - hoursoflocal) >= 0 ? `+${(hourcurrentofuser - hoursoflocal)}` : `${(hourcurrentofuser - hoursoflocal)}`
  }
  RunClockOfUser();
  setInterval(RunClockOfUser, 1000)
}



