const nodemailer = require('nodemailer');
const port = 3100;
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
cors.all;
const { createPool } = require('mysql2');
const app = express();
app.use(cors());
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
app.use(express.json());
const cron = require('node-cron');
const templatePath = 'EmailTemplatesToSend/SetUpYourPassord.ejs';
const templatePathResetPassword = 'EmailTemplatesToSend/ResetPasswordEmail.ejs';
const templateTimes = 'EmailTemplatesToSend/CodeblueTimes.ejs'
const sunriseSunsetJs = require("sunrise-sunset-js");

//
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
//     connection.release();
// });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_SUPER_PASSWORD
    }
});
app.post('/Email/NewUser', (req, res) => {
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.body.Email,
        subject: 'Codeblue Times Sign up',
    }
    ejs.renderFile(templatePath, { username: req.body.Name, setupLink: req.body.PasswordLink }, (err, html) => {
        if (err) {
            console.error('Error rendering EJS template:', err);
            res.json(null)
            return;
        }
        mailOptions.html = html;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json(null)
            } else {
                console.log('Email sent: ' + info.response);
                res.json('Email sent: ' + info.response)
            }
        });
    });
})
app.post('/Email/ResetPassword', (req, res) => {
    console.log('hi there Reseterr');
    let mailOptions = {
        from: process.env.EMAIL,
        to: req.body.Email,
        subject: 'Codeblue Times Sign up',
    }
    ejs.renderFile(templatePathResetPassword, { username: req.body.Name, setupLink: req.body.ResetTokenLink }, (err, html) => {
        if (err) {
            console.error('Error rendering EJS template:', err);
            res.json(null)
            return;
        }
        mailOptions.html = html;
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.json(null)
            } else {
                console.log('Email sent: ' + info.response);
                res.json('Email sent: ' + info.response)
            }
        });
    });
})
// every thursday///test out with every 30seconds* * * * * *
cron.schedule('0 0 * * 4', async () => {

    console.log('shceudle');

    let yomtovstart = [{ date: '29 Elul', yomtov: 'Rosh Hashana' }, { date: '9 Tishrei', yomtov: 'Yom Kippur' }, { date: '14 Tishrei', yomtov: 'Succos' }, { date: '14 Nisan', yomtov: 'Pesach' }, { date: '5 Sivan', yomtov: 'Shavous' }]
    let yomtovend = ['2 Tishrei', '10 Tishrei', '23 Tishrei', '22 Nisan', '7 Sivan']
    let StartDate = new Date();
    let EndDate = new Date();
    EndDate.setDate(EndDate.getDate() + 14)//14 days ahead
    function Format(date) {
        return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    }
    pool.query('SELECT * FROM userinfo JOIN locationstable ON locationstable.Id=userinfo.Id', async (err, results) => {
        if (err) {
            console.error(err);
        }
        else if (results.length > 0) {
            for (let w = 0; w < results.length; w++) {
                let response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&start=${Format(StartDate)}&end=${Format(EndDate)}&geo=pos&latitude=${results[w].Latitude}&longitude=${results[w].Longitude}&tzid=${results[w].timeZone}&d=on`);
                let responsedata = await response.json();
                let items = {
                    Start: [],
                    End: [],
                    yomtov: {
                        Start: [],
                        End: []
                    }
                };
                let Cordinates = {
                    lat: results[w].Latitude,
                    lon: results[w].Longitude,
                    tzid: results[w].timeZone
                }
                let hebdate = []
                for (let i = 0; i < responsedata.items.length; i++) {
                    if (responsedata.items[i].category === 'hebdate') {
                        let addedDate = dayjs.tz(responsedata.items[i].date, Cordinates.tzid);
                        hebdate.push({ date: addedDate, hdate: responsedata.items[i].hdate })
                    }
                }
                for (let i = 0; i < 7; i++) {///shabbos
                    if (hebdate[i].date.day() === 6) {
                        items.End.push(hebdate[i])
                    }
                    else if (hebdate[i].date.day() === 5) {
                        let theDate = hebdate[i]
                        theDate.EventName = 'Sabbath'
                        items.Start.push(theDate);
                    }
                }
                for (let i = 0; i < hebdate.length; i++) {////yomtov
                    for (let j = 0; j < yomtovstart.length; j++) {
                        if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovstart[j].date) {
                            let theDateofyomtov = hebdate[i]
                            theDateofyomtov.EventNameofyomtov = yomtovstart[j].yomtov;
                            items.yomtov.Start.push(theDateofyomtov)
                        }
                        else if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovend[j]) {
                            items.yomtov.End.push(hebdate[i])
                        }
                    }
                }
                let Name = `${results[w].First_Name} ${results[w].Last_Name}`;
                pushItems(items, Cordinates)
                pushItems(items.yomtov, Cordinates)
                function pushItems(items, Cordinates) {
                    for (let k = 0; k < items.End.length; k++) {
                        try {
                            if (k < items.Start.length) {
                                if (items.Start[k] !== undefined) {
                                    items.Start[k].timeOfEvent = sunriseSunsetJs.getSunset(Cordinates.lat, Cordinates.lon, new Date(items.Start[k].date.year(), items.Start[k].date.month(), items.Start[k].date.date()));
                                    items.Start[k].timeOfEvent.setMinutes(items.Start[k].timeOfEvent.getMinutes() - 18);
                                    items.Start[k].timeOfEvent = getTimeOfEvent(items.Start[k].timeOfEvent, Cordinates.tzid);
                                }
                            }
                            if (items.End[k] !== undefined) {
                                items.End[k] = sunriseSunsetJs.getSunset(Cordinates.lat, Cordinates.lon, new Date(items.End[k].date.year(), items.End[k].date.month(), items.End[k].date.date()));
                                items.End[k].setMinutes(items.End[k].getMinutes() + 72);
                                items.End[k] = getTimeOfEvent(items.End[k], Cordinates.tzid);
                            }
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }
                }

                items.CityName = results[w].City_Name.split(',')[0]+' '+results[w].City_Name.split(',')[results[w].City_Name.split(',').length-1];
                items.yomtov.Start.forEach(e => items.Start.push({timeOfEvent:e.timeOfEvent,EventName: e.EventNameofyomtov}))
                items.yomtov.End.forEach(e => items.End.push(e))
                let mailOptions = {
                    from: process.env.EMAIL,
                    to: results[w].Email,
                    subject: 'Code Blue Times',
                }
                ejs.renderFile(templateTimes, { username: Name, items: items }, (err, html) => {
                    if (err) {
                        console.error('Error rendering EJS template:', err);
                        res.json(null)
                        return;
                    }
                    mailOptions.html = html;
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                            res.json(null)
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                            res.json('Email sent: ' + info.response)
                        }
                    });

                })
            }
        }
    })
})

app.listen(port, () => {
    console.log("listening on port " + port);
})


// function isObjectEmpty(obj) {
//     const keys = Object.keys(obj);
//     return keys.length === 0;
// }

function getTimeOfEvent(date, tzid) {
    let now = dayjs.tz(date, tzid).format('ddd, MMM DD, h:mm A');
    let nowSplit = []
    for (let i = 0; i < now.split(',').length; i++) {
        nowSplit.push(now.split(',')[i])
    }
    return nowSplit;
}

