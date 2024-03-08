
document.addEventListener('DOMContentLoaded', function () {
    let totalevents = []
    let yomtovstart = [{ date: '29 Elul', yomtov: 'Rosh Hashana' }, { date: '9 Tishri', yomtov: 'Yom Kippur' }, { date: '14 Tishri', yomtov: 'Succos' }, { date: '14 Nisan', yomtov: 'Pesach' }, { date: '5 Sivan', yomtov: 'Shavous' }]
    let yomtovend = ['2 Tishri', '10 Tishri', '23 Tishri', '22 Nisan', '7 Sivan']
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl);
    let firstTimeForTD = true;
    let currentTdClicked;


    calendar.render();
    parseDateForYomTov()
    function colorEvent(startofyomtov, endofyomtov) {
        totalevents.push(startofyomtov)
        totalevents.push(endofyomtov)
        document.querySelectorAll('td').forEach(e => {
            totalevents.forEach((eve) => {
                if (eve === e.getAttribute('data-date')) {
                    e.classList.add('first-day-style')
                }
            })
            if (currentTdClicked) {
                if (currentTdClicked.getAttribute('data-date') === e.getAttribute('data-date')) {
                    e.classList.add('Today-Day-Style')
                }
            }

        })

    }
    function parseDateForYomTov() {
        let amountOfDays = new Date(new Date(calendar.getDate()).getFullYear(), new Date(calendar.getDate()).getMonth(), 0).getDate();
        let currentmonth = new Date(calendar.getDate()).getMonth() + 1;
        let year = new Date(calendar.getDate()).getFullYear()
        let startofyomtov;
        let endofyomtov;
        let endofyomtovevent;
        for (let month = currentmonth - 1; month <= currentmonth + 1; month++) {
            for (let i = 0; i <= amountOfDays; i++) {
                for (let j = 0; j < yomtovstart.length; j++) {
                    if (new Date(`${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`).toLocaleString('en-u-ca-hebrew', { day: "numeric", month: "long" }) === yomtovstart[j].date) {
                        startofyomtov = `${year}-${month < 10 ? `0${month}` : month}-${i - 1 < 10 ? `0${i - 1}` : i - 1}`
                    }
                    console.log();
                    if (new Date(`${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`).toLocaleString('en-u-ca-hebrew', { day: "numeric", month: "long" }) === yomtovend[j]) {
                        endofyomtov = `${year}-${month < 10 ? `0${month}` : month}-${i - 1 < 10 ? `0${i - 1}` : i - 1}`
                        endofyomtovevent = `${year}-${month < 10 ? `0${month}` : month}-${i < 10 ? `0${i}` : i}`
                    }
                    if (startofyomtov && endofyomtov) {
                        colorEvent(startofyomtov, endofyomtov)

                        calendar.addEvent({
                            start: startofyomtov,
                            end: endofyomtovevent,
                            display: 'background',
                        })
                        startofyomtov = undefined;
                        endofyomtov = undefined;
                    }
                }
            }
        }

        document.querySelectorAll('td').forEach(td => {
            if (firstTimeForTD) {
                if (document.querySelector('.fc .fc-daygrid-day.fc-day-today')) {
                    currentTdClicked = document.querySelector('.fc .fc-daygrid-day.fc-day-today');
                    currentTdClicked.classList.add('Today-Day-Style');
                    firstTimeForTD = false;
                }
            }
            td.addEventListener('click', (e) => {
                e.stopPropagation()
                if (currentTdClicked) {
                    currentTdClicked.classList.remove('Today-Day-Style')
                }
                td.classList.add('Today-Day-Style');
                currentTdClicked = td;
                let tdDate = td.getAttribute('data-date')
                window.parent.postMessage({ type: 'TdClick', tdDate }, '*');
            })

        });

    }
    document.querySelector('.fc-button-group').addEventListener('click', parseDateForYomTov)
    window.addEventListener('message', async function (event) {
        if (event.data.type === "Reset") {
            location.reload();
        }
    });


});
