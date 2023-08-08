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
const crytpo = require('crypto');
var path = require('path');
let dirName = 'C:/Users/Moshe Stern/Desktop/Figma Api/ZuntaTimes';
const jwt = require('jsonwebtoken');
app.use(express.static(dirName));
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
const cities = require('all-the-cities');
const lookup = require('country-code-lookup')
// const { DateTime } = require('luxon');



let FirstTime = true;
let FinalCountryIntialArray = [];
let fileNames = [];
let row = '';
const LogInQuery = `SELECT * FROM userinfo us WHERE us.Email=? AND us.Password=?;`;
const refreshTokenAdd = `INSERT INTO refresh_token(Refresh_Tokens,Id) VALUES(?,?);`;
const updateRefreshToken = `UPDATE refresh_token SET Refresh_Tokens=? WHERE id=?`
const checkIfRefreshTokenIsInDatabase = `SELECT * FROM refresh_token WHERE Refresh_Tokens=?;`;
const checkIfUserHasRefreshToken = `SELECT * FROM Refresh_Token WHERE refresh_token.id=?;`

/////calling

getCountries();
getFlagNames();
/////listeners
app.post('/MyProfile', (req, res) => {
    pool.query('SELECT lt.City_Name, us.Email,us.First_Name,us.Last_Name,us.Skype FROM locationtable lt JOIN userinfo us on us.location_Id = lt.GeoName_Id WHERE us.Id=?;', [req.body.Id], (error, results) => {
        if (error) {
            console.error(error)
        }
        else if (results.length > 0) {
            let userInfo = {
                Email: results[0].Email,
                First_Name: results[0].First_Name,
                Last_Name: results[0].Last_Name,
                Skype: results[0].Skype,
                City: results[0].City_Name
            }
            res.json(userInfo)
        }
    })
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
                let user = {
                    id: results[0].Id,
                    First_Name: results[0].First_Name,
                    Last_Name: results[0].Last_Name,
                    Skype: results[0].Skype,
                    Location_Id: results[0].location_Id,
                    Role: results[0].Role,
                };

                res.json({ accessToken: await generateRefreshTokenShort(user) })
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




app.post('/token', async (req, res) => {
    const Token = req.body.token;
    if (Token == null) return res.sendStatus(401)
    let checkDataBase = async () => {
        return await new Promise((resolve, reject) => {

            pool.query(checkIfRefreshTokenIsInDatabase, [Token], (err, results) => {
                if (err) {
                    console.log(err);
                    reject(er)

                }
                else if (results.length > 0) {
                    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        }
                        let data = {
                            user
                        }
                        resolve(data)

                    })
                }
                else {
                    reject(null);
                }

            })
        })
    }
    try {
        let data = await checkDataBase();
        res.json({ user: data.user });
    } catch (error) {
        console.log(error);
        res.json(null)
    }
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.sendStatus(204)
})

app.get('/UserInfo', (req, res) => {
    pool.query('SELECT * FROM locationtable lt JOIN userinfo ON userinfo.location_Id=lt.GeoName_Id ', async (error, results) => {
        if (error) {
            return console.log(error)
        }
        for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < files.length; j++) {
                if (files[j].split(' ')[0].includes(results[i].Country.toLowerCase())) {
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
            <img src="Images/Flags/${data[i].FlagPath}" alt=""> ${data[i].City_Name}
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
        res.send(row);
        console.log('Sent Data');
    });


})

app.post('/ClockAmount', (req, res) => {
    let clockAmount;
    let times = [];
    let clockFrame = '';
    let locationFrame = '';

    pool.query('SELECT lt.timeZone,lt.GeoName_Id,lt.Country,lt.City_Name FROM locationtable lt JOIN userinfo ON userinfo.location_Id=lt.GeoName_Id  GROUP BY userinfo.location_Id;', (error, results) => {
        if (error) {
            return res.sendStatus(401)
        }
        if (results.length > 0) {
            clockAmount = results.length;
            for (let i = 0; i < clockAmount; i++) {
                let CountryTest = lookup.byInternet(results[i].Country);
                if (CountryTest == null) {
                    CountryTest = results[i].Country;
                    console.log('null!');
                }
                else {
                    CountryTest = CountryTest.country
                }
                times.push({
                    timeZone: results[i].timeZone,
                    PlaceOfCity: results[i].City_Name,
                    PlaceOfCountry: CountryTest,
                    Hour: formatInTimeZone(today, results[i].timeZone, 'HH'),
                    Minute: formatInTimeZone(today, results[i].timeZone, 'mm'),
                    Second: formatInTimeZone(today, results[i].timeZone, 'ss'),
                    Day: formatInTimeZone(today, results[i].timeZone, 'EEEE')
                })
                clockFrame += ` <div class="clock-Frame">
            <div class="${formatInTimeZone(today, results[i].timeZone, 'aa') === 'AM' ? 'clock' : 'clock-Dark'}">

                <div class="middle">
                    <img src="Images/${formatInTimeZone(today, results[i].timeZone, 'aa') === 'AM' ? 'all-users-text.svg' : 'all-users-home-text.svg'}" alt="">
                    <div class="hour"></div>
                    <div class="minute"></div>
                    <div class="second"></div>
                </div>

            </div>

            <p class="Name-Of-Country"></p>
            <p class="Name-Of-City"></p>
            <p class="Day-Of-Week"></p>
        </div>`
                locationFrame += ` <div class="location-borders">${results[i].City_Name} - ${CountryTest}<span class="Hidden-Location-Id">${results[i].GeoName_Id}</span></div>`

            }
            res.json({ TimeZones: times, clockFrame: clockFrame, locationFrame: locationFrame });
        }
    });
})

app.post('/ZmanimApi', async (req, res) => {
    try {

        let start = [];
        let end = [];
        let StartOfHoliday = false;
        let StartDate = req.body.Date;
        let splitDate = StartDate.split('-');
        let EndDate = (Number(splitDate[0]) + 1) + '-01-01';
        let response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&mf=off&maj=on&start=${StartDate}&end=${EndDate}&geo=geoname&geonameid=${req.body.location}`);
        let responsedata = await response.json();
        let data = responsedata.items;

        for (let i = 0; i < data.length; i++) {


            if ('memo' in data[i]) {
                if (data[i].category === "candles" && StartOfHoliday === false) {
                    start.push(data[i]);
                    StartOfHoliday = true;
                }
                if (data[i].category === "havdalah") {
                    end.push(data[i]);
                    StartOfHoliday = false;
                }
            }
            else {
                if (data[i].category === "candles") {
                    start.push(data[i]);
                }
                else if (data[i].category === "havdalah") {
                    end.push(data[i]);
                }
            }
        }
        pool.query(`SELECT lt.timeZone, lt.City_Name, lt.Country FROM locationtable lt WHERE lt.GeoName_Id=?;`, [req.body.location], (error, results) => {
            if (error) {
                console.error(error)
            }
            else if (results.length > 0) {
                let CountryTest = lookup.byInternet(results[0].Country);
                if (CountryTest == null) {
                    CountryTest = results[0].Country;
                    console.log('null!');
                }
                else {
                    CountryTest = CountryTest.country
                }
                let timezoneofuser = results[0].timeZone;
                let CityOfUser = results[0].City_Name + '-' + CountryTest;
                for (let i = 0; i < start.length; i++) {
                    start[i].date = formatInTimeZone(start[i].date, timezoneofuser, 'yyyy-MM-dd HH:mm')
                }
                for (let i = 0; i < end.length; i++) {
                    end[i].date = formatInTimeZone(end[i].date, timezoneofuser, 'yyyy-MM-dd HH:mm')
                }

                let event = {
                    start: start,
                    end: end,
                }
                res.json({ event, timeForUser: new Date(formatInTimeZone(new Date(), timezoneofuser, 'yyyy-MM-dd hh:mm:ss aa')), CityOfUser: CityOfUser })
            }
        })

    }
    catch (error) {
        console.error(error)
    }

})



/////functions
async function generateRefreshToken(user) {
    let newToken;
    let oldRefreshToken = await checkForRefreshToken(user.id);
    if (oldRefreshToken != null) {
        jwt.verify(oldRefreshToken, process.env.ACCESS_TOKEN_SECRET, async (err) => {
            try {
                if (err) {
                    newToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                    let updateToken = async () => {
                        return await new Promise((resolve, reject) => {
                            pool.query(updateRefreshToken, [newToken, user.id], (err) => {
                                if (err) {
                                    reject(err)
                                }
                                else {
                                    resolve(newToken)
                                }
                            })
                        })
                    }
                    newToken = await updateToken;
                }
                else {
                    newToken = oldRefreshToken
                }
            }
            catch (error) {
                console.error(error);
            }
        })
        return newToken

    }
    else {
        let token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        return new Promise((resolve, reject) => {
            pool.query(refreshTokenAdd, [token, user.id], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            })
        })
    }


}


async function generateRefreshTokenShort(user) {
    let newToken;
    let oldRefreshToken = await checkForRefreshToken(user.id);
    if (oldRefreshToken != null) {
        jwt.verify(oldRefreshToken, process.env.ACCESS_TOKEN_SECRET, async (err) => {
            try {
                if (err) {
                    newToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                    let updateToken = async () => {
                        return await new Promise((resolve, reject) => {
                            pool.query(updateRefreshToken, [newToken, user.id], (err) => {
                                if (err) {
                                    reject(err)
                                }
                                else {
                                    resolve(newToken)
                                }
                            })
                        })
                    }
                    newToken = await updateToken();
                }
                else {
                    newToken = oldRefreshToken
                }
            }
            catch (error) {
                console.error(error);
            }
        })
        return newToken

    }
    else {
        let token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });  console.log(token);
        return new Promise((resolve, reject) => {
            pool.query(refreshTokenAdd, [token, user.id], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            })
        })
      
    }


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

////

app.listen(port, () => {
    console.log("listening on port " + port);
})




