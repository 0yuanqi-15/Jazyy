var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

/* GET users listing. */
router.get('/', function(req, res, next) {

    if (req.cookies["Username"] != null) {
        var username = req.cookies["Username"];
        User.findOne({accountName:username}, function(err, result) {
            var photo = result.photo;
            res.render('contact-us', {layout: "contact-page", title: "Contact us", username:username, photo:photo});
        })
    }
    else {
        res.render('contact-us', {layout: "contact-page", title: "Contact us", photo:"../resource/default.jpg"});
    }
});

module.exports = router;
