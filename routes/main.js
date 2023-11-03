const { check } = require('express-validator');

module.exports = function(app, appData) {

    // importing necessary dependencies
    const mysql = require('mysql');
    const bcrypt = require('bcrypt'); 
    const formatDate = require('../script');

    const redirectLogin = (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('./login')
        }
        else {
            next();
        }
    }

    // handling routes
    app.get('/', function(req, res) {
        res.render('index.ejs', appData);
    });
    app.get('/register', function(req, res) {
        res.render('register.ejs', appData);
    });
    app.post('/registered', function(req, res) {
        const saltRounds = 10; 
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) { 
            let sqlquery = "INSERT INTO user_details (username, firstname, surname, email, hashedPassword) VALUES (?,?,?,?,?)";
            
            // execute sql query
            let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];
            
            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    userName = req.body.username;
                    res.render('registered.ejs', { userName: userName, appData: appData });
                }
            });
        }); 
    });
    app.get('/login', function(req, res) {
        res.render('login.ejs', appData);
    });
    app.post('/loggedin', function(req, res) {
        let sqlquery = "SELECT hashedPassword FROM user_details WHERE username = ?";
        let newrecord = [req.body.username];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                if (result.length === 0) {
                    res.send('User not found');
                } else {
                    const hashedPassword = result[0].hashedPassword; 
    
                    bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
                        if (err) {
                            res.send('Cannot find user');
                        } else if (result === true) {
                            // save user session here, when login is successful 
                            req.session.userId = req.body.username; 

                            userName = req.body.username;
                            res.render('loggedin.ejs', { userName: userName, appData: appData });
                            
                        } else {
                            res.send('Error');
                        }
                    });
                }
            }
        });
    });
    app.get('/astronauts', function(req, res) {
        // select all data from astronauts
        let sqlquery = "SELECT * FROM astronauts";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            
            // format astronaut dates to display how desired
            const astronautsWithFormattedDates = result.map(astronaut => {
                return {
                    ...astronaut,
                    date_of_birth: formatDate(astronaut.date_of_birth),
                    date_of_death: formatDate(astronaut.date_of_death),
                };
            });

            let astronautData = Object.assign({}, appData, { allAstronauts: astronautsWithFormattedDates });
            console.log(astronautData);
            res.render('astronauts.ejs', astronautData);
        });
    });
    app.get('/addastronaut', redirectLogin, function(req, res) {
        res.render('add-astronaut.ejs', appData);
    });
    app.post('/addedastronaut', function(req, res) {
        let sqlquery = "INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, date_of_death, country, hours_in_space, astronaut_profile) VALUES (?,?,?,?,?,?,?)";
        let newrecord = [req.body.astroname, req.body.astrophoto, req.body.astrodob, req.body.astrodod, req.body.astrocountry, req.body.astrospacetime, req.body.astroprofile]

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                let name = req.body.astroname;
                res.send(name + " has been successfully added!");
            }
        });
    });
    app.get('/astronaut/:astronautID', function(req, res) {
        // (needs error handling)
        const astroID = req.params.astronautID;

        // sql query to select specific astronaut
        let sqlquery = "SELECT * FROM astronauts WHERE astronaut_id = ?"
        let newrecord = [req.params.astronautID];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            
            // format astronaut dates to display how desired
            const astronautWithFormattedDates = result.map(astronaut => {
                return {
                    ...astronaut,
                    date_of_birth: formatDate(astronaut.date_of_birth),
                    date_of_death: formatDate(astronaut.date_of_death),
                };
            });

            let astronautData = Object.assign({}, appData, { astronaut: astronautWithFormattedDates });
            console.log(astronautData);
            res.render('single-astronaut.ejs', astronautData);
        });
        //res.send(astroID);
    });
}