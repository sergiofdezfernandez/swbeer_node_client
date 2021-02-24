var soap = require('soap');
const config = require('config');
var client = null;

soap.createClient(config.get("SOAP-SERVER.url"), function (err, soapClient) {
    client = soapClient;
});

const check = function (req, res, next) {
    if(req.session.user){
        client.GetUserByEmail({email: req.session.user.Email}, function (err, result) {
            if (req.session && result) {
                return next();
            } else
                return res.redirect("/login")
        });
    }else{
        return res.redirect("/login")
    }
};

const unless = function (paths, middleware) {
    return function (req, res, next) {
        if (paths.includes(req.path)) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

exports.check = check;
exports.unless = unless;