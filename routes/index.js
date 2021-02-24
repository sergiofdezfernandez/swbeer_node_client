var express = require('express');
var router = express.Router();
const request = require('request');
const config = require('config');

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/recomendations', function (req, res, next) {
    var url = config.get("PUNK-API.base-url") + "/beers/random";
    request(url, {json: true}, (err, response, body) => {
        if (err) {
            return console.log(err);
        }
        res.render('recomendations', {beers:body});
    });
});

module.exports = router;
