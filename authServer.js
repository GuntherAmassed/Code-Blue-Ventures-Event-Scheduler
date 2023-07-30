const port = 4000;
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { createPool } = require('mysql2');
cors.all;
const app = express();
app.use(cors());
app.use(express.json());
var path = require('path');
let dirName = 'C:/Users/Moshe Stern/Desktop/Figma Api/ZuntaTimes';
const jwt = require('jsonwebtoken');
app.use(express.static(dirName));

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loginforzunta'
});
const LogInQuery = `SELECT * FROM userinfo us WHERE us.Email=? AND us.Password=?;`;


app.post('/LogIn', (req, res) => {
    pool.query(LogInQuery, [req.body.Email, req.body.Password], (error, results, fields) => {
        let response = {
            message: '',
            UserData: ''

        }
        if (error) {
            console.error(error.message);
            response.message = 'Error connecting to Database';
            res.send(response);
        } else if (results.length > 0) {
            response.UserData=results;
            let User=response.UserData;
            const accessToken = generateAccessToken(User)
            const refreshToken = jwt.sign(User, process.env.REFRESH_TOKEN_SECRET)
            // refreshTokens.push(refreshToken)
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        } else {
            response.message = 'User does not exist';
            res.send(response);
        }
    })
})


function generateAccessToken(User) {
    return jwt.sign(User, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}




app.listen(port, () => {
    console.log("listening on port " + port);
})

