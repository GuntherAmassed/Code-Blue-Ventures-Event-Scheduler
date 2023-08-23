

let candles = []
let shutoffcandles = []
let misc = []
let mis = []

async function hi() {
    let isyomtov = false;
    let responseTwo = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&maj=on&start=2023-01-01&end=2024-01-01&geo=geoname&geonameid=3448439`);
    let responsedataTwo = await responseTwo.json();
    for (elem of responsedataTwo.items) {
        if (elem.category === 'candles' && 'memo' in elem) {
            if (elem.memo.includes('Erev')) {
                misc.push(elem)
                isyomtov = true;
            }
        }
        if (elem.category === 'havdalah' && 'memo' in elem) {
            if (!(elem.memo.includes('Sukkot'))) {
                mis.push(elem)
                isyomtov = false;
                continue
            }

        }
        if (isyomtov === false) {
            if (elem.category === 'havdalah') {
                mis.push(elem)
            }
            if (elem.category === 'candles') {
                misc.push(elem)
            }
        }


    }
}

hi()