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
const jwt = require('jsonwebtoken');
const fs = require('fs');
let files = fs.readdirSync(`Images/Flags`);
const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'new_password',
    database: 'loginforzunta',
    port: '3306'
});
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }

    console.log('Connected to database');

    // Release the connection back to the pool when done
    connection.release();
});

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
        pool.query('UPDATE userinfo SET Password=? WHERE Email=? AND Password=?', [req.body.NewPassword, req.body.Email, req.body.OldPassword], async (err) => {
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
app.post('/app/GetStates', (req, res) => {
    pool.query(`SELECT DISTINCT lt.State FROM locationstable lt WHERE  lt.Country_Full_Name=? ORDER BY lt.State ASC;`, [req.body.Country], (err, results) => {
        if (err) {
            console.error(err)
        }
        else if (results.length > 0) {
            let HtmlLocationCitiesFromCountriesFromDataBase = '';
            for (let i = 0; i < results.length; i++) {
                HtmlLocationCitiesFromCountriesFromDataBase += `<p class="State-Location">${results[i].State}</p>`
            }
            res.json({ StatesForCountry: HtmlLocationCitiesFromCountriesFromDataBase })
        }
        else {
            console.log('no data');
        }

    })
})
app.post('/app/GetCities', (req, res) => {

    pool.query(`SELECT lt.City_Name FROM locationstable lt WHERE lt.State=? AND lt.Country_Full_Name=? ORDER BY lt.City_Name ASC;`, [req.body.State, req.body.Country], (err, results) => {
        if (err) {
            console.error(err)
        }
        else if (results.length > 0) {
            let HtmlLocationCitiesFromCountriesFromDataBase = '';
            for (let i = 0; i < results.length; i++) {
                HtmlLocationCitiesFromCountriesFromDataBase += `<p class="City-Location">${results[i].City_Name}</p>`
            }
            res.json({ CitiesForCountry: HtmlLocationCitiesFromCountriesFromDataBase })
        }
        else {
            console.log('no data');
        }

    })
})
app.post('/app/GetLocationId', (req, res) => {
    console.log(req.body.City, req.body.State, req.body.Country);
    pool.query(`SELECT lt.GeoName_Id FROM locationstable lt WHERE lt.City_Name=? AND lt.State=? AND lt.Country_Full_Name=?`, [req.body.City, req.body.State, req.body.Country], (err, results) => {
        if (err) {
            console.error(err)
        }
        else if (results.length === 1) {
            let HtmlLocationCitiesFromCountriesFromDataBase = '';
            for (let i = 0; i < results.length; i++) {
                HtmlLocationCitiesFromCountriesFromDataBase += results[i].GeoName_Id
            }
            res.json({ IdForCountry: HtmlLocationCitiesFromCountriesFromDataBase })
        }
        else if (results.length > 1) {
            console.log('too much ids');
            res.json(null)
        }
        else {
            res.json(null)
            console.log('no data');
        }

    })
})


app.post('/app/Locations', (req, res) => {
    let HtmlLocationCitiesFromDataBase = '';
    let userInfo = '';
    pool.query('SELECT us.Role,lt.Country,lt.City_Name,lt.State,lt.Country_Full_Name,lt.GeoName_Id,us.timeZone, us.Email,us.First_Name,us.Last_Name,us.Skype FROM locationstable lt JOIN userinfo us on us.location_Id = lt.GeoName_Id WHERE us.Id=?;', [req.body.Id], async (error, results) => {
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
                City: results[0].City_Name,
                State: results[0].State,
                Country: results[0].Country_Full_Name,
                LocationID: results[0].GeoName_Id,
                FlagPath: results[0].FlagPath,
                Role: results[0].Role
            }


        }
        let queryLocations = async () => {
            return await new Promise((resolve, reject) => {
                pool.query('SELECT lt.Country,lt.Country_Full_Name,lt.timeZone FROM locationstable lt GROUP BY lt.Country_Full_Name ORDER BY `lt`.`Country_Full_Name` ASC;', (err, results) => {
                    if (err) {
                        reject(err)
                    }
                    else if (results.length > 0) {
                        resolve(results)
                    }
                    else {
                        reject({ error: 'no results' })
                    }
                })
            })
        }
        let LocationCitiesFromDataBase = await queryLocations();
        if (LocationCitiesFromDataBase.length > 0) {
            for (let i = 0; i < LocationCitiesFromDataBase.length; i++) {
                for (let j = 0; j < files.length; j++) {
                    if (files[j].split(' ')[0].includes(LocationCitiesFromDataBase[i].Country.toLowerCase())) {
                        LocationCitiesFromDataBase[i].FlagPath = files[j];
                        break;
                    }
                    else {
                        LocationCitiesFromDataBase[i].FlagPath = 'xx Unknown.svg';
                    }
                }


                HtmlLocationCitiesFromDataBase += `
            <p class="Location"><img id="Location-Image" src="Images/Flags/${LocationCitiesFromDataBase[i].FlagPath}" alt="">  ${LocationCitiesFromDataBase[i].Country_Full_Name} </p>`

            }
            res.json({ userInfo: userInfo, HtmlLocationCitiesFromDataBase: HtmlLocationCitiesFromDataBase })
        }
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
                    First_Name: results[0].First_Name,
                    Last_Name: results[0].Last_Name,
                    Skype: results[0].Skype,
                    Location_Id: results[0].location_Id,
                    Role: results[0].Role,
                };
                if (req.body.rememberMe === true) {
                    res.json({ accessToken: await generateRefreshToken(user) })
                }
                else {
                    res.json({ accessToken: await generateRefreshTokenShort(user) })
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

app.get('/app/UserInfo', (req, res) => {
    let row = '';
    pool.query('SELECT * FROM locationstable lt JOIN userinfo ON userinfo.location_Id=lt.GeoName_Id ORDER BY userinfo.First_Name; ', async (error, results) => {
        if (error) {
            return console.log(error)
        }
        for (let i = 0; i < results.length; i++) {
            for (let j = 0; j < files.length; j++) {
                if (files[j].split(' ')[0].includes(ct.getCountryForTimezone(results[i].timeZone).id.toLowerCase())) {
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
            <img src="Images/Flags/${data[i].FlagPath}" alt=""> ${data[i].City_Name}
        </td>
        <td>${data[i].timeZone}</td>
        <td>${data[i].Role}</td>
        <td>
            <img class="Edit-User" src="Images/admin-profile-icon-edit.svg" alt="">
            <img class="Delete-User" src="Images/admin-profile-icon-card.svg" alt="">
        </td>
    </tr>
        `;
        }
        res.send(row);
        console.log('Sent Data');
    });


})

app.post('/app/ClockAmount', (req, res) => {
    let clockAmount;
    let times = [];
    let clockFrame = '';
    let locationFrame = '';
    pool.query('SELECT lt.State, lt.timeZone,lt.GeoName_Id,lt.Country_Full_Name,lt.City_Name FROM locationstable lt JOIN userinfo ON userinfo.location_Id=lt.GeoName_Id  GROUP BY userinfo.location_Id;', (error, results) => {
        if (error) {
            return res.sendStatus(401)
        }
        if (results.length > 0) {
            clockAmount = results.length;
            for (let i = 0; i < clockAmount; i++) {

                times.push({
                    timeZone: results[i].timeZone,
                    PlaceOfCity: results[i].City_Name,
                    PlaceOfCountry: results[i].Country_Full_Name,
                    PlaceOfState: results[i].State,
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
                locationFrame += ` <div class="location-borders">${results[i].City_Name} - ${results[i].State} - ${results[i].Country_Full_Name}<span class="Hidden-Location-Id">${results[i].GeoName_Id}</span></div>`

            }
            res.json({ TimeZones: times, clockFrame: clockFrame, locationFrame: locationFrame });
        }
    });
})

app.post('/app/ZmanimApi', async (req, res) => {

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
        pool.query(`SELECT lt.timeZone, lt.City_Name,lt.State, lt.Country_Full_Name FROM locationstable lt WHERE lt.GeoName_Id=?;`, [req.body.location], (error, results) => {
            if (error) {
                console.error(error)
            }
            else if (results.length > 0) {
                let timezoneofuser = results[0].timeZone;
                let CityOfUser = results[0].City_Name + ' - ' + results[0].State + ' - ' + results[0].Country_Full_Name;
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
                let hours = new Date(formatInTimeZone(new Date(), results[0].timeZone, 'yyyy-MM-dd hh:mm:ss aa')).getHours();
                let minutes = new Date(formatInTimeZone(new Date(), results[0].timeZone, 'yyyy-MM-dd hh:mm:ss aa')).getMinutes();
                let seconds = new Date(formatInTimeZone(new Date(), results[0].timeZone, 'yyyy-MM-dd hh:mm:ss aa')).getSeconds();
                let days = new Date(formatInTimeZone(new Date(), results[0].timeZone, 'yyyy-MM-dd hh:mm:ss aa')).getDay()
                res.json({ event, CityOfUser: CityOfUser, hours: hours, minutes: minutes, seconds: seconds, days: days })
            }
            else {
                console.log('no data');

            }
        })

    }
    catch (error) {
        console.error(error)
    }

})

app.post('/app/SaveChanges', authenticate, (req, res) => {
    pool.query('SELECT timeZone FROM `locationstable` WHERE GeoName_Id=?;', [req.body.LocationId], (err, results) => {
        if (err) {
            console.log(err);
        }
        else if (results.length > 0) {
            pool.query('UPDATE userinfo SET Email=?,First_Name=?,Last_Name=?,Skype=?, timeZone=?, location_Id=? WHERE Id=?', [req.body.Email, req.body.FirstName, req.body.LastName, req.body.Skype, results[0].timeZone, req.body.LocationId, req.user.id], async (err) => {
                if (err) {
                    console.error(err)
                    res.json(null)
                }
                else {
                    let user = {
                        id: req.user.id,
                        First_Name: req.body.FirstName,
                        Last_Name: req.body.LastName,
                        Skype: req.body.Skype,
                        Location_Id: req.body.LocationId,
                        Role: req.user.Role
                    }
                    let token = await generateRefreshToken(user)
                    console.log(token);
                    res.json({ token })
                }
            })
        }

    })
})
app.post('/app/AddUser', authenticate, (req, res) => {
    console.log('hi');
    let tempPasswordUser = require('crypto').randomBytes(64).toString('hex');
    let name = req.body.FirstName + ' ' + req.body.LastName;
    let email = req.body.Email
    console.log(email, name, tempPasswordUser);
    let EmailInfo = {
        Email: email,
        Name: name,
        PasswordLink: `https://codebluetimes.com/SetUpPassword.html?token=${tempPasswordUser}&type=NewUser`
    }
    pool.query('SELECT timeZone FROM `locationstable` WHERE GeoName_Id=?;', [req.body.LocationId], (err, results) => {
        if (err) {
            console.log(err);
        }
        else if (results.length > 0) {
            pool.query('INSERT INTO userinfo (Email, First_Name, Last_Name, Skype, timeZone, Password, Role,location_Id) VALUES (?, ?, ?, ?, ?, ? ,? ,?);', [req.body.Email, req.body.FirstName, req.body.LastName, req.body.Skype, results[0].timeZone, tempPasswordUser, req.body.Role, req.body.LocationId], async (err) => {
                if (err) {
                    console.error(err)
                    res.json(null)
                }
                else {
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
            })
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
        else if (results.length > 0) {
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
    pool.query('SELECT Id,First_Name,Last_Name FROM userinfo WHERE Email=?;', [req.body.Email], (err, results) => {
        if (err) {
            res.json(null)
            console.error(err)
        }
        else if (results.length > 0) {
            Name = `${results[0].First_Name} ${results[0].Last_Name}`;
            let ResetInfo = {
                Email:req.body.Email,
                Name: 'hi',
                ResetTokenLink: `https://codebluetimes.com/SetUpPassword.html?token=${ResetToken}&type=ResetPassword`
            }
            console.log(results);// affectedRows
            pool.query('UPDATE reset_tokens SET Reset_Token=? WHERE Id =?', [ResetToken, results[0].Id], async (err, results) => {
                if (err) {
                    res.json(null)
                    console.error(err)
                }
                else {
                    console.log('inserted');
                    console.log(results);
                    console.log(ResetInfo);
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
            res.json(null)
        }
    })

})
app.post('/app/ResetPassword', (req, res) => {
    console.log(req.body.Password, req.body.ResetToken, req.body.Email);
    pool.query('SELECT Id FROM `userinfo` WHERE Email=?;'[req.body.Email], (err, results) => {
        if (err) {
            res.json(null)
            console.error(err)
        }
        else if (results.length > 0) {
            console.log(results);
            pool.query('SELECT * FROM reset_tokens WHERE Reset_Token=? AND Id = ?;', [req.body.ResetToken, results[0].Id], (err, results) => {
                if (err) {
                    res.json(null)
                    console.error(err)
                }
                else {
                    pool.query('UPDATE userinfo SET userinfo.Password=? WHERE userinfo.Id=? AND userinfo.Email=?', [req.body.Password, results[0].Id, req.body.Email], (err, results) => {
                        if (err) {
                            console.log(err);
                            res.json(null)
                        }
                        else if (results.length > 0) {
                            pool.query('DELETE FROM reset_tokens WHERE Id=? AND Reset_Token=?;', [results[0].Id, req.body.ResetToken], (err, results) => {
                                if (err) {
                                    res.json(null)
                                    console.error(err)
                                }
                                else {
                                    console.log(results);
                                    res.json('Reseted!')
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



