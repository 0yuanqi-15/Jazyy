var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
var User = mongoose.model('users');


//to load all users who has already signed in;
var findAllUsers = function(req, res, next) {
    User.find()
        .lean()
        .then(function(doc) {
            res.render('user/sign-up', {layout: 'user-page', items: doc});
        });
};



//the functionality that allowed user sign up;
var createUser = async function(req, res, next) {


    var accountName = req.body.accountName, password = req.body.password;
    var photo = req.body.photo;
    var confirmPassword = req.body.confirmPassword;
    var isValid = false;
    var identical = false;
    var textMessage = "";



    //make sure that the account name and password are not blank and the password is not too short;
    if (!accountName || accountName == "") {
        textMessage = "Please enter your username";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    } else if (!password || password == "") {
        textMessage = "Please enter your password";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    } else if (password.length < 6) {
        textMessage = "Password too short! Must longer than 6 digits";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    }

    if (confirmPassword === password) {
        //avoid the duplicate user name;
        identical = true;
    }
    else{
        textMessage = "Passwords are not identical!";
        res.render('user/sign-up', {layout: 'user-page', message:textMessage});
        return;
    }
    await User.count({accountName: accountName}, function (err, count) {
        if (err) {
            console.log('error occured in the database');
        }
        if (count == 0) {
            textMessage = "Successfully signed in, please log in here";
            isValid = true;
        } else if (count == 1) {
            textMessage = "Username has already been used";
        } else {
            textMessage = "Username has already been used. duplicate found";
        }

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        if (isValid && identical) {
            var item = {
                accountName: accountName,
                password: hash,
                photo: photo
            };


            var data = new User(item);
            data.save();

            res.redirect('/user/login');
            return;
        } else {
            res.render('user/sign-up', {layout: 'user-page', message: textMessage});
            return;
        }
    });

    //console.log(textMessage);
    // if (isValid) {
    //     var item = {
    //         accountName:accountName,
    //         password:password
    //     };
    //
    //     var data = new User(item);
    //     data.save();
    //
    //     res.redirect('/user/login');
    //     return;
    // } else {
    //     if(textMessage == ''){
    //         //textMessage = 'Something wrong, please try again later';
    //         res.render('user/sign-up', {layout: 'user-page', message:textMessage});
    //         return;
    //     }
    //     res.render('user/sign-up', {layout: 'user-page', message:textMessage});
    //     return;
    // }
};


var updateUserInfo = function(req, res, next) {
    var fname = req.body.firstname;
    var lname = req.body.lastname;
    var country = req.body.country;
    var gender = req.body.gender;
    var birthday = req.body.bday;
    var occupation = req.body.occupation;
    var selfDescription = req.body.subject;

    var customizekey1 = req.body.customkey1;
    var customizeInfo1 = req.body.customvalue1;
    var customizekey2 = req.body.customkey2;
    var customizeInfo2 = req.body.customvalue2;
    var customizekey3 = req.body.customkey3;
    var customizeInfo3 = req.body.customvalue3;

    var accName = req.cookies["Username"];

    User.findOne({accountName:accName}, function(err, result){
        if (err) {
            console.log('error occured in the database');
        }
        userInfo = result;
        var id = userInfo._id;

        User.findById(id, function(err, doc) {
            if (err) {
                console.error('error, no user found');
            }


            doc.fname = fname;
            doc.lname = lname;
            doc.country = country;
            doc.content = selfDescription;

            doc.birthday = birthday;
            doc.gender = gender;
            doc.occupation = occupation;

            doc.customizekey1 = customizekey1;
            doc.customizeInfo1 = customizeInfo1;
            doc.customizekey2 = customizekey2;
            doc.customizeInfo2 = customizeInfo2;
            doc.customizekey3 = customizekey3;
            doc.customizeInfo3 = customizeInfo3;

            doc.save();
        });
    });

    res.redirect("/edit-myfolio");
    return;
}

var updatePDF = function(req, res, next){

    var PDFfile = req.body.PDFfile;
    var PDFDescription = req.body.PDFDescription;
    var accName = req.cookies["Username"];
    var textMessage;
    if(accName != null){
        var accName = req.cookies["Username"];
        if(PDFfile != null && PDFfile != "" && PDFDescription != ""){
            User.findOne({accountName:accName}, function(err, result){
                if (err) {
                    console.log('error occured in the database');
                }
                var userInfo = result;
                var id = userInfo._id;

                User.findById(id, function(err, doc) {
                    if (err) {
                        console.error('error, no user found');
                    }
                    doc.PDF.push({file: PDFfile, description: PDFDescription});
                    doc.save();
                });
            });
        }

        if(PDFfile == null || PDFfile == ""){
            textMessage = "Please choose at least one PDF file ";
            res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
            return ;
        }

        if(PDFDescription == null || PDFDescription == ""){
            textMessage = "Please add some description to your PDF file ";
            res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
            return ;
        }
    }
    res.redirect("/edit-myfolio");
}

var updatePassword = function(req, res, next) {
    var accountName = req.cookies["Username"];
    var password = req.body.password;
    var conPassword = req.body.confirmPassword;
    var photo = req.body.photo;


        if (!accountName || accountName == "") {
            textMessage = "Please enter your username";
            res.render('user/user-UD', {layout: 'user-page', message: textMessage, photo: photo, username: accountName});
            return;
        } else if (!password || password == "") {
            textMessage = "Please enter your password";
            res.render('user/user-UD', {layout: 'user-page', message: textMessage, photo: photo, username: accountName});
            return;
        } else if (password.length < 6) {
            textMessage = "Password too short! Must longer than 6 digits";
            res.render('user/user-UD', {layout: 'user-page', message: textMessage, photo: photo, username: accountName});
            return;
        } else if (password != conPassword) {
            textMessage = "Passwords are not identical!";
            res.render('user/user-UD', {layout: 'user-page', message: textMessage, photo: photo, username: accountName});
            return;
        }

        User.findOne({accountName: accountName}, function (err, result) {
            if (err) {
                console.log('error occured in the database');
            }
            userInfo = result;
            var id = userInfo._id;

            User.findById(id, function (err, doc) {
                if (err) {
                    console.error('error, no user found');
                }
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(req.body.password, salt);
                doc.password = hash;
                doc.save();
            });

            var textMessage = "successfully changed the password!"
            res.render('user/user-UD', {layout: 'user-page', message: textMessage, photo: photo, username: accountName});
            return;
        });




};


var updateAvatar = function(req, res, next){
    var accountName = req.cookies["Username"];
    var photo = req.body.photo;

    if (photo == null || photo == ""){
        res.redirect("/user");
        return;
    }

    User.findOne({accountName:accountName}, function(err, result){
        if (err) {
            console.log('error occured in the database');
        }
        userInfo = result;
        var id = userInfo._id;

        User.findById(id, function(err, doc) {
            if (err) {
                console.error('error, no user found');
            }
            doc.photo = photo;
            doc.save();
        });
        // var textMessage = "successfully changed the avatar!"
        res.redirect("/user");
        return;
    });
}



//remain the ability to delete a user for future use;
var deleteUser = function(req, res, next) {
    var accountName = req.cookies["Username"];
    User.findOne({accountName:accountName}, function(err, result){
        if (err) {
            console.log('error occured in the database');
        }
        userInfo = result;
        var id = userInfo._id;
        User.findByIdAndRemove(id).exec();
        res.clearCookie("Username");
        res.redirect('/');
    });

};


//the functionality that allowed user to log in with their username and passord;
async function userLogin(req, res, next) {
    var accountName = req.body.accountName, password = req.body.password;

    // assert input from page
    if (!accountName || accountName == "") {
        res.render('user/login', {layout: "user-page", message: "Username can not be blank."});
        return false;
    } else if (!password || password == "") {
        res.render('user/login', {layout: "user-page", message: "Password can not be blank."});
        return false;
    }

    // compare input with records in db
    var userInfo;
    await User.findOne({accountName:accountName}, function(err, result) {
        if (err) {
            console.log('error occured in the database');
        }
        userInfo = result;


        if (userInfo == null) {
            res.render("user/login", {layout: "user-page", message:"Unregistered username. Please sign up"});
            return;
        }
        let saltFromHash = userInfo.password.substr(0, 29);
        let newHash = bcrypt.hashSync(password, saltFromHash);
        if (newHash.localeCompare(userInfo.password) == 0) { // login successful
            res.cookie("Username", accountName);
            res.redirect("/user");

        } else {
            res.render('user/login', {layout: "user-page", message: "Incorrect password. Please try again."});
        }
    });



    //Something wrong here, maybe async things.

    // if (userInfo == null) {
    //     res.render("user/login", {layout: "user-page", message:"Unregistered username. Please sign up"});
    //
    // } else if (password.localeCompare(userInfo.password) == 0) { // login successful
    //     res.cookie("Username", accountName);
    //     res.redirect("/user");
    //
    // } else {
    //     res.render('user/login', {layout: "user-page", message: "Incorrect password. Please try again."});
    // }

    return true;
}

//let user log out and clear the cookies;
function userLogout(req, res, next) {
    if(req.cookies["Username"] == null){
        res.redirect('../user/login');
    }else{
        res.clearCookie("Username");
        res.redirect("/");
    }

}


var updateImage = function(req, res, next){
    var image = req.body.photos;
    var description = req.body.imageDescription;
    var accName = req.cookies["Username"];
    var textMessage;

    if(image == null || image == ""){
        textMessage = "Please choose at least one image ";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    if(description == null || description == ""){
        textMessage = "Please add some description to your image ";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    if(accName != null){
        var accName = req.cookies["Username"];
        if(image != null && image != ""){
            User.findOne({accountName:accName}, function(err, result){
                if (err) {
                    console.log('error occured in the database');
                }
                var userInfo = result;
                var id = userInfo._id;

                User.findById(id, function(err, doc) {
                    if (err) {
                        console.error('error, no user found');
                    }
                    doc.image.push({file: image, description: description});
                    doc.save();
                    res.redirect("/edit-myfolio");
                });
            });
        }


    }

}

var updateMyPhoto = function(req, res, next) {
    var photo = req.body.myPhoto;
    var accName = req.cookies["Username"];
    var textMessage;

    if (photo == null || photo == "") {
        textMessage = "Please choose a photo of yourself! ";
        res.send(textMessage + '<a href = "/edit-myfolio">Go Back</a>');
        return;
    }

    if (accName != null) {
        var accName = req.cookies["Username"];
        if (photo != null && photo != "") {
            User.findOne({accountName: accName}, function (err, result) {
                if (err) {
                    console.log('error occured in the database');
                }
                result.myPhoto = photo;
                result.save();
                res.redirect("/edit-myfolio");
            })
        }

    }
}


var delPDF = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    await User.findOne({accountName: accountName}, function (err, result) {

        Info = result;
        for(var i = 0; i < Info.PDF.length; i++){

            if (Info.PDF[i].id == id){
                Info.PDF.remove(id);
                result.save();
                res.redirect("/edit-myfolio");
            }
        }
    });
};


var delImage = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    await User.findOne({accountName: accountName}, function (err, result) {

        Info = result;
        for(var i = 0; i < Info.image.length; i++){

            if (Info.image[i].id == id){
                Info.image.remove(id);
                result.save();
                res.redirect("/edit-myfolio");
            }
        }
    });
};


var delLink = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    await User.findOne({accountName: accountName}, function (err, result) {
        Info = result;
        for(var i = 0; i < Info.link.length; i++){

            if (Info.link[i].id == id){
                Info.link.remove(id);
                result.save();
                res.redirect("/edit-myfolio");
            }
        }
    });
};


var updateDescription = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    var description = req.body.newDescription;
    var type = req.body.PDFType;
    var textMessage;

    if (description == null || description == ""){
        textMessage = "Description can not be empty!";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    await User.findOne({accountName: accountName}, function (err, result) {
        Info = result;
        if (type != null) {
            for (var i = 0; i < Info.PDF.length; i++) {
                if (Info.PDF[i].id == id) {
                    Info.PDF[i].description = description;
                    result.save();
                    res.redirect("/edit-myfolio");
                }
            }
        }
        else{

            for (var i = 0; i < Info.image.length; i++) {
                if (Info.image[i].id == id) {
                    Info.image[i].description = description;
                    result.save();
                    res.redirect("/edit-myfolio");
                }
            }
        }
    });
};


var updateLink = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    var link = req.body.link;
    var description = req.body.description;
    var textMessage;
    var type = req.body.type;

    if (link == null || link == ""){
        textMessage = "Link can not be empty!";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    if (description == null || description == ""){
        textMessage = "Description can not be empty!";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    await User.findOne({accountName: accountName}, function (err, result) {
        Info = result;
        if (type == null ) {
            for (var i = 0; i < Info.link.length; i++) {
                if (Info.link[i].id == id) {
                    Info.link[i].description = description;
                    Info.link[i].file = link;
                    result.save();
                    res.redirect("/edit-myfolio");
                }
            }
        }
        else{
            var userInfo = result;

            User.findById(userInfo._id, function(err, doc) {
                if (err) {
                    console.error('error, no user found');
                }
                doc.link.push({file: link, description: description});
                doc.save();
                res.redirect("/edit-myfolio");
            });

        }

    });
};


var updateVideo = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    var video = req.body.video;
    var description = req.body.description;
    var textMessage;
    var type = req.body.type;

    if (video == null || video == ""){
        textMessage = "Video Link can not be empty!";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    if (description == null || description == ""){
        textMessage = "Description can not be empty!";
        res.send(textMessage+'<a href = "/edit-myfolio">Go Back</a>');
        return ;
    }

    await User.findOne({accountName: accountName}, function (err, result) {
        Info = result;
        if (type == null ) {
            for (var i = 0; i < Info.video.length; i++) {
                if (Info.video[i].id == id) {
                    Info.video[i].description = description;
                    Info.video[i].file = video;
                    result.save();
                    res.redirect("/edit-myfolio");
                }
            }
        }
        else{
            var userInfo = result;

            User.findById(userInfo._id, function(err, doc) {
                if (err) {
                    console.error('error, no user found');
                }
                doc.video.push({file: video, description: description});
                doc.save();
                res.redirect("/edit-myfolio");
            });

        }

    });
};

var delVideo = async function(req, res,next) {
    var accountName = req.cookies["Username"];
    var id = req.body.id;
    await User.findOne({accountName: accountName}, function (err, result) {
        Info = result;
        for(var i = 0; i < Info.video.length; i++){

            if (Info.video[i].id == id){
                Info.video.remove(id);
                result.save();
                res.redirect("/edit-myfolio");
            }
        }
    });
};

module.exports.findAllUsers = findAllUsers;
module.exports.createUser = createUser;
module.exports.updatePassword = updatePassword;
module.exports.updateAvatar = updateAvatar;
module.exports.deleteUser = deleteUser;
module.exports.userLogin = userLogin;
module.exports.userLogout = userLogout;
module.exports.delPDF = delPDF;
module.exports.updateUserInfo = updateUserInfo;
module.exports.updatePDF = updatePDF;
module.exports.updateDescription = updateDescription;
module.exports.updateImage = updateImage;
module.exports.delImage = delImage;
module.exports.updateMyPhoto = updateMyPhoto;
module.exports.updateLink = updateLink;
module.exports.delLink = delLink;
module.exports.updateVideo = updateVideo;
module.exports.delVideo = delVideo;
