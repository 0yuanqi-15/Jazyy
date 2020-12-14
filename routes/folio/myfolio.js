var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('users');


/* GET users listing. */
router.get('/', function(req, res) {

    if (req.cookies["Username"] == null) {
        res.redirect("/user/login");
    } else {
        var username = req.cookies["Username"];
        res.redirect("/myfolio/"+username);
    }

});

router.get('/:id', function(req, res) {

    if (req.cookies["Username"] == null) {
        var username = req.params.id;
        User.findOne({accountName:username}, function(err, result) {
            if (result == null) {
                var textMessage = "This account is not exist! ";
                res.send(textMessage + '<a href = "/discussion-board">Go to Forum</a>');
                return;
            }
            var file = result.file;
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
            var myPDF = [];
            var myLink = [];
            var myVideo = [];
            for(var i = 0; i < PDF.length; i++){
                myPDF[i] = PDF[i].toObject();
            }

            var myImage = [];
            for(var j = 0; j < image.length; j++){
                myImage[j] = image[j].toObject();
            }

            for(var k = 0; k < link.length; k++){
                myLink[k] = link[k].toObject();
            }

            for(var l = 0; l < video.length; l++){
                myVideo[l] = video[l].toObject();
            }

            res.render('folio/myfolio', {
                layout: "myfolio",
                title: "myFolio",
                username: visitorUsername,
                folioUsername: username,
                editDisplay: "none",
                myPhoto: myPhoto,
                file: file,
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
                customizeInfo3: customizeInfo3,
                photo:"../resource/default.jpg"});
        })
    } else {
        var visitorUsername = req.cookies["Username"];
        User.findOne({accountName:visitorUsername}, function(err, result) {
            var visitorAvatar = result.photo;
            var username = req.params.id;
            var editDisplay = "none";
            if (username == visitorUsername){editDisplay = "block";}
            User.findOne({accountName:username}, function(err, result) {
                if (result == null) {
                    var textMessage = "This account is not exist! ";
                    res.send(textMessage + '<a href = "/discussion-board">Go to Forum</a>');
                    return;
                }

                var file = result.file;
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
                var myPhoto = result.myPhoto;
                var link = result.link;
                var video = result.video;
                var myLink = [];
                var myPDF = [];
                var myVideo = [];
                var image = result.image;
                for(var i = 0; i < PDF.length; i++){
                    myPDF[i] = PDF[i].toObject();
                }

                var myImage = [];

                for(var j = 0; j < image.length; j++){
                    myImage[j] = image[j].toObject();
                }

                for(var k = 0; k < link.length; k++){
                    myLink[k] = link[k].toObject();
                }

                for(var l = 0; l < video.length; l++){
                    myVideo[l] = video[l].toObject();
                }

                res.render('folio/myfolio', {
                    layout: "myfolio",
                    title: "myFolio",
                    username: visitorUsername,
                    photo: visitorAvatar,
                    folioUsername: username,
                    editDisplay: editDisplay,
                    myPhoto: myPhoto,
                    file: file,
                    PDF: myPDF,
                    link: myLink,
                    image: myImage,
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
                    customizeInfo3: customizeInfo3
                });
            })
        })
    }

});

module.exports = router;