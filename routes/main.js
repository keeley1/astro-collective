const { check, validationResult } = require('express-validator'); 

module.exports = function(app, appData) {

    // importing necessary dependencies
    const mysql = require('mysql');
    const bcrypt = require('bcrypt'); 
    const formatDate = require('../script');
    const nasaPhotoApi = require('../script');

    const redirectLogin = (req, res, next) => {
        if (!req.session.userId) {
            res.redirect('../login')
        }
        else {
            next();
        }
    }

    // handling routes
    app.get('/', function(req, res) {
        const request = require('request');  
        let apiKey = 'nA1OrKFjtPaWdPTr4wGLhNfyHptQbbiJLwGy90Kq'; 
        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}` 
        
        request(url, function (err, response, body) { 
            if(err){ 
                console.log('error:', err); 
            } 
            else { 
                const data = JSON.parse(body);
                const imageUrl = data.url;

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
            res.redirect('/', appData2);
        } else {
            let appData2 = Object.assign({}, appData, { appState: "notloggedin" });
            res.render('register.ejs', appData2);
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
    
                if (existingUsername.length > 0) {
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
                            res.render('registered.ejs', { userName: userName, appData: appData, appState: "loggedin" });
                        }
                    });
                }); 
            });
        }  
    });
    app.get('/login', function(req, res) {
        if (req.session.userId) {
            let appData2 = Object.assign({}, appData, { appState: "loggedin" });
            res.redirect('/', appData2);
        } else {
            let appData2 = Object.assign({}, appData, { appState: "notloggedin" });
            res.render('login.ejs', appData2);
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
            console.log("invalid form data");
            res.redirect('/addastronaut'); 
        } 
        else if (dateOfDeath == '') {
            let sqlquery = "INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, country, hours_in_space, astronaut_profile) VALUES (?,?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.astroname), req.body.astrophoto, req.body.astrodob, req.sanitize(req.body.astrocountry), req.body.astrospacetime, req.sanitize(req.body.astroprofile)];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    res.redirect('/astronauts');
                }
            });
        }
        else {
            let sqlquery = "INSERT INTO astronauts (astronaut_name, astronaut_photo, date_of_birth, date_of_death, country, hours_in_space, astronaut_profile) VALUES (?,?,?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.astroname), req.body.astrophoto, req.body.astrodob, req.body.astrodod, req.sanitize(req.body.astrocountry), req.body.astrospacetime, req.sanitize(req.body.astroprofile)];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    res.redirect('/astronauts');
                }
            });
        }
    });
    app.get('/astronaut/:astronautID', function(req, res) {
        
        let sqlquery = 
        `SELECT astronauts.*, missions.mission_id, missions.mission_name, missions.mission_insignia, missions.space_agency, missions.launch_location
        FROM astronauts
        LEFT JOIN astronaut_missions ON astronauts.astronaut_id = astronaut_missions.astronaut_id
        LEFT JOIN missions ON astronaut_missions.mission_id = missions.mission_id
        WHERE astronauts.astronaut_id = ?`;
        let newrecord = [req.params.astronautID];
        // sql query to select specific astronaut
        //let sqlquery = "SELECT * FROM astronauts WHERE astronaut_id = ?"
        //let newrecord = [req.params.astronautID];

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

            // check if astronaut has no connected missions
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
            console.log("Validation errors:", errors.array());
            console.log("invalid form data");
            res.redirect('/addastronaut'); 
        } 
        else {
            let sqlquery = "INSERT INTO missions (mission_name, launch_date, return_date, launch_location, space_agency, spacecraft, crew_size, mission_insignia, mission_details) VALUES (?,?,?,?,?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.missionname), req.body.missionlaunch, req.body.missionreturn, req.sanitize(req.body.missionlocation), req.sanitize(req.body.missionagency), req.sanitize(req.body.missioncraft), req.body.missioncrew, req.body.missioninsignia, req.sanitize(req.body.missiondetails)];
            console.log(req.sanitize(req.body.missionname));

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    res.redirect('/missions');
                }
            });
        }
    });
    app.get('/mission/:missionID', function(req, res) {

        // sql query to select missions and any connected astronauts
        let sqlquery = 
        `SELECT missions.*, astronauts.astronaut_id, astronauts.astronaut_name, astronauts.astronaut_photo, astronauts.country, astronauts.hours_in_space
        FROM missions
        LEFT JOIN astronaut_missions ON missions.mission_id = astronaut_missions.mission_id
        LEFT JOIN astronauts ON astronaut_missions.astronaut_id = astronauts.astronaut_id
        WHERE missions.mission_id = ?`;
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

                // check if crew is complete 
                if (missionWithFormattedDates.length == missionWithFormattedDates[0].crew_size) {
                    missionData = Object.assign({}, appData, { mission: missionWithFormattedDates }, { currentPage: "missions" }, { astronauts: "yes"}, {completeCrew: "yes"});
                }
                else {
                    missionData = Object.assign({}, appData, { mission: missionWithFormattedDates }, { currentPage: "missions" }, { astronauts: "yes"}, {completeCrew: "no"});
                }

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
    app.get('/addcrew/:missionID', redirectLogin, function(req, res) {
        let sqlquery = "SELECT astronaut_id, astronaut_name FROM astronauts"
        let newrecord = [req.params.missionID];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                res.redirect('./');
            }

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
        console.log(req.body.missionID);
        console.log(req.body.astronautID);
        let sqlquery = "INSERT INTO astronaut_missions (astronaut_id, mission_id) VALUES (?,?)";
        let newrecord = [req.body.astronautID, req.body.missionID];

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                return console.error(err.message);
            }
            else {
                res.redirect(`/mission/${req.body.missionID}`);
            }
        });
    });
    app.get('/spacecraft', function(req, res) {
        let sqlquery = "SELECT * FROM spacecraft";

        db.query(sqlquery, (err, result) => {
            if (err) {
                res.redirect('./');
            }

            let craftData = Object.assign({}, appData, { allCraft: result }, { currentPage: "spacecraft" });
            console.log(craftData);

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
        check('craftname').notEmpty().isLength({ max:200 }),
        check('craftphoto').notEmpty().isURL(),
        check('craftlaunches').notEmpty().isInt(),
        check('craftdetails').optional().isLength({ max:5000 })
    ], function(req, res) {
        const errors = validationResult(req); 

        if (!errors.isEmpty()) { 
            console.log("Validation errors:", errors.array());
            console.log("invalid form data");
            res.redirect('/addspacecraft'); 
        } 
        else {
            let sqlquery = "INSERT INTO spacecraft (craft_name, craft_photo, craft_status, craft_launches, craft_details) VALUES (?,?,?,?,?)";
            let newrecord = [req.sanitize(req.body.craftname), req.body.craftphoto, req.body.craftstatus, req.body.craftlaunches, req.sanitize(req.body.craftdetails)];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    return console.error(err.message);
                }
                else {
                    res.redirect('/spacecraft');
                }
            });
        }
    });
    app.get('/spacecraft/:spacecraftID', function(req, res) {

        let craftQuery = "SELECT * FROM spacecraft WHERE craft_id = ?"
        let craftRecord = [req.params.spacecraftID];

        db.query(craftQuery, craftRecord, (craftErr, craftResult) => {
            if (craftErr) {
                res.redirect('./');
            }

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
                
                let craftData = Object.assign({}, appData, { spacecraft: craftResult }, {mission: missionResult }, { currentPage: "spacecraft" });
                console.log(craftData);
                
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
        console.log('search = '+ req.query.searchbox);
        if (req.query.searchbox.trim() === "") {
            res.redirect('/spacecraft');
        }
        else {
            let sqlquery = "SELECT * FROM spacecraft WHERE craft_name LIKE ?";
            let newrecord = [`%${req.query.searchbox}%`];

            db.query(sqlquery, newrecord, (err, result) => {
                if (err) {
                    res.redirect('./');
                }

                let craftData = Object.assign({}, appData, { searchResult: result }, { currentPage: "spacecraft" });
                console.log(craftData);

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
        const request = require('request');  
        let apiKey = 'nA1OrKFjtPaWdPTr4wGLhNfyHptQbbiJLwGy90Kq'; 
        let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}` 
        
        request(url, function (err, response, body) { 
            if(err){ 
                console.log('error:', err); 
            } 
            else { 
                const data = JSON.parse(body);
                const imageUrl = data.url;

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
        const request = require('request');  
        let url = 'http://api.open-notify.org/astros.json' 
        
        request(url, function (err, response, body) { 
            if(err){ 
                console.log('error:', err); 
            } 
            else { 
                const data = JSON.parse(body);
                const numberInSpace = data.number;

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
    app.get('/api', function (req,res) { 
        const keyword = req.query.keyword;
        let sqlquery = "SELECT * FROM astronauts";  

        if (keyword) {
            // If a keyword is provided, modify the query to include a WHERE clause
            sqlquery += " WHERE astronaut_name LIKE ?";
        }
        
        db.query(sqlquery, [keyword ? `%${keyword}%` : null], (err, result) => { 
            if (err) { 
                res.redirect('./'); 
            } 
            res.json(result);  
        }); 
    }); 
}