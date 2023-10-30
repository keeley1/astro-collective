module.exports = function(app, appData) {

    // handling routes
    app.get('/', function(req, res) {
        res.render('index.ejs', appData);
    });
}