var express = require('express');
var router = express.Router();

var userController = require('../../controllers/user-controller.js');

/* GET users listing. */
router.get('/', function(req, res) {
    if (req.cookies["Username"] == null) {
        res.render('user/sign-up', {
            layout: 'user-page',
            title: "Sign-up Page"
        });
    } else {
        res.redirect("/user");
    }

});

router.get('/get-data', userController.findAllUsers);

router.post('/insert', userController.createUser);

router.post('/updatePassword', userController.updatePassword);

router.post('/updateAvatar', userController.updateAvatar);

router.post('/delete', userController.deleteUser);

router.post('/deletePDF',userController.delPDF);

router.post('/updateUserInfo',userController.updateUserInfo);

router.post('/updatePDF',userController.updatePDF);

router.post('/updateDescription',userController.updateDescription);

router.post('/updateImage',userController.updateImage);

router.post('/deleteImage',userController.delImage);

router.post('/updateMyPhoto',userController.updateMyPhoto);

router.post('/updateLink',userController.updateLink);

router.post('/delLink',userController.delLink);

router.post('/updateVideo',userController.updateVideo);

router.post('/delVideo',userController.delVideo);

module.exports = router;
