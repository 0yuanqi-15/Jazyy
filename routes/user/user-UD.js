var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');


var userController = require('../../controllers/user-controller.js');
/* GET users listing. */

router.get('/', function(req, res) {
    if (req.cookies["Username"] == null) {
        res.redirect("/user/login");
    } else {
        var username = req.cookies["Username"];

        User.findOne({accountName:username}, function(err, result) {
            var photo = result.photo;
            res.render('user/user-UD', {layout: 'user-page',title: "User Center", username:username, photo:photo});
        })

    }
});

router.get('/logout', userController.userLogout);



router.post('/delete', userController.deleteUser);


module.exports = router;