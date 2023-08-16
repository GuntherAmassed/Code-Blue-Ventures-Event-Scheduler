const nodemailer = require('nodemailer');
const fs = require('fs');
let Html = fs.createReadStream(`Emailhopeitworks.html`);
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'moshe@zunta.com',
        pass: 'ikmkqzbrovvznoyo'
    }
});
const mailOptions = {
    from: 'moshe@zunta.com',
    to: 'moshe9012@gmail.com',
    subject: '7',
    text: 'That was easy!',
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