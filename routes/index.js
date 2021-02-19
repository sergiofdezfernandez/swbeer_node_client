var express = require('express');
var router = express.Router();
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

router.get('/', function (req, res, next) {
    res.render('index');
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
