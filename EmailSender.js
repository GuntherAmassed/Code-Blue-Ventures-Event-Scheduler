const nodemailer = require('nodemailer');
const fs = require('fs');
let Html = fs.createReadStream(`EmailToSendToUser.html`);
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
    html:``,
attachments: [{
    filename: 'div.main-section-MainLandscape.png',
    path: 'Images/div.main-section-MainLandscape.png', // Update this to the correct image file path
    cid: 'unique@nodemailer.com', // Same cid value as in the html img src
  }]};

transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});