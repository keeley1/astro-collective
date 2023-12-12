const { check, validationResult } = require('express-validator'); 

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
        if (req.session.userId) {
            let appData2 = Object.assign({}, appData, { appState: "loggedin" });
            res.render('index.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, appData, { appState: "notloggedin" });
            res.render('index.ejs', appData2);
        }
    });
    app.get('/register', function(req, res) {
        if (req.session.userId) {
            res.redirect('/');
        } else {
            res.render('register.ejs', appData);
        }
    });
    app.post('/registered', 
    [
    check('first').matches(/^[a-zA-Z]+$/),
    check('last').matches(/^[a-zA-Z]+$/),
    check('email').isEmail(),
    check('username').isLength({ max: 15 }),
    check('password').matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/),
    ], function(req, res) {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            console.log("Validation errors:", errors.array());
            console.log("invalid form data");
            res.redirect('/register'); 
        } 
        else {
            const saltRounds = 10; 
            const plainPassword = req.body.password;

            // check if username exists in database
            let usernameQuery = "SELECT username FROM user_details WHERE username = ?";
            let newrecord = [req.body.username];

            db.query(usernameQuery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
    
                const existingUsername = result;
                console.log(existingUsername);
    
                if (existingUsername.length = 0) {
                    console.log("username already exists");
                    return res.redirect('/register');
                }
                
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
        }  
    });
    app.get('/login', function(req, res) {
        if (req.session.userId) {
            res.redirect('/');
        } else {
            res.render('login.ejs', appData);
        }
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
                            res.render('loggedin.ejs', { userName: userName, appData: appData, appState: "loggedin" });
                            
                        } else {
                            res.send('Error');
                        }
                    });
                }
            }
        });
    });
    app.get('/logout' , function(req, res) {
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/')
            }
            res.send('you are now logged out! <a href=' + './' + '>Home</a>');
        })
    });
    app.get('/astronauts', function(req, res) {
        // select all data from astronauts
        let sqlquery = "SELECT * FROM astronauts";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            let astronautData = Object.assign({}, appData, { allAstronauts: result }, { currentPage: "astronauts" });
            console.log(astronautData);

            if (req.session.userId) {
                let appData2 = Object.assign({}, astronautData, { appState: "loggedin" });
                res.render('astronauts.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, astronautData, { appState: "notloggedin" });
                res.render('astronauts.ejs', appData2);
            }
        });
    });
    app.get('/addastronaut', redirectLogin, function(req, res) {
        if (req.session.userId) {
            let appData2 = Object.assign({}, appData, { appState: "loggedin" });
            res.render('add-astronaut.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, appData, { appState: "notloggedin" });
            res.render('add-astronaut.ejs', appData2);
        }
    });
    app.post('/addedastronaut', 
    [
        check('astroname').notEmpty(),
        check('astrophoto').isURL(),
        check('astrodod').optional(),
        check('astrocountry').notEmpty().isLength({ max:60 }),
    ]
    ,
    function(req, res) {
        const errors = validationResult(req); 
        let dateOfDeath = req.body.astrodod;

        if (!errors.isEmpty()) { 
            console.log("Validation errors:", errors.array());
            console.log("invalid form data");
            res.redirect('/addastronaut'); 
        } 
        else if (dateOfDeath == '') {
            let sqlquery = "INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, country, hours_in_space, astronaut_profile) VALUES (?,?,?,?,?,?)";
            let newrecord = [req.body.astroname, req.body.astrophoto, req.body.astrodob, req.body.astrocountry, req.body.astrospacetime, req.body.astroprofile];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    let name = req.body.astroname;
                    res.send(name + " has been successfully added!");
                }
            });
        }
        else {
            let sqlquery = "INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, date_of_death, country, hours_in_space, astronaut_profile) VALUES (?,?,?,?,?,?,?)";
            let newrecord = [req.body.astroname, req.body.astrophoto, req.body.astrodob, req.body.astrodod, req.body.astrocountry, req.body.astrospacetime, req.body.astroprofile];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    let name = req.body.astroname;
                    res.send(name + " has been successfully added!");
                }
            });
        }
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

            let astronautData = Object.assign({}, appData, { astronaut: astronautWithFormattedDates }, { currentPage: "astronauts" });
            console.log(astronautData);

            if (req.session.userId) {
                let appData2 = Object.assign({}, astronautData, { appState: "loggedin" });
                res.render('single-astronaut.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, astronautData, { appState: "notloggedin" });
                res.render('single-astronaut.ejs', appData2);
            }
        });
    });
    app.get('/search', function(req, res) {
        console.log('search = '+ req.query.searchbox);
        if (req.query.searchbox.trim() === "") {
            res.redirect('/astronauts');
        }
        else {
            let sqlquery = "SELECT * FROM astronauts WHERE astronaut_name LIKE ?";
            let newrecord = [`%${req.query.searchbox}%`];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./');
                }

                let astronautData = Object.assign({}, appData, { searchResult: result }, { currentPage: "astronauts" });
                console.log(astronautData);

                if (req.session.userId) {
                    let appData2 = Object.assign({}, astronautData, { appState: "loggedin" });
                    res.render('astronaut-search-result.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, astronautData, { appState: "notloggedin" });
                    res.render('astronaut-search-result.ejs', appData2);
                }
            });
        }
    });
    app.get('/missions', function(req, res) {
        let missionData = Object.assign({}, appData, { currentPage: "missions" });

        if (req.session.userId) {
            let appData2 = Object.assign({}, missionData, { appState: "loggedin" });
            res.render('missions.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, missionData, { appState: "notloggedin" });
            res.render('missions.ejs', appData2);
        }
    });
    app.get('/spacecraft', function(req, res) {
        let craftData = Object.assign({}, appData, { currentPage: "spacecraft" });

        if (req.session.userId) {
            let appData2 = Object.assign({}, craftData, { appState: "loggedin" });
            res.render('spacecraft.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, craftData, { appState: "notloggedin" });
            res.render('spacecraft.ejs', appData2);
        }
    });
    app.get('/about', function(req, res) {
        let craftData = Object.assign({}, appData, { currentPage: "about" });

        if (req.session.userId) {
            let appData2 = Object.assign({}, craftData, { appState: "loggedin" });
            res.render('about.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, craftData, { appState: "notloggedin" });
            res.render('about.ejs', appData2);
        }
    });
}