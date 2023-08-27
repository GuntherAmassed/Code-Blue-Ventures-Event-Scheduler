const nodemailer = require('nodemailer');
const port = 3100;
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
cors.all;
const app = express();
app.use(cors());
app.use(express.json());
const cron = require('node-cron');
// const fs= require('fs');
// let Html=fs.ReadStream('try.html')
const templatePath = 'Emailhopeitworks.ejs';
const templatePathResetPassword = 'ResetPasswordEmail.ejs';
const templateTimes = 'CodeblueTimes.ejs'

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
    connection.release();
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'moshe@zunta.com',
        pass: 'ikmkqzbrovvznoyo'
    }
});
app.post('/Email/NewUser', (req, res) => {
    let mailOptions = {
        from: 'moshe@zunta.com',
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
        from: 'moshe@zunta.com',
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

cron.schedule('0 0 1 * *', async () => {
    console.log('shceudle');
    let response = await fetch(`https://www.hebcal.com/hebcal?v=1&cfg=json&year=now&month=${new Date().getMonth()}geo=geoname&geonameid=3448439&d=on&D=on`);//get yom tovs for the month
    let responsedata = await response.json();
    let hebdate = []
    let englishyomtovstart = []
    let englishyomtovend = []
    let yomtovstart = [{ date: '29 Elul', yomtov: 'Rosh Hashana' }, { date: '9 Tishrei', yomtov: 'Yom Kippur' }, { date: '14 Tishrei', yomtov: 'Succos' }, { date: '14 Nisan', yomtov: 'Pesach' }, { date: '5 Sivan', yomtov: 'Shavous' }]
    let yomtovend = ['2 Tishrei', '10 Tishrei', '23 Tishrei', '22 Nisan', '7 Sivan']
    for (elem of responsedata.items) {
        if (elem.category === 'hebdate') {
            hebdate.push(elem)
        }
    }
    for (let i = 0; i < hebdate.length; i++) {
        for (let j = 0; j < yomtovstart.length; j++) {

            if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovstart[j].date) {
                hebdate[i].yomtov = yomtovstart[j].yomtov;
                englishyomtovstart.push(hebdate[i])
            }
            if (hebdate[i].hdate.split(' ')[0] + ' ' + hebdate[i].hdate.split(' ')[1] === yomtovend[j]) {
                englishyomtovend.push(hebdate[i])
            }
        }
    }

    pool.query('SELECT Email,City_Name,First_Name,Last_Name FROM userinfo WHERE Role=User;', (err, results) => {
        if (err) {
            console.error(err);
        }
        else if (results.length > 0) {
            for (let j = 0; j < results.length; j++) {
                let Name = `${results[j].First_Name} ${results[j].Last_Name}`;

                for (let i = 0; i < englishyomtovstart.length; i++) {
                    cron.schedule(`0 0 ${new Date(englishyomtovstart[i].date).getDate()} ${new Date(englishyomtovstart[i].date).getMonth()} *`, () => {
                        let mailOptions = {
                            from: 'moshe@zunta.com',
                            to: results[j].Email,
                            subject: 'Code Blue Times',
                        }
                        ejs.renderFile(templateTimes, { username: Name, EventName: englishyomtovstart[i].yomtov, CityName: results[j].City_Name, Start: new Date(englishyomtovstart[i].date).toLocaleDateString('en-us', { weekday: "short", month: "long", day: "numeric" }), End: new Date(englishyomtovend[i].date).toLocaleDateString('en-us', { weekday: "short", month: "long", day: "numeric" }) }, (err, html) => {
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
                        });
                    })

                }
            }

        }
    })
})

app.listen(port, () => {
    console.log("listening on port " + port);
})

