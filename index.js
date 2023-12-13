// import required modules
const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
var validator = require ('express-validator');
const expressSanitizer = require('express-sanitizer'); 

const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer()); 

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'astroappuser',
    password: 'milkyway',
    database: 'astroCollective'
});

// connect to the database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('connected to database');
});
global.db = db; 

// setting up css
app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, '/public')));

app.set('views', __dirname + '/views');

// setting up ejs
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

var appData = {appName: "astro collective"};

// require main.js in routes folder
require("./routes/main")(app, appData);

app.listen(port, () => console.log(`astro collective listening on port ${port}!`));