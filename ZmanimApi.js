let HebDatesArray = [];
let itsPesach = false;
let itsShavous = false;
let itsSuccos = false;
let itsRoshHashana = false;
let itsYomKippur = false;
let yomTovim = [[{ isitChag: itsRoshHashana, chag: 'RoshaHashana' }], [{ isitChag: itsYomKippur, chag: 'yomkippur' }], [{ isitChag: itsSuccos, chag: 'Succos' }], [{ isitChag: itsPesach, chag: 'pesach' }], [{ isitChag: itsShavous, chag: 'Shavous' }]];
let timeExtracted = '';

async function HebDates() {
    const response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&year=now&geo=city&city=US-Lakewood-NJ&d=on`);
    const Shabbos = await response.json();
    await ShabbosCode(Shabbos);

}
function ShabbosCode(event) {
    var StartOfEvent = document.getElementById('Start-of-Event');
    var EndOfEvent = document.getElementById('End-of-Event');

    let YomTov = '';
    let Shabbos = '';

    for (let i = 0; i < event.items.length; i++) {
        if (event.items[i].category === "hebdate") {

            checkIfTodayIsYomTov(event.items[i]);
        }
        if (event.items[i].category === "candles" || event.items[i].category === "havdalah") {
            let time = new Date(event.items[i].date);
            let now = new Date(event.items[i].date).toLocaleDateString('en-us', { weekday: "short", month: "long", day: "numeric" });

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

            calendarEl.innerHTML += timeExtracted;
        }

    }
}
function YomTovCode(event) {
    var calendarEl = document.getElementById('calendar');
    let YomTov = '';
    let Shabbos = '';
    checkIfTodayIsYomTov(event);
    for (let i = 0; i < event.items.length; i++) {
        let time = new Date(event.items[i].date);
        let now = new Date(event.items[i].date).toLocaleDateString('en-us', { weekday: "short", month: "long", day: "numeric" });
        for (let i = 0; i < yomTovim.length; i++) {
            if (yomTovim[i][0].isitChag === true) {
                console.log(yomTovim[i][0].chag);
                event = yomTovim[i][0].chag;
                break;
            }
            else {
                YomTov = '';
            }

        }
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
HebDates();
