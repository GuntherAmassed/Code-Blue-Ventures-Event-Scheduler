const nodemailer = require('nodemailer');
const port = 3100;
const express = require('express');
const cors = require('cors');
const ejs = require('ejs');
cors.all;
const app = express();
app.use(cors());
app.use(express.json());
const templatePath = 'Emailhopeitworks.ejs';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'moshe@zunta.com',
        pass: 'ikmkqzbrovvznoyo'
    }
});
app.post('/Email/NewUser', (res, req) => {
    console.log('hi about to send email');
    console.log(req);
    console.log(req.Email);
    console.log(req.body);
    console.log(req.EmailInfo);
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
app.listen(port, () => {
    console.log("listening on port " + port);
})

