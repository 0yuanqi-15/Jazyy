var express = require('express');
var router = express.Router();

var userController = require('../../controllers/user-controller.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.cookies["Username"] == null) {
        res.render('user/login', {
            layout: 'user-page',
            title: "Login Page",
            photo:"../resource/default.jpg"
        });
    } else {
        res.redirect("/user");
    }
});

router.post("/", userController.userLogin);

module.exports = router;
