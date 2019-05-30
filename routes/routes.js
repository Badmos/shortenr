const express = require('express'),
    uuid = require('uuid/v4'),
    router = express.Router();

const { Url } = require('../db/models/url');


router.route('/')
    .get((req, res) => {
        res.render('index', { error: false, url: false });
    });

router.route('/:urlPath')
    .get((req, res) => {
        let shortenedUrlPath = req.params.urlPath.trim();
        Url.findOne({ shortenedUrlPath }, (err, url) => {
            if (!url) console.log('URL does not exist'), res.render('404');
            else if (url) {
                console.log(url)
                res.status(301).redirect(`${url.urlProtocol}://${url.formattedUrl}`);
            }
        })
    })

router.route('/')
    .post((req, res) => {
        // url submitted by user
        let unprocessedUrl = req.body.unprocessedUrl.toLowerCase();
        //returns url protocol. One of HTTPS or HTTPS. 
        let urlProtocol = unprocessedUrl.split(':').length <= 1 ? 'http' : unprocessedUrl.split(':')[0];
        //If eventually, protocol is none of both, reassign protocol to be http
        if (urlProtocol !== 'http' || urlProtocol !== 'https') urlProtocol = 'http';
        //Strips HTTP off URL
        let urlWithoutHttp = unprocessedUrl.replace(/^https?\:\/\//i, "")
            //checks if URL has 'www', if it does, return it, else prepend 'www' to the url
        let splitUrl = urlWithoutHttp.split('.')[0].toLowerCase();
        let formattedUrl = splitUrl === 'www' ? urlWithoutHttp : `www.${urlWithoutHttp}`;
        Url.findOne({ formattedUrl }, (err, returnedUrl) => {
            if (returnedUrl) res.render('index', { url: returnedUrl.shortenedUrl, error: false }), console.log(returnedUrl.shortenedUrl, "Yeah, that's your url boy!!!")
            else if (!returnedUrl) {
                let newUrl = new Url();
                let generatedUrlPath = urlGenerator(5);
                let shortenedUrl = `${req.protocol}://${req.get('host')}/${generatedUrlPath}`;
                newUrl.unprocessedUrl = unprocessedUrl;
                newUrl.urlProtocol = urlProtocol;
                newUrl.urlWithoutHttp = urlWithoutHttp;
                newUrl.shortenedUrl = shortenedUrl;
                newUrl.shortenedUrlPath = generatedUrlPath;
                newUrl.formattedUrl = formattedUrl;
                newUrl.save()
                    .then((shortenedUrl) => {
                        console.log(`${unprocessedUrl} shortened to ${shortenedUrl.shortenedUrl}`);
                        res.render('index', { url: shortenedUrl.shortenedUrl, error: false })
                    })
                    .catch((err) => {
                        if (err.name === 'ValidationError')
                            res.render('index', { error: 'Enter a valid URL', url: false })
                    })
            } else {
                console.log('Server error! Not connected to DB!')
            }
        })

    })
router.route('*')
    .get((req, res) => {
        res.render('404');
    });

function urlGenerator(multiplier) {
    let uniqueString = uuid().slice(-6),
        uniqueArray = uniqueString.split(''),
        firstRandNum = Math.round(Math.random() * multiplier);
    uniqueArray[firstRandNum] = uniqueArray[firstRandNum].toUpperCase();

    let secondRandNum = Math.round(Math.random() * multiplier);
    uniqueArray[secondRandNum] = uniqueArray[secondRandNum].toUpperCase();

    let uniquePath = uniqueArray.join('')
    return uniquePath;
}

module.exports = router;