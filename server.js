const express = require('express'),
    compression = require('compression'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express();

require('dotenv').config();
const routes = require('./routes/routes');

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, "/public", "/images", "/favicon.ico"))); //Serve favicon
app.set('view engine', 'ejs');
app.use('/', routes);

let PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
    console.log(`running on ${PORT}`)
});