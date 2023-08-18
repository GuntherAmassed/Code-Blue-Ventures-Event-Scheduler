const HOURHAND = document.getElementsByClassName("hour");
const MINUTEHAND = document.getElementsByClassName("minute");
const SECONDHAND = document.getElementsByClassName("second");
const clockFrameRow = document.getElementById('row-clock-frame-box');
const LocationFrameRow = document.getElementById('row-location-frame');
const NameOfCity = document.getElementsByClassName("Name-Of-City");
const NameOfCountry = document.getElementsByClassName("Name-Of-Country");
const DayOfWeek = document.getElementsByClassName("Day-Of-Week");

async function ClockStart() {
  let response = await fetch('https://codebluetimes.com/app/ClockAmount', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  let data = await response.json();
  console.log(data);
  LocationFrameRow.innerHTML = data.locationFrame;
  StartClocks(data);
}

function StartClocks(data) {
  let clockFrame = data.clockFrame;
  clockFrameRow.innerHTML = clockFrame;
  let TimeZones = data.TimeZones;
  
  for (let i = 0; i < TimeZones.length; i++) {
    let hr = TimeZones[i].Hour;
    let min = TimeZones[i].Minute;
    let sec = TimeZones[i].Second;
    let Day = TimeZones[i].Day;
    NameOfCity[i].innerHTML = TimeZones[i].PlaceOfCity
    NameOfCountry[i].innerHTML = TimeZones[i].PlaceOfCountry+' - '+TimeZones[i].PlaceOfState;
    DayOfWeek[i].innerHTML = Day;
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




