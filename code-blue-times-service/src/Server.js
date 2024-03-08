'use strict';
const port = 3000;
const { find } = require('geo-tz')
const sunriseSunsetJs = require("sunrise-sunset-js")
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
const jwt = require('jsonwebtoken');
const fs = require('fs');
let files = fs.readdirSync('src/Images/Flags');
const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    password: process.env.DATA_BASE_PASSWORD,
    database: 'loginforzunta',
    port: '3306'
});
// pool.getConnection((err, connection) => {
//     if (err) {
//         console.error('Error connecting to database:', err);
//         return;
//     }

//     console.log('Connected to database');

//     // Release the connection back to the pool when done
//     connection.release();
// });

let FinalCountryIntialArray = [];
let fileNames = [];
const LogInQuery = `SELECT * FROM userinfo us WHERE us.Email=? AND us.Password=?;`;
const refreshTokenAdd = `INSERT INTO refresh_token(Refresh_Tokens,Id) VALUES(?,?);`;
const updateRefreshToken = `UPDATE refresh_token SET Refresh_Tokens=? WHERE id=?`
const checkIfRefreshTokenIsInDatabase = `SELECT * FROM refresh_token WHERE Refresh_Tokens=?;`;
const checkIfUserHasRefreshToken = `SELECT * FROM refresh_token WHERE refresh_token.id=?;`

/////calling
getCountries();
getFlagNames();
/////listeners
app.post('/app/ChangePassword', authenticate, (req, res) => {
    if (req.body.NewPassword === req.body.ConfirmNewPassword) {
        pool.query('UPDATE userinfo SET Password=? WHERE Id=? AND Password=?', [req.body.NewPassword, req.body.Id, req.body.OldPassword], async (err) => {
            if (err) {
                console.error(err)
                res.json(null)
            }
            else {
                console.log('Changed');
                res.json('Changed')
            }
        })
    }
    else {
        res.json(null)
    }

})
app.post('/app/Locations', (req, res) => {
    let userInfo = '';
    pool.query('SELECT * FROM userinfo us JOIN locationstable lt ON us.Id= lt.Id  WHERE us.Id=?;', [req.body.Id], async (error, results) => {
        if (error) {
            console.error(error)
        }
        else if (results.length > 0) {
            for (let j = 0; j < files.length; j++) {
                if (files[j].split(' ')[0].includes(results[0].Country.toLowerCase())) {
                    results[0].FlagPath = files[j];
                    break;
                }
                else {
                    results[0].FlagPath = 'xx Unknown.svg';
                }
            }
            userInfo = {
                Email: results[0].Email,
                First_Name: results[0].First_Name,
                Last_Name: results[0].Last_Name,
                Skype: results[0].Skype,
                FlagPath: results[0].FlagPath,
                Role: results[0].Role,
                Latitude: results[0].Latitude,
                Longtitude: results[0].Longitude,
                timeZone: results[0].timeZone,
                City: results[0].City_Name,
                Country: results[0].Country,
                Id: results[0].Id
            }

        }
        res.json({ userInfo: userInfo })
    })
})

app.post('/app/LogIn', (req, res) => {
    pool.query(LogInQuery, [req.body.Email, req.body.Password], async (error, results) => {
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
                };
                res.json({ accessToken: await generateRefreshToken(user) })
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




app.post('/app/token', async (req, res) => {
    const Token = req.body.token;
    if (Token == null) return res.sendStatus(401)
    let checkDataBase = async () => {
        return await new Promise((resolve, reject) => {

            pool.query(checkIfRefreshTokenIsInDatabase, [Token], (err, results) => {
                if (err) {
                    console.log(err);
                    reject(err)

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
                        pool.query('SELECT * FROM userinfo WHERE Id=?', [data.user.id], (err, results) => {
                            if (err) {
                                console.log(err);
                                reject(err)
                            }
                            else if (results.length > 0) {
                                data.user = results
                                resolve(data)
                            }
                            else {
                                reject(null)
                            }
                        })


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

app.delete('/app/logout', authenticate, (req, res) => {
    pool.query('DELETE FROM refresh_token WHERE Id=?;', [req.user.id], (error) => {
        if (error) {
            console.error(error)
        }
        else {
            console.log('deleted');
            res.json('deleted')
        }
    })

})

app.post('/app/UserInfo', (req, res) => {
    let row = '';
    pool.query(`SELECT * FROM locationstable lt JOIN userinfo ON userinfo.Id=lt.Id ORDER BY ${req.body.SortBy}; `, async (error, results) => {
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
        <td>${data[i].Email}<span class= "Id-Of-User hidden">${data[i].Id}</span></td>
        <td>${data[i].Skype}</td>
        <td>
          <span> <img src="Images/EmailImages/Flags/${data[i].FlagPath}" alt=""><span class="Normal-span">${ParseCity(data[i].City_Name)}</span></span> 
        </td>
        <td>${new Date().toLocaleTimeString('en-US', { timeZone: data[i].timeZone, timeZoneName: 'short' }).split(' ')[2]}</td>
        <td>${data[i].Role}</td>
        <td>
        <div class='EditDeleteDiv'>
            <img class="Edit-User" src="Images/EmailImages/admin-profile-icon-edit.svg" alt="">
            <img class="Delete-User" src="Images/EmailImages/admin-profile-icon-card.svg" alt="">
            </div>
        </td>
    </tr>
        `;
        }
        res.send(row);
        console.log('Sent Data');
    });


})

app.post('/app/ClockAmount', (req, res) => {
    let clockAmount = 0;
    let times = [];
    let clockFrame = '';
    let locationFrame = '';
    pool.query('SELECT City_Name, MAX(Id) AS Id, MAX(timeZone) AS timeZone FROM locationstable GROUP BY City_Name;', (error, results) => {
        if (error) {
            return res.sendStatus(401)
        }
        if (results.length > 0) {

            clockAmount = results.length
            console.log(clockAmount);
            for (let i = 0; i < clockAmount; i++) {
                let fullcityName = ''
                for (let p = 0; p < results[i].City_Name.split(',').length; p++) {
                    if (p === 0 || p === results[i].City_Name.split(',').length - 1) {
                        fullcityName += results[i].City_Name.split(',')[p]
                    }
                }
                times.push({
                    timeZone: results[i].timeZone,
                    PlaceOfCity: results[i].City_Name,
                })
                //    let Day = new Date(currentTime).toLocaleString('en-US', { timeZone: TimeZones[i].timeZone, dayPeriod:'long' })//get period of day

                clockFrame += ` <div class="clock-Frame">
            <div class="${formatInTimeZone(today, results[i].timeZone, 'aa') === 'AM' ? 'clock' : 'clock-Dark'}">

                <div class="middle">
                    <img src="Images/EmailImages/${formatInTimeZone(today, results[i].timeZone, 'aa') === 'AM' ? 'all-users-text.svg' : 'all-users-home-text.svg'}" alt="">
                    <div class="point"></div>
                    <div class="hour"></div>
                    <div class="minute"></div>
                    <div class="second"></div>
                </div>

            </div>

            <p class="Name-Of-City"></p>
            <p class='Time-And-Day-Clock'><span class='Day-Of-Week'></span> <span class='digital-clock'></span></p>
            <p class='Time-Dif-To-Local'><span class='Day-Of-Local'></span> <span class='Time-dif'></span></p>
        </div>`
                locationFrame += ` <div class="location-borders">${fullcityName}<span class="Hidden-Location-Id">${results[i].Id}</span></div>`

            }
            res.json({ TimeZones: times, clockFrame: clockFrame, locationFrame: locationFrame });
        }
    });
})

app.post('/app/ZmanimApi', async (req, res) => {

    try {
        let LocationOfUserQuery = async () => {
            return await new Promise((resolve, reject) => {
                pool.query('SELECT * FROM `locationstable` WHERE Id = ?;', [req.body.location], (err, results) => {
                    if (err) {
                        console.err(err);
                        reject(null)
                    }
                    else if (results.length > 0) {

                        let LocationInfo = {
                            Latitude: results[0].Latitude,
                            Longtitude: results[0].Longitude,
                            timeZone: results[0].timeZone,
                            CityOfUser: results[0].City_Name
                        }
                        resolve(LocationInfo)
                    }
                })
            }
            )
        }
        let LocationInfo = await LocationOfUserQuery()
        let StartDate = req.body.Date;
        let splitDate = StartDate.split('-');
        let EndDate = `${(Number(splitDate[0]) + (req.body.nextYear === 0 ? 1 : req.body.nextYear))}-01-01`;
        let response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&start=${StartDate}&end=${EndDate}&geo=pos&latitude=${LocationInfo.Latitude}&longitude=${LocationInfo.Longtitude}&tzid=${LocationInfo.timeZone}&d=on`);
        let responsedata = await response.json();
        let data = responsedata.items;
        let start = []
        let end = []
        let hebdate = []
        let yomtovstart = [{ date: '29 Elul', yomtov: 'Rosh Hashana' }, { date: '9 Tishrei', yomtov: 'Yom Kippur' }, { date: '14 Tishrei', yomtov: 'Succos' }, { date: '14 Nisan', yomtov: 'Pesach' }, { date: '5 Sivan', yomtov: 'Shavous' }]
        let yomtovend = ['2 Tishrei', '10 Tishrei', '23 Tishrei', '22 Nisan', '7 Sivan']
        let englishyomtovstart = [];
        let englishyomtovend = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].category === 'havdalah') {
                end.push(data[i])
            }
            if (data[i].category === 'candles') {
                start.push(data[i])
            }
            if (data[i].category === 'hebdate') {
                hebdate.push(data[i])
            }
        }
        let Cordinates = {
            lat: LocationInfo.Latitude,
            lon: LocationInfo.Longtitude,
            tzid: LocationInfo.timeZone,
            CityOfUser: LocationInfo.CityOfUser
        }
        for (let i = 0; i < hebdate.length; i++) {
            for (let j = 0; j < yomtovstart.length; j++) {

                if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovstart[j].date) {
                    let sunsetStartOfYomTov = sunriseSunsetJs.getSunset(Cordinates.lat, Cordinates.lon, new Date(hebdate[i].date));
                    sunsetStartOfYomTov.setMinutes(sunsetStartOfYomTov.getMinutes() - 18);
                    let FormattedYomTov = {
                        date: sunsetStartOfYomTov,
                        yomtov: yomtovstart[j].yomtov
                    }
                    englishyomtovstart.push(FormattedYomTov)
                }
                if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovend[j]) {
                    let sunsetEndOfYomTov = sunriseSunsetJs.getSunset(Cordinates.lat, Cordinates.lon, new Date(hebdate[i].date));
                    sunsetEndOfYomTov.setMinutes(sunsetEndOfYomTov.getMinutes() + 72);
                    let FormattedYomTovEnd = {
                        date: sunsetEndOfYomTov
                    }
                    englishyomtovend.push(FormattedYomTovEnd)
                }
            }
        }

        for (let i = 0; i < start.length; i++) {
            start[i].date = sunriseSunsetJs.getSunset(Cordinates.lat, Cordinates.lon, new Date(start[i].date));
            start[i].date.setMinutes(start[i].date.getMinutes() - 18);
        }
        for (let i = 0; i < end.length; i++) {
            end[i].date = sunriseSunsetJs.getSunset(Cordinates.lat, Cordinates.lon, new Date(end[i].date))
            end[i].date.setMinutes(end[i].date.getMinutes() + 72);
        }
        let event = {
            start: start,
            end: end,
            englishyomtovend: englishyomtovend,
            englishyomtovstart: englishyomtovstart
        }
        res.json({ event, CityOfUser: Cordinates.CityOfUser, timezone: Cordinates.tzid });

    }
    catch (error) {
        console.error(error)
    }

})

app.post('/app/SaveChanges', authenticate, (req, res) => {
    console.log(req.body);
    pool.query('SELECT * FROM userinfo WHERE Id =?', [req.body.Id], (err, result) => {
        if (err) {
            res.json(null)
        }
        else if (result.length > 0) {
            let updateQuery = ''
            let values = ''
            console.log(result[0].Email, req.body.Email);
            console.log(result[0].Email === req.body.Email);
            console.log(req.body.Role);
            if (result[0].Email === req.body.Email) {
                if (req.body.Role == null) {
                    updateQuery = 'UPDATE userinfo SET  First_Name=?,Last_Name=?,Skype=? WHERE Id=?'
                    values = [req.body.FirstName,
                    req.body.LastName,
                    req.body.Skype,
                    req.body.Id]
                }
                else {
                    updateQuery = 'UPDATE userinfo SET  First_Name=?,Last_Name=?,Skype=?, Role=? WHERE Id=?'
                    values = [req.body.FirstName,
                    req.body.LastName,
                    req.body.Skype,
                    req.body.Role,
                    req.body.Id]
                }

            }
            else {
                if (req.body.Role == null) {

                    updateQuery = 'UPDATE userinfo SET Email=?, First_Name=?,Last_Name=?,Skype=? WHERE Id=?'
                    values = [req.body.Email,
                    req.body.FirstName,
                    req.body.LastName,
                    req.body.Skype,
                    req.body.Id]
                }
                else {
                    updateQuery = 'UPDATE userinfo SET Email=?, First_Name=?,Last_Name=?,Skype=?,Role=? WHERE Id=?'
                    values = [req.body.Email,
                    req.body.FirstName,
                    req.body.LastName,
                    req.body.Skype,
                    req.body.Role,
                    req.body.Id]
                }

            }
            console.log(updateQuery);
            console.log(values);
            pool.query(updateQuery, values, (err, result) => {
                if (err) {
                    console.error(err)
                    res.json(null)
                }
                else if (result.affectedRows > 0) {
                    console.log(result);
                    console.log('here');
                    console.log(find(req.body.Latitude, req.body.Longtitude), req.body.CityName, req.body.Country, req.body.Latitude, req.body.Longtitude, req.body.Id);
                    pool.query('UPDATE locationstable SET timeZone=?,City_Name=?, Country=?,Latitude=?,Longitude=? WHERE Id=?', [find(req.body.Latitude, req.body.Longtitude), req.body.CityName, req.body.Country, req.body.Latitude, req.body.Longtitude, req.body.Id], async (err) => {
                        if (err) {
                            console.error(err)
                            res.json(null)
                        }
                        else if (result.affectedRows > 0) {
                            console.log('final');
                            // let user = {
                            //     id: req.user.id,
                            // };
                            // let token = await generateRefreshToken(user)
                            // console.log(token);
                            res.json('done')
                        }
                        else {
                            res.json(null)
                        }
                    })
                }
                else {
                    res.json(null)
                }
            })
        }
        else {
            res.json(null)
        }

    })

})
app.post('/app/AddUser', authenticate, (req, res) => {
    let tempPasswordUser = require('crypto').randomBytes(64).toString('hex');
    let name = req.body.FirstName + ' ' + req.body.LastName;
    let email = req.body.Email
    console.log(req.body.Email, req.body.FirstName, req.body.LastName, req.body.Skype, tempPasswordUser, req.body.Role);
    let EmailInfo = {
        Email: email,
        Name: name,
        PasswordLink: `https://codebluetimes.com/SetUpPassword.html?token=${tempPasswordUser}&type=NewUser`
    }
    pool.query('INSERT INTO userinfo (Email, First_Name, Last_Name, Skype,  Password, Role) VALUES (?, ?, ?, ?, ?, ?);', [req.body.Email, req.body.FirstName, req.body.LastName, req.body.Skype, tempPasswordUser, req.body.Role], async (err, results) => {
        if (err) {
            console.error(err)
            res.json(null)
        }
        else if (results.affectedRows > 0) {
            console.log('hi ther');
            pool.query('SELECT Id FROM userinfo WHERE userinfo.Email=?', [req.body.Email], (err, results) => {
                if (err) {
                    console.error(err)
                    res.json(null)
                }
                else if (results.length > 0) {
                    console.log(find(req.body.Latitude, req.body.Longtitude)[0], req.body.Country, req.body.CityName, req.body.Latitude, req.body.Longtitude, results[0].Id);
                    pool.query('INSERT INTO locationstable ( timeZone,Country,City_Name,Latitude,Longitude,Id) VALUES(?,?,?,?,?,?)', [find(req.body.Latitude, req.body.Longtitude)[0], req.body.Country, req.body.CityName, req.body.Latitude, req.body.Longtitude, results[0].Id], async (err, results) => {
                        if (err) {
                            console.error(err)
                            res.json(null)
                        }
                        else if (results.affectedRows > 0) {
                            console.log('gain');
                            let SendEmail = await fetch('https://codebluetimes.com/Email/NewUser', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(EmailInfo)
                            })
                            let responseSendEmail = await SendEmail.json()
                            if (responseSendEmail == null) {
                                res.json(null)
                            }
                            else {
                                res.json('added and sent email')
                                console.log("added");
                            }
                        }
                        else {
                            res.json(null)
                        }
                    })
                }
                else {
                    res.json(null)
                }
            })


        }
        else {
            res.json(null)
        }
    })
})
app.post('/app/DeleteUser', (req, res) => {
    pool.query('DELETE FROM userinfo WHERE Id=?', [req.body.Id], (err) => {
        if (err) {
            console.log(err);
            res.json(null)
        }
        else {
            console.log('Deleted');
            res.json('Deleted')
        }
    })
})
app.post('/app/NewPasswordChange', (req, res) => {
    console.log(req.body.Password, req.body.queryString, req.body.Email);
    pool.query('UPDATE userinfo SET userinfo.Password=? WHERE userinfo.Password=? AND userinfo.Email=?', [req.body.Password, req.body.queryString, req.body.Email], (err, results) => {
        if (err) {
            console.log(err);
            res.json(null)
        }
        else if (results.affectedRows > 0) {
            console.log(results);
            console.log('Set up');
            res.json('Changed')
        }
        else {
            res.json(null)
        }
    })
})
app.post('/app/ResetPasswordRequest', (req, res) => {
    let ResetToken = require('crypto').randomBytes(64).toString('hex');
    let Name = '';
    console.log(req.body.Email);
    pool.query('SELECT Id,First_Name,Last_Name FROM userinfo WHERE Email=?;', [req.body.Email], async (err, results) => {
        if (err) {
            res.json(null)
            console.error(err)
        }
        else if (results.length > 0) {
            Name = `${results[0].First_Name} ${results[0].Last_Name}`;
            let id = results[0].Id;
            let ResetInfo = {
                Email: req.body.Email,
                Name: Name,
                ResetTokenLink: `https://codebluetimes.com/SetUpPassword.html?token=${ResetToken}&type=ResetPassword`
            }
            pool.query('SELECT Reset_Token FROM reset_tokens WHERE Id=?', [id], (err, results) => {
                if (err) {
                    res.json(null)
                    console.error(err)
                }
                else if (results.length > 0) {

                    pool.query('UPDATE reset_tokens SET Reset_Token=? WHERE Id =?', [ResetToken, id], async (err, results) => {
                        if (err) {
                            res.json(null)
                            console.error(err)
                        }
                        else if (results.affectedRows > 0) {
                            console.log('inserted');
                            console.log(results);


                            console.log(results);// affectedRows
                            let SendEmail = await fetch('https://codebluetimes.com/Email/ResetPassword', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(ResetInfo)
                            })
                            let responseSendEmail = await SendEmail.json()
                            if (responseSendEmail == null) {
                                res.json(null)
                            }
                            else {
                                res.json('added and sent email')
                                console.log("added");
                            }
                        }
                    })
                }
                else {
                    pool.query('INSERT INTO reset_tokens  (Reset_Token, Id) VALUES(?,?)', [ResetToken, id], async (err, results) => {
                        if (err) {
                            res.json(null)
                            console.error(err)
                        }
                        else if (results.affectedRows > 0) {
                            console.log('inserted');
                            console.log(results);

                            console.log(results);// affectedRows
                            let SendEmail = await fetch('https://codebluetimes.com/Email/ResetPassword', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(ResetInfo)
                            })
                            let responseSendEmail = await SendEmail.json()
                            if (responseSendEmail == null) {
                                res.json(null)
                            }
                            else {
                                res.json('added and sent email')
                                console.log("added");
                            }
                        }
                    })
                }
            })

        }
        else {
            res.json(null)
        }
    })

})
app.post('/app/ResetPassword', (req, res) => {
    console.log(req.body.Password, req.body.ResetToken, req.body.Email);
    let id = ''
    pool.query('SELECT Id FROM `userinfo` WHERE Email=?;', [req.body.Email], (err, results) => {
        if (err) {
            res.json(null)
            console.error(err)
        }
        else if (results.length > 0) {
            id = results[0].Id;
            pool.query('SELECT * FROM reset_tokens WHERE Reset_Token=? AND Id = ?;', [req.body.ResetToken, id], (err) => {
                if (err) {
                    res.json(null)
                    console.error(err)
                }
                else {
                    pool.query('UPDATE userinfo SET userinfo.Password=? WHERE userinfo.Id=? AND userinfo.Email=?', [req.body.Password, id, req.body.Email], (err, results) => {
                        if (err) {
                            console.log(err);
                            res.json(null)
                        }
                        else if (results.affectedRows > 0) {
                            console.log(results);
                            pool.query('DELETE FROM reset_tokens WHERE Id=? AND Reset_Token=?;', [id, req.body.ResetToken], (err, results) => {
                                if (err) {
                                    res.json(null)
                                    console.error(err)
                                }
                                else if (results.affectedRows > 0) {
                                    console.log('Reseted!');
                                    console.log(results);
                                    res.json('Reseted!')
                                }
                                else {
                                    res.json(null)
                                }
                            })
                        }
                        else {
                            res.json(null)
                        }

                    })
                }
            })
        }
        else {
            res.json(null)
        }
    })

})


/////functions
function ParseCity(city) {
    if (city.includes(',')) {
        let citysplit = []
        for (let i = 0; i < city.split(',').length; i++) {
            if (i === 0 || i === city.split(',').length - 1) {
                citysplit.push(city.split(',')[i])
            }
        }
        return citysplit;
    }
    else {
        return city;
    }
}
function authenticate(req, res, next) {
    jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error(err)
            res.json(err)
        }
        else {
            req.user = user;
            next()
        }
    })
}
async function generateRefreshToken(user) {
    let newToken;
    let oldRefreshToken = await checkForRefreshToken(user.id);
    if (oldRefreshToken != null) {
        newToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '90d' });
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
        return newToken
    }
    else {
        let token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '90d' });
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
        let token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' }); console.log(token);
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



