const port = 3000;
const express = require('express');
const cors = require('cors');
const ct = require('countries-and-timezones');
const { createPool } = require('mysql2');
cors.all;
const app = express();
app.use(cors());
app.use(express.json());
const { formatInTimeZone } = require('date-fns-tz');
const today = new Date();
let clockAmount = '';
let times = [];
const timeZone = [
    {
        "offset": "GMT-12:00",
        "name": "Etc/GMT-12"
    },
    {
        "offset": "GMT-11:00",
        "name": "Etc/GMT-11"
    },
    {
        "offset": "GMT-11:00",
        "name": "Pacific/Midway"
    },
    {
        "offset": "GMT-10:00",
        "name": "America/Adak"
    },
    {
        "offset": "GMT-09:00",
        "name": "America/Anchorage"
    },
    {
        "offset": "GMT-09:00",
        "name": "Pacific/Gambier"
    },
    {
        "offset": "GMT-08:00",
        "name": "America/Dawson_Creek"
    },
    {
        "offset": "GMT-08:00",
        "name": "America/Ensenada"
    },
    {
        "offset": "GMT-08:00",
        "name": "America/Los_Angeles"
    },
    {
        "offset": "GMT-07:00",
        "name": "America/Chihuahua"
    },
    {
        "offset": "GMT-07:00",
        "name": "America/Denver"
    },
    {
        "offset": "GMT-06:00",
        "name": "America/Belize"
    },
    {
        "offset": "GMT-06:00",
        "name": "America/Cancun"
    },
    {
        "offset": "GMT-06:00",
        "name": "America/Chicago"
    },
    {
        "offset": "GMT-06:00",
        "name": "Chile/EasterIsland"
    },
    {
        "offset": "GMT-05:00",
        "name": "America/Bogota"
    },
    {
        "offset": "GMT-05:00",
        "name": "America/Havana"
    },
    {
        "offset": "GMT-05:00",
        "name": "America/New_York"
    },
    {
        "offset": "GMT-04:30",
        "name": "America/Caracas"
    },
    {
        "offset": "GMT-04:00",
        "name": "America/Campo_Grande"
    },
    {
        "offset": "GMT-04:00",
        "name": "America/Glace_Bay"
    },
    {
        "offset": "GMT-04:00",
        "name": "America/Goose_Bay"
    },
    {
        "offset": "GMT-04:00",
        "name": "America/Santiago"
    },
    {
        "offset": "GMT-04:00",
        "name": "America/La_Paz"
    },
    {
        "offset": "GMT-03:00",
        "name": "America/Argentina/Buenos_Aires"
    },
    {
        "offset": "GMT-03:00",
        "name": "America/Montevideo"
    },
    {
        "offset": "GMT-03:00",
        "name": "America/Araguaina"
    },
    {
        "offset": "GMT-03:00",
        "name": "America/Godthab"
    },
    {
        "offset": "GMT-03:00",
        "name": "America/Miquelon"
    },
    {
        "offset": "GMT-03:00",
        "name": "America/Sao_Paulo"
    },
    {
        "offset": "GMT-03:30",
        "name": "America/St_Johns"
    },
    {
        "offset": "GMT-02:00",
        "name": "America/Noronha"
    },
    {
        "offset": "GMT-01:00",
        "name": "Atlantic/Cape_Verde"
    },
    {
        "offset": "GMT",
        "name": "Europe/Belfast"
    },
    {
        "offset": "GMT",
        "name": "Africa/Abidjan"
    },
    {
        "offset": "GMT",
        "name": "Europe/Dublin"
    },
    {
        "offset": "GMT",
        "name": "Europe/Lisbon"
    },
    {
        "offset": "GMT",
        "name": "Europe/London"
    },
    {
        "offset": "UTC",
        "name": "UTC"
    },
    {
        "offset": "GMT+01:00",
        "name": "Africa/Algiers"
    },
    {
        "offset": "GMT+01:00",
        "name": "Africa/Windhoek"
    },
    {
        "offset": "GMT+01:00",
        "name": "Atlantic/Azores"
    },
    {
        "offset": "GMT+01:00",
        "name": "Atlantic/Stanley"
    },
    {
        "offset": "GMT+01:00",
        "name": "Europe/Amsterdam"
    },
    {
        "offset": "GMT+01:00",
        "name": "Europe/Belgrade"
    },
    {
        "offset": "GMT+01:00",
        "name": "Europe/Brussels"
    },
    {
        "offset": "GMT+02:00",
        "name": "Africa/Cairo"
    },
    {
        "offset": "GMT+02:00",
        "name": "Africa/Blantyre"
    },
    {
        "offset": "GMT+02:00",
        "name": "Asia/Beirut"
    },
    {
        "offset": "GMT+02:00",
        "name": "Asia/Damascus"
    },
    {
        "offset": "GMT+02:00",
        "name": "Asia/Gaza"
    },
    {
        "offset": "GMT+02:00",
        "name": "Asia/Jerusalem"
    },
    {
        "offset": "GMT+03:00",
        "name": "Africa/Addis_Ababa"
    },
    {
        "offset": "GMT+03:00",
        "name": "Asia/Riyadh89"
    },
    {
        "offset": "GMT+03:00",
        "name": "Europe/Minsk"
    },
    {
        "offset": "GMT+03:30",
        "name": "Asia/Tehran"
    },
    {
        "offset": "GMT+04:00",
        "name": "Asia/Dubai"
    },
    {
        "offset": "GMT+04:00",
        "name": "Asia/Yerevan"
    },
    {
        "offset": "GMT+04:00",
        "name": "Europe/Moscow"
    },
    {
        "offset": "GMT+04:30",
        "name": "Asia/Kabul"
    },
    {
        "offset": "GMT+05:00",
        "name": "Asia/Tashkent"
    },
    {
        "offset": "GMT+05:30",
        "name": "Asia/Kolkata"
    },
    {
        "offset": "GMT+05:45",
        "name": "Asia/Katmandu"
    },
    {
        "offset": "GMT+06:00",
        "name": "Asia/Dhaka"
    },
    {
        "offset": "GMT+06:00",
        "name": "Asia/Yekaterinburg"
    },
    {
        "offset": "GMT+06:30",
        "name": "Asia/Rangoon"
    },
    {
        "offset": "GMT+07:00",
        "name": "Asia/Bangkok"
    },
    {
        "offset": "GMT+07:00",
        "name": "Asia/Novosibirsk"
    },
    {
        "offset": "GMT+08:00",
        "name": "Etc/GMT+8"
    },
    {
        "offset": "GMT+08:00",
        "name": "Asia/Hong_Kong"
    },
    {
        "offset": "GMT+08:00",
        "name": "Asia/Krasnoyarsk"
    },
    {
        "offset": "GMT+08:00",
        "name": "Australia/Perth"
    },
    {
        "offset": "GMT+08:45",
        "name": "Australia/Eucla"
    },
    {
        "offset": "GMT+09:00",
        "name": "Asia/Irkutsk"
    },
    {
        "offset": "GMT+09:00",
        "name": "Asia/Seoul"
    },
    {
        "offset": "GMT+09:00",
        "name": "Asia/Tokyo"
    },
    {
        "offset": "GMT+09:30",
        "name": "Australia/Adelaide"
    },
    {
        "offset": "GMT+09:30",
        "name": "Australia/Darwin"
    },
    {
        "offset": "GMT+09:30",
        "name": "Pacific/Marquesas"
    },
    {
        "offset": "GMT+10:00",
        "name": "Etc/GMT+10"
    },
    {
        "offset": "GMT+10:00",
        "name": "Australia/Brisbane"
    },
    {
        "offset": "GMT+10:00",
        "name": "Australia/Hobart"
    },
    {
        "offset": "GMT+10:00",
        "name": "Asia/Yakutsk"
    },
    {
        "offset": "GMT+10:30",
        "name": "Australia/Lord_Howe"
    },
    {
        "offset": "GMT+11:00",
        "name": "Asia/Vladivostok"
    },
    {
        "offset": "GMT+11:30",
        "name": "Pacific/Norfolk"
    },
    {
        "offset": "GMT+12:00",
        "name": "Etc/GMT+12"
    },
    {
        "offset": "GMT+12:00",
        "name": "Asia/Anadyr"
    },
    {
        "offset": "GMT+12:00",
        "name": "Asia/Magadan"
    },
    {
        "offset": "GMT+12:00",
        "name": "Pacific/Auckland"
    },
    {
        "offset": "GMT+12:45",
        "name": "Pacific/Chatham"
    },
    {
        "offset": "GMT+13:00",
        "name": "Pacific/Tongatapu"
    },
    {
        "offset": "GMT+14:00",
        "name": "Pacific/Kiritimati"
    }
];
const fs = require('fs');
let files = fs.readdirSync('C:/Users/Moshe Stern/Desktop/Figma Api/ZuntaTimes/Images/Flags');

let FinalCountryIntialArray = [];
let fileNames = [];

function getCountries() {

    let countryIntials = [];
    for (let i = 0; i < files.length; i++) {
        let filesSplit = files[i].split(/ |-/);
        countryIntials.push(filesSplit[0]);
    }
    for (let i = 0; i < countryIntials.length; i++) {
        let country = ct.getCountry(countryIntials[i].toUpperCase());
        if (country !== null) {
            FinalCountryIntialArray.push(country);
        }
    }
}
function getFlagNames() {
    for (let i = 0; i < FinalCountryIntialArray.length; i++) {
        for (let j = 0; j < files.length; j++) {
            if (files[j].includes(FinalCountryIntialArray[i].name)) {
                fileNames.push(files[j])
            }
        }

    }
}

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginforzunta'
});
getCountries();
getFlagNames();

app.get('/UserInfo', (req, res) => {
    let flagPath = [];
    let data = [];
    pool.query('SELECT * FROM userinfo', (error, results) => {
        if (error) {
            return console.log(error)
        }
        for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < files.length; j++) {
                if (files[j].includes(results[i].Location)) {
                    flagPath.push(files[j]);
                }
            }

        }
        data.push({
            filePaths: flagPath,
            serverData: results
        })
        res.send(data);
        console.log('Sent Data');
    });
})
app.post('/ClockAmount', (req, res) => {
    clockAmount = req.body.Amount;
    for (let i = 0; i < clockAmount; i++) {
        times.push({
            Place: timeZone[i].name,
            Hour: formatInTimeZone(today, timeZone[i].name, 'HH'),
            Minute: formatInTimeZone(today, timeZone[i].name, 'mm'),
            Second: formatInTimeZone(today, timeZone[i].name, 'ss'),
            Day: formatInTimeZone(today, timeZone[i].name, 'EEEE')
        })
    }
    res.send(times);
})


app.listen(port, () => {
    console.log("listening on port " + port);
})


