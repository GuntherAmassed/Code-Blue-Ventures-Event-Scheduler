const nodemailer = require('nodemailer');
const fs = require('fs');
let Html = fs.createReadStream(`Emailhopeitworks.html`);
const port = 3100;
const express = require('express');
const cors = require('cors');
cors.all;
const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'moshe@zunta.com',
        pass: 'ikmkqzbrovvznoyo'
    }
});
app.post('/NewUser',(res,req)=>{
const mailOptions = {
    from: 'moshe@zunta.com',
    to: req.body.Email,
    subject: 'Codeblue Times Sign up',
    html: Html,
    attachments: [{
        filename: 'CODEBLUE TIME.png',
        path: 'CODEBLUE TIME.png',
        cid: 'CodeBlue@nodemailer.com',
    },
    {
        filename: 'Screenshot 2023-08-16 140532.png',
        path: 'Screenshot 2023-08-16 140532.png',
        cid: 'Screen@nodemailer.com',
    }],
}

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});

})
app.listen(port, () => {
    console.log("listening on port " + port);
})

