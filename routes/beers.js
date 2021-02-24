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
    client.GetBeers(function (err, result) {
        res.render('beers/beers', {beers: result.GetBeersResult.Beer});
    });
});

router.post('/', function (req, res, next) {
    client.GetBeersByName({name: req.body.criteria}, function (err, result) {
        if(result.GetBeersByNameResult){
            res.render('beers/beers', {beers: result.GetBeersByNameResult.Beer});
        }else{
            req.flash("warning","No se han encontrado resultados");
            res.render('beers/beers',{beers:[]});
        }

    });
});
router.get('/:id', function (req, res, next) {
    client.GetBeerById({id: req.params.id}, function (err, beer) {
        if (!err) {
            client.GetReviewsByBeer({idBeer: req.params.id}, function (err, result) {
                if (result.GetReviewsByBeerResult) {
                    res.render('beers/beerDetail', {
                        reviews: result.GetReviewsByBeerResult.Review,
                        beer: beer.GetBeerByIdResult
                    });
                } else {
                    res.render('beers/beerDetail', {reviews: [], beer: beer.GetBeerByIdResult});
                }
            });
        }else{
            req.flash("warning","Esta cerveza no existe");
            res.redirect("/beers")
        }
    });
});
router.post('/:id/review', function (req, res, next) {
    const review = {userId:req.session.user.Id,beerId:req.params.id,score:parseInt(req.body.score),comment:req.body.comment}
    client.AddReview(review,function (err,result){
        if(result.AddReviewResult){
            console.log(result.AddReviewResult);
            res.redirect("/beers/"+req.params.id);
        }
    });
});

module.exports = router;
