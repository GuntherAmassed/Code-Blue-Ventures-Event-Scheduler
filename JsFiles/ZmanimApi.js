let HebDatesArray = [];
let itsPesach = false;
let itsShavous = false;
let itsSuccos = false;
let itsRoshHashana = false;
let itsYomKippur = false;
let yomTovim = [[{ isitChag: itsRoshHashana, chag: 'RoshaHashana' }], [{ isitChag: itsYomKippur, chag: 'yomkippur' }], [{ isitChag: itsSuccos, chag: 'Succos' }], [{ isitChag: itsPesach, chag: 'pesach' }], [{ isitChag: itsShavous, chag: 'Shavous' }]];
let timeExtracted = '';
var ArrowRight = document.getElementById('Arrow-Right');
var ArrowLeft = document.getElementById('Arrow-Left');
let i = 0
let response = '';
let Shabbos = '';
var StartOfEvent = document.getElementById('Start-of-Event');
var EndOfEvent = document.getElementById('End-Of-Event');
let date = new Date();
let finalStringDate = '';
let goBack = false;
let shabbosTimes = []
finalStringDate += date.getFullYear() + '-'
finalStringDate += (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1) + '-';
finalStringDate += date.getDate() + 1 > 9 ? date.getDate() : '0' + date.getDate();
console.log(finalStringDate);

ArrowRight.addEventListener('click', () => {
    ShabbosCode(shabbosTimes);

})
ArrowLeft.addEventListener('click', () => {
    if (i === 2) {
        return;
    }
    i = i - 4;
    console.log(i);
    ShabbosCode(shabbosTimes);


})
ZmanFetch(finalStringDate);
async function ZmanFetch() {
    response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&mf=off&start=${finalStringDate}&end=2023-12-01&geo=city&city=US-Lakewood-NJ`);
    Shabbos = await response.json();
    console.log(Shabbos);
    for (let i = 0; i < Shabbos.items.length; i++) {
        if (Shabbos.items[i].category === "candles" || Shabbos.items[i].category === "havdalah") {

            shabbosTimes.push(Shabbos.items[i]);
        }
    }
    console.log(shabbosTimes);
    ShabbosCode(shabbosTimes);

}
function ShabbosCode(event) {

    let YomTov = '';
    let Shabbos = '';
    let NotFinshed = true;
    let startMade = false;
    while (NotFinshed === true) {

        if (event[i].category === "hebdate") {

            checkIfTodayIsYomTov(event.items[i]);
        }
        if (event[i].category === "candles" || event[i].category === "havdalah") {

            let time = new Date(event[i].date);
            let now = new Date(event[i].date).toLocaleDateString('en-us', { weekday: "short", month: "long", day: "numeric" });
            console.log("hi");
            for (let i = 0; i < yomTovim.length; i++) {
                if (yomTovim[i][0].isitChag === true) {
                    console.log(yomTovim[i][0].chag);
                    YomTov = yomTovim[i][0].chag;
                    break;
                }
                else {
                    YomTov = '';
                }

            }
            if (time.getDay() === 6) {
                Shabbos = 'Shabbos';
            }
            else if (time.getDay() === 5) {
                Shabbos = 'erev shabbos';
            }
            else {
                Shabbos = '';
            }
            timeExtracted = `${now}, ${time.getHours() - 12}:${time.getMinutes() > 9 ? time.getMinutes() : `0` + time.getMinutes()}pm`;
            if (startMade === false) {
                StartOfEvent.innerHTML = timeExtracted;
                startMade = true;
                console.log(timeExtracted + '  start');
            }
            else {
                EndOfEvent.innerHTML = timeExtracted;
                console.log(timeExtracted + '  end');
                NotFinshed = false;

            }

        }
        i++;
    }




}
function checkIfTodayIsYomTov(today) {

    switch (today.title) {
        case '1st of tishrei':
            yomTovim[0][0].isitChag = true;
            break;
        case '10th of Tishrei':
            yomTovim[1][0].isitChag = true;
            break;
        case '15th of Tishrei':
            yomTovim[2][0].isitChag = true;
            break;
        case '15th of Nisan':
            yomTovim[3][0].isitChag = true;
            break;
        case '6th of Sivan':
            yomTovim[4][0].isitChag = true;
            break;
        case '3rd of Tishrei':
            yomTovim[0][0].isitChag = false;
            break;
        case '11th of Tishrei':
            yomTovim[1][0].isitChag = false;
            break;
        case '24th of Tishrei':
            yomTovim[2][0].isitChag = false;
            break;
        case '22nd of Nisan':
            yomTovim[3][0].isitChag = false;
            break;
        case '8th of Sivan':
            yomTovim[4][0].isitChag = false;
            break;
        default:
            break;


    }

}
