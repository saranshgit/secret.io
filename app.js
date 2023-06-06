require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption');
const app = express()
const port = 3000


mongoose.connect('mongodb://localhost:27017/userDB')
const userschema = new mongoose.Schema({
    email: String,
    password: String
});

userschema.plugin(encrypt, { secret: process.env.SECRET_KEY, encryptedFields: ['password'] });

const User = mongoose.model("User", userschema)

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.get('/', function (req, res) {
    res.render('home')
})
app.get('/login', function (req, res) {
    res.render('login')
})
app.get('/register', function (req, res) {
    res.render('register')
})
app.post('/register', function (req, res) {
    const user = new User({
        email: req.body.username,
        password: req.body.password
    });

    user.save()
        .then(() => {
            res.render('secrets');
        })
        .catch((err) => {
            console.log(err);
            // Handle the error response here
            res.status(500).send('An error occurred');
        });
});


app.post('/login', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username })
        .then((found) => {
            if (found) {
                if (found.password === password) {
                    res.render('secrets')
                }
                else {
                    console.log("Invalid username and password")
                }
            }

        })
        .catch((err) => {
            console.log(err)
        })

})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))