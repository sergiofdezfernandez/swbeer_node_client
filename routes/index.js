var express = require('express');
var router = express.Router();
var soap = require('soap')
var AWS = require('aws-sdk');
const config = require('config');

AWS.config.update({region: 'us-east-2'})
const accessKeyId = config.get('AWS.accessKeyId');
const secretAccessKey = config.get('AWS.secretAccessKey');
const region = config.get('AWS.region');

AWS.config.update(
    {
        accessKeyId,
        secretAccessKey,
        region
    }
);

var client = null;
const url = config.get("SOAP-SERVER.url");

soap.createClient(url, function (err, soapClient) {
    client = soapClient;
});

router.get('/', function (req, res, next) {
    res.render('index', {result: {}});
});

router.post('/', function (req, res, next) {
    const args = {arg0: req.body.term1, arg1: req.body.term2}
    client.add(args, function (err, result) {
        console.log(result)
        return res.render('index', {result})
    });
});
router.get('/translate', function (req, res, next) {
    res.render('test', {text:""});
});

router.post('/translate', function (req, res, next) {
    var translate = new AWS.Translate();
    var params = {
        Text: req.body.text,
        SourceLanguageCode: "en",
        TargetLanguageCode: "es"
    };
    translate.translateText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        }
        if (data) {
            res.render('test', {text: data.TranslatedText});
        }
    });
});
module.exports = router;
