const validator = require('validator');

/* Local package(s)*/
const { mongoose } = require('../mongoose');

let Schema = mongoose.Schema;
let urlSchema = Schema({
    unprocessedUrl: {
        type: String,
        lowercase: true,
        validate: {
            isAsync: false,
            validator: url => validator.isURL(url, { allow_underscores: true, allow_trailing_dot: false })
        },
        message: '{VALUE} is not a valid email'
    },
    urlWithoutHttp: String,
    urlProtocol: String,
    shortenedUrl: String,
    shortenedUrlPath: String,
    formattedUrl: String
})

let Url = mongoose.model('Url', urlSchema);
module.exports.Url = Url;

// console.log(validator.isURL('a.bs', { allow_underscores: true, allow_trailing_dot: true }))