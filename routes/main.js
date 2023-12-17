const { check, validationResult } = require('express-validator'); 

module.exports = function(app, appData) {

    // importing necessary dependencies
    const mysql = require('mysql');
    const bcrypt = require('bcrypt'); 
    const formatDate = require('../script');

    const redirectLogin = (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('login')
        }
        else {
            next();
        }
    }

    // handling routes
    app.get('/', function(req, res) {
        // making astronomy photo api available on home page
        const request = require('request');  
        let apiKey = 'nA1OrKFjtPaWdPTr4wGLhNfyHptQbbiJLwGy90Kq'; 
        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}` 
        
        request(url, function (err, response, body) { 
            if(err){ 
                console.log('error:', err); 
            } 
            else { 
                // parse and send api data to index.ejs
                const data = JSON.parse(body);
                const imageUrl = data.url;

                // check if user is logged in and save this information
                if (req.session.userId) {
                    let appData2 = Object.assign({}, appData, { imageUrl, title: data.title, appState: "loggedin" });
                    res.render('index.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, appData, { imageUrl, title: data.title, appState: "notloggedin" });
                    res.render('index.ejs', appData2);
                }
            }
        });
    });
    app.get('/register', function(req, res) {
        if (req.session.userId) {
            let appData2 = Object.assign({}, appData, { appState: "loggedin" });
            // redirect to home if user is already logged in
            res.redirect('/', appData2);
        } else {
            let appData2 = Object.assign({}, appData, { appState: "notloggedin", error: "none"});
            res.render('register.ejs', appData2);
        }
    });
    app.post('/registered', 
    [
    // validate each field against specific criteria
    check('first').matches(/^[a-zA-Z]+$/),
    check('last').matches(/^[a-zA-Z]+$/),
    check('email').isEmail(),
    check('username').isLength({ max: 15 }),
    check('password').matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/),
    ], function(req, res) {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log any validation errors and redirect to register page
            console.log("Validation errors:", errors.array());
            res.redirect('register'); 
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
    
                // redirect user if username exists
                if (existingUsername.length > 0) {
                    // return error to user
                    return res.send("Username already exists");
                }

                // hash password and insert user details into database
                bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) { 
                    let sqlquery = "INSERT INTO user_details (username, firstname, surname, email, hashedPassword) VALUES (?,?,?,?,?)";
            
                    // execute sql query
                    let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword];
            
                    db.query(sqlquery, newrecord, (err, result) => {
                        if (err) {
                            return console.error(err.message);
                        }
                        else {
                            let userName = req.body.username;
                            res.render('registered.ejs', { userName: userName, appData: appData, appState: "loggedout", error: "none" });
                        }
                    });
                }); 
            });
        }  
    });
    app.get('/login', function(req, res) {
        if (req.session.userId) {
            let appData2 = Object.assign({}, appData, { appState: "loggedin" });
            // redirect to home if user is already logged in
            res.redirect('/', appData2);
        } else {
            let appData2 = Object.assign({}, appData, { appState: "notloggedin" });
            res.render('login.ejs', appData2);
        }
    });
    app.post('/loggedin', function(req, res) {
        // query to select the hashed password via the username
        let sqlquery = "SELECT hashedPassword FROM user_details WHERE username = ?";
        let newrecord = [req.body.username];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                if (result.length === 0) {
                    // redirect to log in if there is no matching user
                    res.redirect('login');
                } else {
                    const hashedPassword = result[0].hashedPassword; 
    
                    bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
                        if (err) {
                            // return error to user
                            res.send("Cannot find user");
                        } else if (result === true) {
                            // save user session here, when login is successful 
                            req.session.userId = req.body.username; 
                            let userName = req.body.username;
                            res.render('loggedin.ejs', { userName: userName, appData: appData, appState: "loggedin" });
                            
                        } else {
                            res.send('Error');
                        }
                    });
                }
            }
        });
    });
    app.get('/logout', function(req, res) {
        // destroy session to log out
        req.session.destroy(err => {
            if (err) {
                return res.redirect('/')
            }
            let appData2 = Object.assign({}, appData, { appState: "notloggedin" });
            res.render('loggedout.ejs', { appData2: appData2 });
        })
    });
    app.get('/astronauts', function(req, res) {
        // select all data from astronauts
        let sqlquery = "SELECT * FROM astronauts";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            // update data
            let astronautData = Object.assign({}, appData, { allAstronauts: result }, { currentPage: "astronauts" });

            // check if user is logged in and send correct data
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
        // update and send correct data to user
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
        // validate if provided data is valid
        check('astroname').notEmpty(),
        check('astrophoto').notEmpty().isURL(),
        check('astrodob').notEmpty().isDate(),
        check('astrodod').optional(),
        check('astrocountry').notEmpty().isLength({ max:60 }),
        check('astrospacetime').notEmpty(),
        check('astroprofile').optional()
    ], function(req, res) {
        const errors = validationResult(req); 
        let dateOfDeath = req.body.astrodod;

        if (!errors.isEmpty()) { 
            console.log("Validation errors:", errors.array());
            // if data is invalid redirect to add astronaut page
            res.redirect('addastronaut'); 
        } 
        // check if a date of death has been provided
        else if (dateOfDeath == '') {
            // query to insert data without date of death
            let sqlquery = "INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, country, hours_in_space, astronaut_profile) VALUES (?,?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.astroname), req.body.astrophoto, req.body.astrodob, req.sanitize(req.body.astrocountry), req.body.astrospacetime, req.sanitize(req.body.astroprofile)];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    // redirect to astronaut page upon successful insertion
                    res.redirect('astronauts');
                }
            });
        }
        else {
            // query to insert new astronaut with date of death
            let sqlquery = "INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, date_of_death, country, hours_in_space, astronaut_profile) VALUES (?,?,?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.astroname), req.body.astrophoto, req.body.astrodob, req.body.astrodod, req.sanitize(req.body.astrocountry), req.body.astrospacetime, req.sanitize(req.body.astroprofile)];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    // redirect to astronaut page upon successful insertion
                    res.redirect('astronauts');
                }
            });
        }
    });
    app.get('/astronaut/:astronautID', function(req, res) {
        // query to select single astronaut by id
        let sqlquery = 'SELECT * FROM single_astronaut_view WHERE astronaut_id = ?';
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

            // check if astronaut has no connected missions and send relevant data
            if (astronautWithFormattedDates[0].mission_id == null) {
                let astronautData = Object.assign({}, appData, { astronaut: astronautWithFormattedDates }, { currentPage: "astronauts" }, { missions: "no" });

                if (req.session.userId) {
                    let appData2 = Object.assign({}, astronautData, { appState: "loggedin" });
                    res.render('single-astronaut.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, astronautData, { appState: "notloggedin" });
                    res.render('single-astronaut.ejs', appData2);
                }
            }
            else {
                // send data including that the astronaut has connected missions
                let astronautData = Object.assign({}, appData, { astronaut: astronautWithFormattedDates }, { currentPage: "astronauts" }, { missions: "yes" });

                if (req.session.userId) {
                    let appData2 = Object.assign({}, astronautData, { appState: "loggedin" });
                    res.render('single-astronaut.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, astronautData, { appState: "notloggedin" });
                    res.render('single-astronaut.ejs', appData2);
                }
            }
        });
    });
    app.get('/searchastronauts', function(req, res) {
        // redirect empty search to astronaut page
        if (req.query.searchbox.trim() === "") {
            res.redirect('astronauts');
        }
        else {
            // query to select astronauts by name
            let sqlquery = "SELECT * FROM astronauts WHERE astronaut_name LIKE ?";
            let newrecord = [`%${req.sanitize(req.query.searchbox)}%`];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./');
                }

                // send relevant data to the search result page
                let astronautData = Object.assign({}, appData, { searchResult: result }, { currentPage: "astronauts" });

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
        // query to display all missions
        let sqlquery = "SELECT * FROM missions";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            // send relevant data to the mission page
            let missionData = Object.assign({}, appData, { allMissions: result }, { currentPage: "missions" });

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
        // send data to the add mission page and display
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
        // validate add mission data
        check('missionname').notEmpty().isLength({ max:200 }),
        check('missioninsignia').notEmpty().isURL(),
        check('missionlaunch').notEmpty().isDate(),
        check('missionreturn').notEmpty().isDate(),
        check('missionlocation').notEmpty().isLength({ max:100 }),
        check('missionagency').notEmpty().isLength({ max:100 }),
        check('missioncraft').notEmpty().isLength({ max:100 }),
        check('missioncrew').notEmpty().isInt(),
        check('missiondetails').optional().isLength({ max:5000 })
    ], function(req, res) {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log errors and redirect to add astronaut page
            console.log("Validation errors:", errors.array());
            res.redirect('addmission'); 
        } 
        else {
            // query to insert mission data, sanitised to avoid SQL injection attacks
            let sqlquery = "INSERT INTO missions (mission_name, launch_date, return_date, launch_location, space_agency, spacecraft, crew_size, mission_insignia, mission_details) VALUES (?,?,?,?,?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.missionname), req.body.missionlaunch, req.body.missionreturn, req.sanitize(req.body.missionlocation), req.sanitize(req.body.missionagency), req.sanitize(req.body.missioncraft), req.body.missioncrew, req.body.missioninsignia, req.sanitize(req.body.missiondetails)];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    // redirect to mission page upon successful insertion
                    res.redirect('missions');
                }
            });
        }
    });
    app.get('/mission/:missionID', function(req, res) {
        // query to select individual mission using views
        let sqlquery = "SELECT * FROM single_mission_view WHERE mission_id = ?";
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

            // check if mission has no connected astronauts
            if (missionWithFormattedDates[0].astronaut_id == null) {
                let missionData = Object.assign({}, appData, { mission: missionWithFormattedDates }, { currentPage: "missions" }, { astronauts: "no"}, {completeCrew: "no"});
                
                if (req.session.userId) {
                    let appData2 = Object.assign({}, missionData, { appState: "loggedin" });
                    res.render('single-mission.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, missionData, { appState: "notloggedin" });
                    res.render('single-mission.ejs', appData2);
                }
            }
            else {
                let missionData;
                // check if crew is complete and send relevant data
                if (missionWithFormattedDates.length == missionWithFormattedDates[0].crew_size) {
                    missionData = Object.assign({}, appData, { mission: missionWithFormattedDates }, { currentPage: "missions" }, { astronauts: "yes"}, {completeCrew: "yes"});
                }
                else {
                    missionData = Object.assign({}, appData, { mission: missionWithFormattedDates }, { currentPage: "missions" }, { astronauts: "yes"}, {completeCrew: "no"});
                }

                // check if user is logged in
                if (req.session.userId) {
                    let appData2 = Object.assign({}, missionData, { appState: "loggedin" });
                    res.render('single-mission.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, missionData, { appState: "notloggedin" });
                    res.render('single-mission.ejs', appData2);
                }
            }
        });
    });
    app.get('/searchmissions', function(req, res) {
        // redirect to missions for empty search
        if (req.query.searchbox.trim() === "") {
            res.redirect('missions');
        }
        else {
            // query to select missions by name
            let sqlquery = "SELECT * FROM missions WHERE mission_name LIKE ?";
            let newrecord = [`%${req.sanitize(req.query.searchbox)}%`];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./');
                }

                // send relevant data and search result
                let missionData = Object.assign({}, appData, { searchResult: result }, { currentPage: "missions" });

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
    app.get('/addcrew/:missionID', redirectLogin, function(req, res) {
        // query to select astronaut names for user to select from
        let sqlquery = "SELECT astronaut_id, astronaut_name FROM astronauts"
        let newrecord = [req.params.missionID];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            // send data to add crew page
            let astronautData = Object.assign({}, appData, { astronauts: result }, { currentPage: "missions" }, { missionID: newrecord });
            console.log(newrecord);

            if (req.session.userId) {
                let appData2 = Object.assign({}, astronautData, { appState: "loggedin" });
                res.render('add-crew.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, astronautData, { appState: "notloggedin" });
                res.render('add-crew.ejs', appData2);
            }
        });
    });
    app.post('/addedcrew', function(req, res) {
        // query to insert data into astronaut mission junction table
        let sqlquery = "INSERT INTO astronaut_missions (astronaut_id, mission_id) VALUES (?,?)";
        let newrecord = [req.body.astronautID, req.body.missionID];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                // upon successful insertion, direct user to the mission they have added crew to
                res.redirect(`mission/${req.body.missionID}`);
            }
        });
    });
    app.get('/spacecraft', function(req, res) {
        // query to select all spacecraft
        let sqlquery = "SELECT * FROM spacecraft";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            // send relevant data to spacecraft page
            let craftData = Object.assign({}, appData, { allCraft: result }, { currentPage: "spacecraft" });

            if (req.session.userId) {
                let appData2 = Object.assign({}, craftData, { appState: "loggedin" });
                res.render('spacecraft.ejs', appData2);
            } else {
                let appData2 = Object.assign({}, craftData, { appState: "notloggedin" });
                res.render('spacecraft.ejs', appData2);
            }
        });
    });
    app.get('/addspacecraft', redirectLogin, function(req, res) {
        // send relevant data to add spacecraft page
        let craftData = Object.assign({}, appData, { currentPage: "spacecraft" });

        if (req.session.userId) {
            let appData2 = Object.assign({}, craftData, { appState: "loggedin" });
            res.render('add-spacecraft.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, craftData, { appState: "notloggedin" });
            res.render('add-spacecraft.ejs', appData2);
        }
    });
    app.post('/addedspacecraft', 
    [
        // validate add spacecraft form against criteria
        check('craftname').notEmpty().isLength({ max:200 }),
        check('craftphoto').notEmpty().isURL(),
        check('craftlaunches').notEmpty().isInt(),
        check('craftdetails').optional().isLength({ max:5000 })
    ], function(req, res) {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            // log errors and redirect to add spacecraft page
            console.log("Validation errors:", errors.array());
            res.redirect('addspacecraft'); 
        } 
        else {
            // query to insert data into spacecraft table, sanitised for SQL injection attack avoidance
            let sqlquery = "INSERT INTO spacecraft (craft_name, craft_photo, craft_status, craft_launches, craft_details) VALUES (?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.craftname), req.body.craftphoto, req.body.craftstatus, req.body.craftlaunches, req.sanitize(req.body.craftdetails)];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    // upon successful insertion, direct user to spacecraft page
                    res.redirect('spacecraft');
                }
            });
        }
    });
    app.get('/spacecraft/:spacecraftID', function(req, res) {
        // query to select individual spacecraft by id
        let craftQuery = "SELECT * FROM spacecraft WHERE craft_id = ?"
        let craftRecord = [req.sanitize(req.params.spacecraftID)];

        db.query(craftQuery, craftRecord, (craftErr, craftResult) => {
            if (craftErr) {
                res.redirect('./');
            }

            // second query to find missions that used this spacecraft, selected by name
            let missionQuery = 
            `SELECT *
            FROM missions
            WHERE spacecraft = (
                SELECT craft_name
                FROM spacecraft
                WHERE craft_id = ?)`;
            let missionRecord = [craftResult[0].craft_id];

            db.query(missionQuery, missionRecord, (missionErr, missionResult) => {
                if (missionErr) {
                    res.redirect('./');
                }
                
                // send data to single spacecraft page
                let craftData = Object.assign({}, appData, { spacecraft: craftResult }, {mission: missionResult }, { currentPage: "spacecraft" });
                
                if (req.session.userId) {
                    let appData2 = Object.assign({}, craftData, { appState: "loggedin" });
                    res.render('single-spacecraft.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, craftData, { appState: "notloggedin" });
                    res.render('single-spacecraft.ejs', appData2);
                }
            });
        });
    });
    app.get('/searchspacecraft', function(req, res) {
        // redirect to spacecraft page if search is empty
        if (req.query.searchbox.trim() === "") {
            res.redirect('spacecraft');
        }
        else {
            // query to select spacecraft by name
            let sqlquery = "SELECT * FROM spacecraft WHERE craft_name LIKE ?";
            let newrecord = [`%${req.sanitize(req.query.searchbox)}%`];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./');
                }

                // send data to search result page
                let craftData = Object.assign({}, appData, { searchResult: result }, { currentPage: "spacecraft" });

                if (req.session.userId) {
                    let appData2 = Object.assign({}, craftData, { appState: "loggedin" });
                    res.render('spacecraft-search-result.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, craftData, { appState: "notloggedin" });
                    res.render('spacecraft-search-result.ejs', appData2);
                }
            });
        }
    });
    app.get('/about', function(req, res) {
        // send data to about page
        let craftData = Object.assign({}, appData, { currentPage: "about" });

        if (req.session.userId) {
            let appData2 = Object.assign({}, craftData, { appState: "loggedin" });
            res.render('about.ejs', appData2);
        } else {
            let appData2 = Object.assign({}, craftData, { appState: "notloggedin" });
            res.render('about.ejs', appData2);
        }
    });
    app.get('/astrophoto', function(req, res) {
        // api key and url for fetching nasa astronomy photo data
        const request = require('request');  
        let apiKey = 'nA1OrKFjtPaWdPTr4wGLhNfyHptQbbiJLwGy90Kq'; 
        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}` 
        
        request(url, function (err, response, body) { 
            if(err){ 
                console.log('error:', err); 
                // redirect to home if there is error fetching data
                res.redirect('/');
            } 
            else { 
                // parse and save json data
                const data = JSON.parse(body);
                const imageUrl = data.url;

                // send data to astrophoto page to be displayed
                if (req.session.userId) {
                    let appData2 = Object.assign({}, appData, { imageUrl, title: data.title, explanation: data.explanation, date: data.date, appState: "loggedin" });
                    res.render('astrophoto.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, appData, { imageUrl, title: data.title, explanation: data.explanation, date: data.date, appState: "notloggedin" });
                    res.render('astrophoto.ejs', appData2);
                }
            }
        });
    });
    app.get('/peopleinspace', function(req, res) {
        // api url, no key required as it is open
        const request = require('request');  
        let url = 'http://api.open-notify.org/astros.json'; 
        
        request(url, function (err, response, body) { 
            if(err){ 
                console.log('error:', err); 
                // redirect to home if there is error fetching data
                res.redirect('/');
            } 
            else { 
                // parse api data
                const data = JSON.parse(body);
                const numberInSpace = data.number;

                // send data to people in space page
                if (req.session.userId) {
                    let appData2 = Object.assign({}, appData, { numberInSpace, people: data.people, appState: "loggedin" });
                    res.render('people-in-space.ejs', appData2);
                } else {
                    let appData2 = Object.assign({}, appData, { numberInSpace, people: data.people, appState: "notloggedin" });
                    res.render('people-in-space', appData2);
                }
            }
        });
    });
    app.get('/astronautapi', function (req,res) { 
        const keyword = req.sanitize(req.query.keyword);
        // query to select all astronauts
        let sqlquery = "SELECT * FROM astronauts";  

        // if keyword is available query to search by name
        if (keyword) {
            sqlquery += "WHERE astronaut_name LIKE ?";
        }
        
        // execute query and send result in json format
        db.query(sqlquery, [keyword ? `%${keyword}%` : null], (err, result) => { 
            if (err) { 
                res.redirect('./'); 
            } 
            res.json(result);  
        }); 
    }); 
    app.get('/missionapi', function (req,res) { 
        const keyword = req.sanitize(req.query.keyword);
        // query to select all missions
        let sqlquery = "SELECT * FROM missions";  

        // if keyword is available query to search by name
        if (keyword) {
            sqlquery += "WHERE mission_name LIKE ?";
        }
        
        // execute query and send result in json format
        db.query(sqlquery, [keyword ? `%${keyword}%` : null], (err, result) => { 
            if (err) { 
                res.redirect('./'); 
            } 
            res.json(result);  
        }); 
    }); 
    app.get('/spacecraftapi', function (req,res) { 
        const keyword = req.sanitize(req.query.keyword);
        // query to select all missions
        let sqlquery = "SELECT * FROM spacecraft";  

        // if keyword is available query to search by name
        if (keyword) {
            sqlquery += "WHERE craft_name LIKE ?";
        }
        
        // execute query and send result in json format
        db.query(sqlquery, [keyword ? `%${keyword}%` : null], (err, result) => { 
            if (err) { 
                res.redirect('./'); 
            } 
            res.json(result);  
        }); 
    });
}