var express = require('express');
var router = express.Router();
var soap = require('soap');
const config = require('config');
var client = null;

soap.createClient(config.get("SOAP-SERVER.url"), function (err, soapClient) {
    client = soapClient;
});

router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/signUp', function (req, res, next) {
    res.render('signUp', );
});

router.post('/signUp', function (req, res, next) {
    var user = JSON.parse(JSON.stringify(req.body));
    client.GetUserByEmail({email: user.email}, function (err, result) {
        if (!result) {
            client.SignUp(user, function (err, result) {
                if (result.SignUpResult) {
                    res.redirect("/login")
                }
            });
        } else {
            res.render('/signUp', {error: "Ya existe un usuario con ese correo electrónico"});
        }
    });
});

router.post('/login', function (req, res, next) {
    var credentials = JSON.parse(JSON.stringify(req.body));
    client.Login(credentials,function(err,result){
       if(result.LoginResult){
           delete result.LoginResult.Password;
           req.session.user= result.LoginResult;
           res.redirect('/');
       }else{
           req.flash("warning","Credenciales inválidas")
           res.redirect('login');
       }
    });
});

router.get('/logout',function (req, res, next) {
    req.session.destroy();
    res.redirect("login");
});

module.exports = router;
