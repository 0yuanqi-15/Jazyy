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
            var fname = result.fname;
            var lname = result.lname;
            var country = result.country;
            var subject = result.content;
            var birthday = result.birthday;
            var gender = result.gender;
            var occupation = result.occupation;
            var customizekey1 = result.customizekey1;
            var customizeInfo1 = result.customizeInfo1;
            var customizekey2 = result.customizekey2;
            var customizeInfo2 = result.customizeInfo2;
            var customizekey3 = result.customizekey3;
            var customizeInfo3 = result.customizeInfo3;
            var PDF = result.PDF;
            var image = result.image;
            var myPhoto = result.myPhoto;
            var link = result.link;
            var video = result.video;
            var myVideo = []
            var myPDF = [];
            var myImage = [];
            var myLink = [];

            for(var i = 0; i < PDF.length; i++){
                myPDF[i] = PDF[i].toObject();
            }

            for(var j = 0; j < image.length; j++){
                myImage[j] = image[j].toObject();
            }

            for(var k = 0; k < link.length; k++){
                myLink[k] = link[k].toObject();
            }

            for(var l = 0; l < video.length; l++){
                myVideo[l] = video[l].toObject();
            }

            res.render('folio/edit-folio', {
                layout: "myfolio",
                title: "edit my folio",
                username: username,
                photo: photo,
                myPhoto: myPhoto,
                PDF: myPDF,
                image: myImage,
                link: myLink,
                video: myVideo,
                fname: fname,
                lname: lname,
                country: country,
                subject: subject,
                birthday: birthday,
                gender: gender,
                occupation: occupation,
                customizekey1: customizekey1,
                customizekey2: customizekey2,
                customizekey3: customizekey3,
                customizeInfo1: customizeInfo1,
                customizeInfo2: customizeInfo2,
                customizeInfo3: customizeInfo3});
        })
    }
});



router.post('/insert', userController.createUser);
module.exports = router;