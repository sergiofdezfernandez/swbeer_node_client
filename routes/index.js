var express = require('express');
var router = express.Router();
var soap = require('soap')

var client = null;
const url = 'http://localhost:8080/WS_Unit03_Example1_war_exploded/soapws/calculator?wsdl';

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
module.exports = router;
