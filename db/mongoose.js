const mongoose = require('mongoose');

let mongodbUrl = process.env.DATABASEURL || 'mongodb://localhost:27017/shortenr';
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    // Use ssl connection (needs to have a mongod server with ssl support). Default is false. Change to true when using ssl
    ssl: false,
    // sets how many times to try reconnecting
    reconnectTries: Number.MAX_VALUE,
    // sets the delay between every retry (milliseconds)
    reconnectInterval: 1000
});

module.exports.mongoose = mongoose;