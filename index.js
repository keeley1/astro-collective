// import required modules
const express = require('express');
const ejs = require('ejs');

const app = express();
const port = 8000;

// setting up css
app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');

// setting up ejs
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

var appData = {appName: "astro collective"};

// require main.js in routes folder
require("./routes/main")(app, appData);

app.listen(port, () => console.log(`astro collective listening on port ${port}!`));