const ArrowRight = document.getElementById('Arrow-Right');
const ArrowLeft = document.getElementById('Arrow-Left');
const StartOfEvent = document.getElementById('Start-of-Event');
const EndOfEvent = document.getElementById('End-Of-Event');
const NameOfEvent = document.getElementById('Event-Name');
const LocationOptions = document.getElementsByClassName('location-borders');
const LocationIdFromOptions = document.getElementsByClassName('Hidden-Location-Id');
const nameTitle = document.getElementById('User-Name-Time');

let EventTimes;
let startCounter = 0;
let endCounter = 0;
let Shabbos = '';
let timeExtracted = '';
let holiday = false;
let nextYear = 0;
let StartingPlace = true;
let MyLocation;
let dataOfUser = JSON.parse(localStorage.getItem('User')).User;
let User = dataOfUser;

ArrowRight.addEventListener('click', async () => {
    if ((EventTimes.end.length - 10) === startCounter) {
        nextYear++;
        await ZmanFetch(MyLocation);
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
    console.log(location);
    MyLocation = location;
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
    let timeForUserRedone = new Date(responseData.timeForUser).toLocaleDateString('en-us', { weekday: "short" });
    nameTitle.innerHTML='';
    nameTitle.innerHTML += `  <span> Hello,</span>${User.First_Name} ${User.Last_Name}_
     <p>
    ${responseData.CityOfUser} <span> ${timeForUserRedone} </span><span id="clock-of-user"></span>
    </p>`;
    let clockOfUser = document.getElementById('clock-of-user');
    clockOfUser.innerHTML='';
    setClockOfUser(new Date(responseData.timeForUser),clockOfUser);
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
            await ZmanFetch(LocationIdFromOptions[i].innerHTML);
            for (let j = 0; j < LocationOptions.length; j++) {
                if (LocationOptions[j] !== LocationOptions[i]) {
                    LocationOptions[j].style.borderColor = '#929BA3'
                }
            }
        })
    }
}
function setClockOfUser(timeForUser,clockOfUser) {
    let FullTime;
    let SecondOfUser = timeForUser.getSeconds();
    let MinuteOfUser = timeForUser.getMinutes();
    let HourOfUser = timeForUser.getHours();
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
            if (HourOfUser > 13) {
                finalHour -= 12;
            }
            FullTime = `${finalHour}:${finalMinute}:${finalSecond} PM`;
        }
        else {
            FullTime = `${HourOfUser}:${finalMinute}:${finalSecond} AM`;
        }
        clockOfUser.innerHTML = FullTime;
    }
    setInterval(RunClockOfUser, 1000)
}





