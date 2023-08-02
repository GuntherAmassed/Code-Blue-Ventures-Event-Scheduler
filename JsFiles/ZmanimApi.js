const ArrowRight = document.getElementById('Arrow-Right');
const ArrowLeft = document.getElementById('Arrow-Left');
const StartOfEvent = document.getElementById('Start-of-Event');
const EndOfEvent = document.getElementById('End-Of-Event');
const NameOfEvent = document.getElementById('Event-Name');
let EventTimes = {
    start: [],
    end: []
};
let startCounter = 0;
let endCounter = 0;
let Shabbos = '';
let timeExtracted = '';
let holiday = false;
let nextYear = 0;
let StartingPlace = true;

ArrowRight.addEventListener('click', async () => {
    if ((EventTimes.end.length - 10) === startCounter) {
        nextYear++;
        await ZmanFetch();
    }
    getStartAndEndOfEvent(EventTimes);
})

ArrowLeft.addEventListener('click', async () => {
    if (endCounter < 2 || startCounter < 2) {
        return;
    }
    endCounter -= 2;
    startCounter -= 2;
    getStartAndEndOfEvent(EventTimes);
})

async function ZmanFetch(location) {
    let MyDate;
    if (nextYear === 0) {
        let date = new Date();
        MyDate = (date.getFullYear()) + '-';
        MyDate += (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1) + '-';
        MyDate += date.getDate() + 1 > 9 ? date.getDate() : '0' + date.getDate();
    }
    else {
        let date = new Date();
        MyDate = (date.getFullYear() + nextYear) + '-';
        MyDate += '01-01'
    }
    let response = await fetch(`http://localhost:3000/ZmanimApi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Date: MyDate, location: location })
    });
    let responseData = await response.json();
    for (let i = 0; i < responseData.event.start.length; i++) {
        EventTimes.start.push(responseData.event.start[i]);
    }
    for (let i = 0; i < responseData.event.end.length; i++) {
        EventTimes.end.push(responseData.event.end[i]);
    }
    getStartAndEndOfEvent(EventTimes);
}

function getStartAndEndOfEvent(event) {
    try {
        if ('memo' in event.start[startCounter]) {
            holiday = true;
            let yomtov;
            yomtov = event.end[endCounter].memo;
            NameOfEvent.innerHTML = yomtov;
        }
        if ('memo' in event.end[endCounter]) {
            holiday = true;
            let yomtov;
            yomtov = event.end[endCounter].memo;
            NameOfEvent.innerHTML = yomtov;
        }
        else {
            holiday = false;
        }
        if (new Date(event.end[endCounter].date).getDay() === 6 || new Date(event.start[startCounter].date).getDay() === 5) {
            if (holiday) {
                NameOfEvent.innerHTML += ' & Sabbath';
            }
            else {
                NameOfEvent.innerHTML = ' Sabbath';
            }
        }
        EndOfEvent.innerHTML = getTime(event.end[endCounter].date);
        endCounter++;
        StartOfEvent.innerHTML = getTime(event.start[startCounter].date);
        startCounter++;
    }
    catch (error) {
        console.error(error);
    }

}

function getTime(date) {
    let time = new Date(date);
    console.log(date);
    let now = new Date(date).toLocaleDateString('en-us', { weekday: "short", month: "long", day: "numeric" });
    timeExtracted = `${now}, ${time.getHours() - 12}:${time.getMinutes() > 9 ? time.getMinutes() : `0` + time.getMinutes()}pm ${time.getFullYear()}`;
    return timeExtracted;
}
// const { DateTime } = require('luxon');

// const originalTimeString = '2023-08-05T20:00:00+02:00';
// const originalDateTime = DateTime.fromISO(originalTimeString);

// console.log('Original Date and Time:', originalDateTime.toString());

// // Convert to a different time zone (e.g., Eastern Daylight Time)
// const convertedDateTime = originalDateTime.setZone('America/New_York');

// console.log('Converted Date and Time:', convertedDateTime.toString());




