let candles = []
let shutoffcandles = []
let hebdate = []
let yomtovstart = ['29 Elul', '9 Tishrei', '14 Tishrei', '14 Nisan', '5 Sivan']
let yomtovend = ['2 Tishrei', '10 Tishrei', '23 Tishrei', '22 Nisan', '7 Sivan']
let englishyomtovstart = [];
let englishyomtovend = [];
async function hi() {
    let response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&start=2023-01-01&end=2024-01-01&geo=geoname&geonameid=3448439&d=on`);
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

            if (hebdate[i].hdate.split(' ')[0]+' '+hebdate[i].hdate.split(' ')[1] === yomtovstart[j]) {
                englishyomtovstart.push(hebdate[i])
            }
            if (hebdate[i].hdate.split(' ')[0]+' '+hebdate[i].hdate.split(' ')[1]===yomtovend[j]) {
                englishyomtovend.push(hebdate[i])
            }
        }
    }
    console.log(englishyomtovend[4], englishyomtovstart[4]);
}
hi()