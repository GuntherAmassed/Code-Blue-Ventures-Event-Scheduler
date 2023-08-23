const ArrowRight = document.getElementById('Arrow-Right');
const ArrowLeft = document.getElementById('Arrow-Left');
const StartOfEvent = document.getElementById('Start-of-Event');
const EndOfEvent = document.getElementById('End-Of-Event');
const NameOfEvent = document.getElementById('Event-Name');
const LocationOptions = document.getElementsByClassName('location-borders');
const LocationIdFromOptions = document.getElementsByClassName('Hidden-Location-Id');
const nameTitle = document.getElementById('User-Name-Time');
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let dataOfUser;
let EventTimes;
let startCounter = 0;
let endCounter = 0;
let timeExtracted = '';
let holiday = false;
let nextYear = 0;
let MyLocation = {};
const date = new Date();

ArrowRight.addEventListener('click', async () => {

    if (EventTimes.start.length == startCounter) {
        nextYear++;
        console.log('hi');
        await ZmanFetch(MyLocation);
        return
    }
    else {
        getStartAndEndOfEvent(EventTimes);
    }
})

ArrowLeft.addEventListener('click', async () => {
    if (endCounter < 2 || startCounter < 2) {
        return;
    }
    endCounter -= 2;
    startCounter -= 2;
    getStartAndEndOfEvent(EventTimes);
})


async function ZmanFetch(data) {
    if ('user' in data) {
        dataOfUser = data.user;
        MyLocation.Location = data.user.Location_Id;
    }
    let MyDate;
    MyDate = Number(date.getFullYear() + nextYear) + '-';
    MyDate += '01-01'
    console.log(MyDate);

    let response = await fetch(`https://codebluetimes.com/app/ZmanimApi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Date: MyDate, location: MyLocation.Location })
    });
    let responseData = await response.json();
    console.log(responseData);
    nameTitle.innerHTML = '';
    nameTitle.innerHTML += `  <span> Hello,</span>${dataOfUser.First_Name} ${dataOfUser.Last_Name}_
     <p>
    ${responseData.CityOfUser} <span> ${weekday[responseData.days]} </span><span id="clock-of-user"></span>
    </p>`;
    let clockOfUser = document.getElementById('clock-of-user');
    clockOfUser.innerHTML = '';
    setClockOfUser(responseData.hours, responseData.minutes, responseData.seconds, clockOfUser);
 EventTimes = {
        start: [],
        end: []
    };
    for (let i = 0; i < responseData.event.start.length; i++) {
        EventTimes.start.push(responseData.event.start[i]);
    }
    for (let i = 0; i < responseData.event.end.length; i++) {
        EventTimes.end.push(responseData.event.end[i]);
    }
   
    startCounter = 0;
    endCounter = 0;
    let getpoint = () => {
        month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        for (let i = 0; i < responseData.event.start.length; i++) {

            if (Number(responseData.event.start[i].date.split('-')[1]) === Number(month)) {

                for (let j = i; j < responseData.event.start.length; j++) {

                    if (Number(responseData.event.start[j].date.split('-')[2].split(' ')[0]) > Number(day)) {
                        console.log(j);
                        startCounter += j;
                        endCounter += j + 1;
                        return
                    }
                }

            }
        }
    }




    if (nextYear === 0) {
        getpoint();

    }
    console.log(EventTimes.end.length, EventTimes.start.length);
    getStartAndEndOfEvent(EventTimes);
}

function getStartAndEndOfEvent(event) {
    try {
        console.log(event);
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
    let now = new Date(date).toLocaleDateString('en-us', { weekday: "short", month: "long", day: "numeric" });
    timeExtracted = `${now}, ${time.getHours() - 12}:${time.getMinutes() > 9 ? time.getMinutes() : `0` + time.getMinutes()}pm ${time.getFullYear()}`;
    return timeExtracted;
}
async function addClickEventForLocation() {
    for (let i = 0; i < LocationOptions.length; i++) {
        LocationOptions[i].addEventListener('click', async () => {
            LocationOptions[i].style.borderColor = '#009AFE';
            startCounter = 0;
            endCounter = 0;
            nextYear = 0;
            MyLocation.Location = LocationIdFromOptions[i].innerHTML
            await ZmanFetch(MyLocation);
            for (let j = 0; j < LocationOptions.length; j++) {
                if (LocationOptions[j] !== LocationOptions[i]) {
                    LocationOptions[j].style.borderColor = '#929BA3'
                }
            }
        })
    }
}
function setClockOfUser(hours, minutes, seconds, clockOfUser) {
    let FullTime;
    let SecondOfUser = seconds;
    let MinuteOfUser = minutes;
    let HourOfUser = hours;
    console.log(HourOfUser);
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
        let finalSecond = SecondOfUser <= 9 ? '0' + SecondOfUser : SecondOfUser;
        if (HourOfUser >= 12) {
            let finalHour = HourOfUser;
            if (HourOfUser >= 13) {
                finalHour -= 12;
            }
            FullTime = `${finalHour}:${finalMinute}:${finalSecond} PM`;
        }
        else {
            let realHour = HourOfUser;
            if (HourOfUser === 0) {
                realHour = 12;
            }
            FullTime = `${realHour}:${finalMinute}:${finalSecond} AM`;
        }
        clockOfUser.innerHTML = FullTime;
    }
    setInterval(RunClockOfUser, 1000)
}





