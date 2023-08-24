let candles = []
let shutoffcandles = []
let hebdate = []
let yomtovstart = [{ date: '29 Elul', yomtov: 'Rosh Hashana' }, { date: '9 Tishrei', yomtov: 'Yom Kippur' }, { date: '14 Tishrei', yomtov: 'Succos' }, { date: '14 Nisan', yomtov: 'Pesach' }, { date: '5 Sivan', yomtov: 'Shavous' }]
let yomtovend = ['2 Tishrei', '10 Tishrei', '23 Tishrei', '22 Nisan', '7 Sivan']
let englishyomtovstart = [];
let englishyomtovend = [];
async function hi() {
    let response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&year=now&month=9&geo=geoname&geonameid=3448439&d=on&D=on`);
    let responsedata = await response.json();

    for (elem of responsedata.items) {
        if (elem.category === 'havdalah') {
            shutoffcandles.push(elem)
        }
        if (elem.category === 'candles') {
            candles.push(elem)
        }
        if (elem.category === 'hebdate') {
            hebdate.push(elem)
        }
    }
    for (let i = 0; i < hebdate.length; i++) {
        for (let j = 0; j < yomtovstart.length; j++) {

            if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovstart[j].date) {
                englishyomtovstart.push(hebdate[i])
            }
            if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovend[j].date) {
                englishyomtovend.push(hebdate[i])
            }
        }
    }
   
    console.log(shutoffcandles);

}
hi()



