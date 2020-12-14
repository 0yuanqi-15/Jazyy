var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.cookies["Username"] != null) {
        var username = req.cookies["Username"];
        User.findOne({accountName:username}, function(err, result) {
            var photo = result.photo;
            res.render('index', {layout: 'index-page', title: "Jazyy", username:username, photo:photo});
        })
    }
    else {
        res.render('index', {layout: "index-page", title: "Jazyy", photo:"../resource/default.jpg"});
    }

});

// for debug
router.get('/getcookies', function(req, res, next) {
    res.send(req.cookies);
});

module.exports = router;
