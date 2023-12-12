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
        let astronautData = Object.assign({}, appData, { currentPage: "astronauts" });

        if (req.session.userId) {
            let appData2 = Object.assign({}, astronautData, { appState: "loggedin" });
            res.render('add-astronaut.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, astronautData, { appState: "notloggedin" });
            res.render('add-astronaut.ejs', appData2);
        }
    });
    app.post('/addedastronaut', 
    [
        check('astroname').notEmpty(),
        check('astrophoto').isURL(),
        check('astrodod').optional(),
        check('astrocountry').notEmpty().isLength({ max:60 }),
        check('astrospacetime').notEmpty(),
        check('astroprofile').optional()
    ], function(req, res) {
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
    app.get('/searchastronauts', function(req, res) {
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
        let sqlquery = "SELECT * FROM missions";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            let missionData = Object.assign({}, appData, { allMissions: result }, { currentPage: "missions" });
            console.log(missionData);

            if (req.session.userId) {
                let appData2 = Object.assign({}, missionData, { appState: "loggedin" });
                res.render('missions.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, missionData, { appState: "notloggedin" });
                res.render('missions.ejs', appData2);
            }
        });
    });
    app.get('/addmission', redirectLogin, function(req, res) {
        let missionData = Object.assign({}, appData, { currentPage: "missions" });

        if (req.session.userId) {
            let appData2 = Object.assign({}, missionData, { appState: "loggedin" });
            res.render('add-mission.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, missionData, { appState: "notloggedin" });
            res.render('add-mission.ejs', appData2);
        }
    });
    app.post('/addedmission', 
    [
        check('missionname').notEmpty().isLength({ max:200 }),
        check('missioninsignia').notEmpty().isURL(),
        check('missionlaunch').notEmpty(),
        check('missionreturn').notEmpty(),
        check('missionlocation').notEmpty().isLength({ max:100 }),
        check('missionagency').notEmpty().isLength({ max:100 }),
        check('missioncraft').notEmpty().isLength({ max:100 }),
        check('missiondetails').optional().isLength({ max:5000 })
    ], function(req, res) {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            console.log("Validation errors:", errors.array());
            console.log("invalid form data");
            res.redirect('/addastronaut'); 
        } 
        else {
            let sqlquery = "INSERT INTO missions (mission_name, launch_date, return_date, launch_location, space_agency, spacecraft, mission_insignia, mission_details) VALUES (?,?,?,?,?,?,?,?)";
            let newrecord = [req.body.missionname, req.body.missionlaunch, req.body.missionreturn, req.body.missionlocation, req.body.missionagency, req.body.missioncraft, req.body.missioninsignia, req.body.missiondetails];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    let name = req.body.missionname;
                    res.send(name + " has been successfully added!");
                }
            });
        }
    });
    app.get('/mission/:missionID', function(req, res) {
        // (needs error handling)
        const astroID = req.params.missionID;

        // sql query to select specific astronaut
        let sqlquery = "SELECT * FROM missions WHERE mission_id = ?"
        let newrecord = [req.params.missionID];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./');
            }
            
            // format mission dates to display how desired
            const missionWithFormattedDates = result.map(mission => {
                return {
                    ...mission,
                    launch_date: formatDate(mission.launch_date),
                    return_date: formatDate(mission.return_date),
                };
            });

            let missionData = Object.assign({}, appData, { mission: missionWithFormattedDates }, { currentPage: "missions" });
            console.log(missionData);

            if (req.session.userId) {
                let appData2 = Object.assign({}, missionData, { appState: "loggedin" });
                res.render('single-mission.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, missionData, { appState: "notloggedin" });
                res.render('single-mission.ejs', appData2);
            }
        });
    });
    app.get('/searchmissions', function(req, res) {
        console.log('search = '+ req.query.searchbox);
        if (req.query.searchbox.trim() === "") {
            res.redirect('/missions');
        }
        else {
            let sqlquery = "SELECT * FROM missions WHERE mission_name LIKE ?";
            let newrecord = [`%${req.query.searchbox}%`];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./');
                }

                let missionData = Object.assign({}, appData, { searchResult: result }, { currentPage: "missions" });
                console.log(missionData);

                if (req.session.userId) {
                    let appData2 = Object.assign({}, missionData, { appState: "loggedin" });
                    res.render('mission-search-result.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, missionData, { appState: "notloggedin" });
                    res.render('mission-search-result.ejs', appData2);
                }
            });
        }
    });
    app.get('/rockets', function(req, res) {
        let sqlquery = "SELECT * FROM rockets";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            let rocketData = Object.assign({}, appData, { allRockets: result }, { currentPage: "rockets" });
            console.log(rocketData);

            if (req.session.userId) {
                let appData2 = Object.assign({}, rocketData, { appState: "loggedin" });
                res.render('rockets.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, rocketData, { appState: "notloggedin" });
                res.render('rockets.ejs', appData2);
            }
        });
    });
    app.get('/rocket/:rocketID', function(req, res) {
        // (needs error handling)
        const astroID = req.params.rocketID;

        // sql query to select specific astronaut
        let sqlquery = "SELECT * FROM rockets WHERE rocket_id = ?"
        let newrecord = [req.params.rocketID];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            let rocketData = Object.assign({}, appData, { rocket: result }, { currentPage: "rockets" });
            console.log(rocketData);

            if (req.session.userId) {
                let appData2 = Object.assign({}, rocketData, { appState: "loggedin" });
                res.render('single-rocket.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, rocketData, { appState: "notloggedin" });
                res.render('single-rocket.ejs', appData2);
            }
        });
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