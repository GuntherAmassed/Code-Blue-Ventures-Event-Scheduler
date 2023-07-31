const port = 3000;
require('dotenv').config()
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
const crytpo = require('crypto');
var path = require('path');
let dirName = 'C:/Users/Moshe Stern/Desktop/Figma Api/ZuntaTimes';
const jwt = require('jsonwebtoken');
app.use(express.static(dirName));
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
const { error } = require('console');
const { json } = require('body-parser');
const { finished } = require('stream');
const { reject } = require('bcrypt/promises');
let files = fs.readdirSync(`Images/Flags`);
const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginforzunta'
});
let FinalCountryIntialArray = [];
let fileNames = [];
let row = '';
const LogInQuery = `SELECT * FROM userinfo us WHERE us.Email=? AND us.Password=?;`;
const refreshTokenAdd = `INSERT INTO refresh_token(Refresh_Tokens,Id) VALUES(?,?);`;
const checkIfRefreshTokenIsInDatabase = `SELECT * FROM Refresh_Token WHERE Refresh_Token.Refresh_Tokens=?;`;
const checkIfUserHasRefreshToken = `SELECT * FROM Refresh_Token WHERE refresh_token.id=?;`

/////calling

getCountries();
getFlagNames();


/////listeners
app.get('', (req, res) => {

})

app.post('/LogIn', (req, res) => {
    pool.query(LogInQuery, [req.body.Email, req.body.Password], async (error, results, fields) => {
        let response = {
            error: true,
            message: '',
        }
        if (error) {
            console.error(error.message);
            response.message = 'Error connecting to Database';
            res.send(response);
        }
        else if (results.length > 0) {
            try {
                response.error = false;
                let User = {
                    id: results[0].Id,
                    First_Name: results[0].First_Name,
                    Last_Name: results[0].Last_Name,
                    Skype: results[0].Skype,
                    Location: results[0].Location,
                    timeZone: results[0].timeZone,
                    Role: results[0].Role,
                };
                if (req.body.rememberMe === true) {
                    res.json({ accessToken: generateAccessToken(User), refreshToken: await generateRefreshToken(User) })
                }
                else {
                    res.json({ accessToken: generateAccessToken(User) })
                }
            }
            catch (err) {
                console.error(err);
            }

        }
        else {
            response.message = 'User does not exist';
            res.send(response);
        }
    })
})


app.get('/HomePage', authenticateToken, (req, res) => {
    console.log("hi");
    fs.readFile(path.join(dirName, '/Home-Page.html'), 'utf8', (err, htmlContent) => {
        if (err) {
            return res.status(500).send('Error reading the HTML file.');
        }
        const responseObj = {
            User: req.User,
            HTMLContent: htmlContent
        };
        res.json(responseObj)
    })
})


app.post('/token', (req, res) => {
  
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401)  
    pool.query(checkIfRefreshTokenIsInDatabase, [refreshToken], (err, results) => {
        if (err) {
            console.error(err); 
            return res.sendStatus(401)
        }
        else if (results.length > 0) {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
               
                if (err) return res.sendStatus(403)
                const accessToken = generateAccessToken({ user })
                res.json({ accessToken: accessToken })
            })
        }
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})


/////functions
function generateAccessToken(User) {
    return jwt.sign(User, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
async function generateRefreshToken(User) {
    let oldRefreshToken = await checkForRefreshToken(User.id);
    if (oldRefreshToken != null) {
        return oldRefreshToken;
    }
    let token = jwt.sign(User, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '90d' });
    return new Promise((resolve, reject) => {
        pool.query(refreshTokenAdd, [token, User.id], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        })
    })


}
function authenticateToken(req, res, next) {
    console.log('hi');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.sendStatus(401)
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, User) => {
        try {
            if (err) {
                console.log(err.message);
                res.sendStatus(403);
            }
            else {
                req.User = User;
                next();
            }
        }
        catch (error) {
            console.log(error);
        }
    })
}

async function checkForRefreshToken(id) {
    return new Promise((resolve, reject) => {
        pool.query(checkIfUserHasRefreshToken, [id], (err, results) => {
            if (err) {
                console.error(err);
                reject(err);
            } else if (results.length > 0) {
                resolve(results[0].Refresh_Tokens);
            } else {
                resolve(null);
            }
        });
    });
}

app.listen(port, () => {
    console.log("listening on port " + port);
})


////
app.get('/UserInfo', (req, res) => {
    pool.query('SELECT * FROM userinfo', (error, results) => {
        if (error) {
            return console.log(error)
        }
        for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < files.length; j++) {
                if (files[j].includes(results[i].Location)) {
                    results[i].FlagPath = files[j];
                    break;
                }
                else {
                    results[i].FlagPath = 'xx Unknown.svg';
                }
            }
        }
        let data = results;
        for (let i = 0; i < data.length; i++) {
            row += ` <tr>
        <td>${data[i].First_Name} ${data[i].Last_Name}</td>
        <td>${data[i].Email}</td>
        <td>${data[i].Skype}</td>
        <td>
            <img src="Images/Flags/${data[i].FlagPath}" alt=""> ${data[i].Location}
        </td>
        <td>${data[i].timeZone}</td>
        <td>${data[i].Role}</td>
        <td>
            <img src="Images/admin-profile-icon-edit.svg" alt="">
            <img src="Images/admin-profile-icon-card.svg" alt="">
        </td>
    </tr>
        `;
        }
    });
    res.send(row);
    console.log('Sent Data');
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
