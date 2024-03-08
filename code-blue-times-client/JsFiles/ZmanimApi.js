
const ArrowRight = document.getElementById('Arrow-Right');
const ArrowLeft = document.getElementById('Arrow-Left');
const StartOfEvent = document.getElementById('Start-of-Event');
const EndOfEvent = document.getElementById('End-Of-Event');
const NameOfEvent = document.getElementById('Event-Name');
const LocationOptions = document.getElementsByClassName('location-borders');
const LocationIdFromOptions = document.getElementsByClassName('Hidden-Location-Id');
const nameTitle = document.getElementById('User-Name-Time');
const EventNameRow = document.getElementById('Event-Name-Row');
const StartOfEventRow = document.getElementById('Start-of-Event-Row');
const EndOfEventRow = document.getElementById('End-Of-Event-Row');
const Handthing = document.getElementById('Handthing')
let fullcityName;
let dataOfUser;
let EventTimes;
let startCounter = 0;
let endCounter = 0;
let nextYear = 0;
let MyLocation = {};
let currentTzid;
let nextyomtov;
let theCurrentDate;

EventTimes = {
    start: [],
    end: [],
    yomtovend: [],
    yomtovstart: []
};
ArrowRight.addEventListener('click', async () => {
    theCurrentDate.setDate(theCurrentDate.getDate() + 1)
    getpoint()
    document.querySelector("#Today-Date").innerText = `${new Date(theCurrentDate).toLocaleString('en-US', { weekday: "short", month: "short", day: "numeric", year: "numeric" }).replace(/,/g, "")}`;

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
    theCurrentDate.setDate(theCurrentDate.getDate() - 1)
    getpoint()
    document.querySelector("#Today-Date").innerText = `${new Date(theCurrentDate).toLocaleString('en-US', { weekday: "short", month: "short", day: "numeric", year: "numeric" }).replace(/,/g, "")}`;
    if (endCounter < 2 || startCounter < 2) {
        return;
    }
    getStartAndEndOfEvent(EventTimes);

})
document.querySelector('#Today-Date-span').addEventListener('click', async () => {
    theCurrentDate = new Date()
    nextYear = 0;
    await ZmanFetch(MyLocation, theCurrentDate);
    document.querySelector("#Today-Date").innerText = `${new Date(theCurrentDate).toLocaleString('en-US', { weekday: "short", month: "short", day: "numeric", year: "numeric" }).replace(/,/g, "")}`;
    document.querySelector('iframe').contentWindow.postMessage({ type: 'Reset', msg: 'time to Reset' }, '*');
})


async function ZmanFetch(data, theCurrentDateArg) {
    let MyDate;

    if ('user' in data) {
        dataOfUser = data.user;
        MyLocation.Location = dataOfUser[0].Id;
    }
    if (theCurrentDateArg) {
        theCurrentDate = theCurrentDateArg;
        MyDate = theCurrentDate.getFullYear();
    }
    else {
        theCurrentDate = new Date();
        MyDate = Number(theCurrentDate.getFullYear() + nextYear);
    }

    MyDate += '-01-01'
    console.log(MyDate);
    let response = await fetch(`https://codebluetimes.com/app/ZmanimApi`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Date: MyDate, location: MyLocation.Location, nextYear })
    });
    let responseData = await response.json();
    currentTzid = responseData.timezone;
    let currentTime = new Date().toLocaleString('en-US', { timeZone: currentTzid })
    CityOfUser = responseData.CityOfUser
    fullcityName = ''
    for (let i = 0; i < responseData.CityOfUser.split(',').length; i++) {
        if (i === 0 || i === responseData.CityOfUser.split(',').length - 1) {
            fullcityName += responseData.CityOfUser.split(',')[i]
        }
    }
    nameTitle.innerHTML = '';
    Handthing.innerHTML = '👋'
    nameTitle.innerHTML += `      
    <span> Hello,</span>${dataOfUser[0].First_Name} ${dataOfUser[0].Last_Name}_
     <p>
    ${fullcityName} <span class='color-gray'> ${new Date().toLocaleTimeString('en-US', { timeZone: responseData.timezone, timeZoneName: 'short' }).split(' ')[2]} </span><span id="clock-of-user"></span>
    </p>`;
    let clockOfUser = document.getElementById('clock-of-user');
    clockOfUser.innerHTML = '';
    setClockOfUser(clockOfUser, currentTime);
    EventTimes.yomtovend = []
    EventTimes.yomtovstart = []
    EventTimes.start = []
    EventTimes.end = []
    for (let i = 0; i < responseData.event.start.length; i++) {
        EventTimes.start.push(responseData.event.start[i]);
    }
    for (let i = 0; i < responseData.event.end.length; i++) {
        EventTimes.end.push(responseData.event.end[i]);
    }
    for (let i = 0; i < responseData.event.englishyomtovend.length; i++) {
        EventTimes.yomtovend.push(responseData.event.englishyomtovend[i]);
        EventTimes.yomtovstart.push(responseData.event.englishyomtovstart[i]);
    }


    if (nextYear === 0 || theCurrentDateArg) {
        getpoint();
    }

    getStartAndEndOfEvent(EventTimes);
}
function getpoint() {

    month = theCurrentDate.getMonth();
    day = theCurrentDate.getDate();
    for (let i = 0; i < EventTimes.start.length; i++) {
        if (new Date(EventTimes.start[i].date).getMonth() >= month) {
            if (new Date(EventTimes.start[i].date).getDate() >= day) {
                startCounter = i;
                endCounter = i;
                return
            }
        }
    }
}
function getStartAndEndOfEvent(event) {
    try {
        nextyomtov = []
        console.log(event.yomtovend);
        for (let i = 0; i < event.yomtovend.length; i++) {
            if (theCurrentDate.getMonth() === new Date(event.yomtovend[i].date).getMonth() || theCurrentDate.getMonth() === new Date(event.yomtovstart[i].date).getMonth()) {
                if (theCurrentDate.getMonth() < new Date(event.yomtovend[i].date).getMonth() || theCurrentDate.getDate() <= new Date(event.yomtovend[i].date).getDate()) {
                    console.log(theCurrentDate.getMonth() , new Date(event.yomtovend[i].date).getMonth());
                    let items = {
                        start: event.yomtovstart[i].date,
                        yomtov: event.yomtovstart[i].yomtov,
                        end: event.yomtovend[i].date
                    }
                    nextyomtov.push(items);
                }
            }
        }
        NameOfEvent.innerHTML = ' Sabbath';
        EndOfEvent.innerHTML = `${getTime(event.end[endCounter].date)[0]} <span>${getTime(event.end[endCounter].date)[1]}, </span> <span class="blue-span"> ${getTime(event.end[endCounter].date)[2]}</span>`
        StartOfEvent.innerHTML = `${getTime((event.start[startCounter].date))[0]} <span>${getTime(event.start[startCounter].date)[1]}, </span> <span class="blue-span"> ${getTime(event.start[startCounter].date)[2]}</span>`;
        let tditem1 = document.getElementsByClassName('td-item-1');
        let tditem2 = document.getElementsByClassName('td-item-2');
        let tditem3 = document.getElementsByClassName('td-item-3');

        if (tditem1.length > 0) {
            for (let i = tditem1.length - 1; i >= 0; i--) {
                StartOfEventRow.removeChild(tditem1[i]);
                EndOfEventRow.removeChild(tditem2[i]);
                EventNameRow.removeChild(tditem3[i]);
            }

        }
        if (nextyomtov.length > 0) {
            let td1;
            let td2;
            let td3;
            for (let i = 0; i < nextyomtov.length; i++) {
                td1 = document.createElement('td');
                td2 = document.createElement('td');
                td3 = document.createElement('td');
                td1.innerHTML = `${getTime(nextyomtov[i].start)[0]} <span>${getTime(nextyomtov[i].start)[1]}, </span> <span class="blue-span"> ${getTime(nextyomtov[i].start)[2]}</span>`;
                td2.innerHTML = `${getTime(nextyomtov[i].end)[0]} <span>${getTime(nextyomtov[i].end)[1]},  </span> <span class="blue-span">${getTime(nextyomtov[i].end)[2]}</span>`;
                td3.textContent = nextyomtov[i].yomtov
                td1.classList.add('td-item-1');
                td2.classList.add('td-item-2');
                td3.classList.add('td-item-3');
                StartOfEventRow.appendChild(td1);
                EndOfEventRow.appendChild(td2);
                EventNameRow.appendChild(td3);
            }
        }

    }
    catch (error) {
        console.error(error);
    }
}



function getTime(date) {
    let now = new Date(date).toLocaleString('en-US', { timeZone: currentTzid, weekday: "short",  day: "numeric",month: "short", hour: 'numeric', minute: 'numeric' });
    let nowSplit = [];
    for (let i = 0; i < now.split(',').length; i++) {
        if (i > 0) {
            if (!now.split(',')[i].includes('at')) {
                nowSplit.push(now.split(',')[i])
            }
            else {
                let splitup = now.split(',')[i].replace('at', ',').split(',')
                for (let i = 0; i < splitup.length; i++) {
                    nowSplit.push(splitup[i])
                }
                return nowSplit;
            }
        }
        else {
            nowSplit.push(now.split(',')[i])
        }
    }

    return nowSplit;
}
let clickedLoc;
/*Exported addClickEventForLocation*/
async function addClickEventForLocation() {
    for (let i = 0; i < LocationOptions.length; i++) {
        if (LocationOptions[i].innerHTML.split('<')[0] === fullcityName) {
            LocationOptions[i].style.borderColor = '#009AFE';
            LocationOptions[i].style.color = 'white'
            clickedLoc = LocationOptions[i];
            document.querySelector('#row-location-frame').insertBefore(LocationOptions[i], LocationOptions[0])
            break
        }
    }
    for (let i = 0; i < LocationOptions.length; i++) {
        LocationOptions[i].addEventListener('click', async () => {
            clickedLoc = LocationOptions[i]
            LocationOptions[i].style.borderColor = '#009AFE';
            LocationOptions[i].style.color = 'white'
            startCounter = 0;
            endCounter = 0;
            nextYear = 0;
            EventTimes.end = [];
            EventTimes.start = [];
            MyLocation.Location = LocationIdFromOptions[i].innerHTML
            await ZmanFetch(MyLocation);
            for (let j = 0; j < LocationOptions.length; j++) {
                if (LocationOptions[j] !== LocationOptions[i]) {
                    LocationOptions[j].style.borderColor = '#929BA3'
                    LocationOptions[j].style.color = '#929BA3'
                }
            }
        })
        LocationOptions[i].addEventListener('mouseover', () => {
            if (LocationOptions[i] !== clickedLoc) {
                LocationOptions[i].style.borderColor = '#009AFE';
                LocationOptions[i].style.color = 'white'
            }
        })
        LocationOptions[i].addEventListener('mouseout', () => {
            if (LocationOptions[i] !== clickedLoc) {
                LocationOptions[i].style.borderColor = '#929BA3'
                LocationOptions[i].style.color = '#929BA3'
            }
        })

    }
}
function setClockOfUser(clockOfUser, currentTime) {
    let FullTime;
    let SecondOfUser = new Date(currentTime).getSeconds();
    let MinuteOfUser = new Date(currentTime).getMinutes();
    let HourOfUser = new Date(currentTime).getHours();

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
            let finalHour = HourOfUser;
            if (HourOfUser >= 13) {
                finalHour -= 12;
            }
            FullTime = `${finalHour}:${finalMinute} PM`;
        }
        else {
            let realHour = HourOfUser;
            if (HourOfUser === 0) {
                realHour = 12;
            }
            FullTime = `${realHour}:${finalMinute} AM`;
        }
        clockOfUser.innerHTML = FullTime;
    }
    RunClockOfUser();
    setInterval(RunClockOfUser, 1000)
}





