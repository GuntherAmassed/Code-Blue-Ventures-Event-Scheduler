// const {format,zonedTimeToUtc,}= require("date-fns-tz")
// const today = new Date();
// const timeZone= 'Europe/Paris';
// const timeInBrisbane = zonedTimeToUtc(today,timeZone);
// console.log(`
// default: ${format(today, 'HH:mm:ss')}
// Time In Paris ${format(timeInBrisbane,' HH:mm:ss')}

// `
// );



const HOURHAND = document.querySelector("#hour");
const MINUTEHAND = document.querySelector("#minute");
const SECONDHAND = document.querySelector("#second");

// Declare and Initialize the inbuilt date function

const date = new Date();

//
let hr = date.getHours();
let min = date.getMinutes();
let sec = date.getSeconds();

// Log to see the output in the console
console.log("Hour: " + hr + " Minute: " + min + " Second: " + sec);

let hrPosition = (hr * 360) / 12 + (min * (360 / 60)) / 12;
let minPosition = (min * 360) / 60 + (sec * (360 / 60)) / 60;
let secPosition = (sec * 360) / 60;

// Create a function that actually run the clock
const runClock = () => {
  // Set each position when the function is called
  hrPosition = hrPosition + 3 / 360;
  minPosition = minPosition + 6 / 60;
  secPosition = secPosition + 6;

  // Set the transformation for each arm
  HOURHAND.style.transform = "rotate(" + hrPosition + "deg)";
  MINUTEHAND.style.transform = "rotate(" + minPosition + "deg)";
  SECONDHAND.style.transform = "rotate(" + secPosition + "deg)";
 
};

// Use the inbuilt setInterval function to invoke the method we created earlier
setInterval(runClock, 1000);