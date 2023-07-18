const Clocks = document.getElementsByClassName("clock-Frame");
const HOURHAND = document.getElementsByClassName("hour");
const MINUTEHAND = document.getElementsByClassName("minute");
const SECONDHAND = document.getElementsByClassName("second");
const NameOfPlace = document.getElementsByClassName("Name-Of-Place");
const DayOfWeek = document.getElementsByClassName("Day-Of-Week")

const urlClockAmount = 'http://localhost:3000/ClockAmount';
const ClockAmountNumber = {
  Amount: Clocks.length
}
let TimeZones = []
async function ClockAmount(urlClockAmount) {
  let response = await fetch(urlClockAmount, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ClockAmountNumber)
  });
  let data = await response.json();
  TimeZones = data;
  StartClocks();
}
ClockAmount(urlClockAmount);
function StartClocks() {
  for (let i = 0; i < Clocks.length; i++) {
    let hr = TimeZones[i].Hour;
    let min = TimeZones[i].Minute;
    let sec = TimeZones[i].Second;
    let Day = TimeZones[i].Day;
    NameOfPlace[i].innerHTML = TimeZones[i].Place;
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





