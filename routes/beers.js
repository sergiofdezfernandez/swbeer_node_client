var express = require('express');
var router = express.Router();
var soap = require('soap');
const config = require('config');
const url = config.get("SOAP-SERVER.url");
var client = null;

soap.createClient(url, function (err, soapClient) {
    client = soapClient;
});

router.get('/', function (req, res, next) {
    client.GetBeer(function (err, result) {
        res.render('beers', {beers: result.GetBeerResult.Beer});
    });
});

router.post('/', function (req, res, next) {
    client.GetBeerByName({name: req.body.criteria}, function (err, result) {
        res.render('beers', {beers:result.GetBeerByNameResult.Beer});
    });
});

module.exports = router;
