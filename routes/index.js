var express = require('express');
var router = express.Router();
const request = require('request');
const config = require('config');

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/recomendations', function (req, res, next) {
    var url = config.get("REST-SERVICE.base-url");
    request(url, {json:true}, (err,response,body) => {
        if (err) {
            res.flash("warning")
            return;
        }else{
            res.render('recomendations', {beer:body});
        }
    });
    console.log(url);
});

module.exports = router;
