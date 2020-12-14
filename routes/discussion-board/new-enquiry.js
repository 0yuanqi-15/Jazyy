var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');

var discussionController = require('../../controllers/discussion-controller.js');

/* GET users listing. */
router.get('/', function(req, res) {

    if (req.cookies["Username"] == null) {
        res.redirect("/user/login");
    } else {
        var username = req.cookies["Username"];
        User.findOne({accountName:username}, function(err, result) {
            var photo = result.photo;
            res.render('discussion-board/new-enquiry', {layout: 'discuss-page', title: "new-enquiry", username:username, photo:photo});
        })
    }

});

router.post('/submit', discussionController.createDiscussion);

module.exports = router;
