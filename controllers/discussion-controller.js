var mongoose = require('mongoose');
var Discussion = mongoose.model('discussions');
var User = mongoose.model('users');


//to get all discussion
var getAllDiscussion = function(req, res, next) {

    var renderOptions = {layout: 'discuss-page', title: "Forum"};

    if (req.cookies["Username"] != null) {
        renderOptions.username = req.cookies["Username"];
    } else {
        renderOptions.message = "Please login to reply";
    }

    Discussion.find()
        .lean()
        .then(function(doc) {
            var username = req.cookies["Username"];
            if (req.cookies["Username"] != null) {
                User.findOne({accountName: username}, function (err, result) {
                    var photo = result.photo;
                    renderOptions.photo = photo;
                    renderOptions.items = doc.reverse();
                    res.render('discussion-board/discussion-board', renderOptions);
                });
            }
            else{
                renderOptions.items = doc.reverse();
                renderOptions.photo = "../resource/default.jpg";
                res.render('discussion-board/discussion-board', renderOptions);
            }
        });

};

//get date and time that when people submit a new discussion or reply
function getDate() {
    var date = new Date();
    var dt = date.toLocaleDateString()
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if(hour < 10){
        hour = "0" + hour;
    }
    if(minute < 10){
        minute = "0" + minute;
    }
    if(second < 10){
        second = "0" + second;
    }

    var nowtime = " "+ dt + "  " + hour + ":" + minute + ":" + second;
    return nowtime;
}


//let user can create a new discussion and submit
var createDiscussion = async function(req, res, next) {
    var accountName = req.cookies["Username"];
    var inputTitle = req.body.title;
    var inputContent = req.body.content;


    if (req.cookies["Username"] != null) {
        User.findOne({accountName: accountName}, function (err, result) {
            var avatar = result.photo;
            var item = {
                accountName:accountName,
                title: inputTitle,
                content: inputContent,
                date: getDate(),
                avatar: avatar
            };
            var data = new Discussion(item);
            data.save();

        })

        res.redirect('/discussion-board');

    } else {
        //if user havent log in, let them log in;
        res.redirect("/user/login");
    }


};

//used to delete discussion as user wish
var deleteDiscussion = async function(req, res, next) {
    var id = req.body.id;
    if(req.cookies["Username"] == req.body.accountName){
        await Discussion.findByIdAndRemove(id).exec();
        res.redirect('/discussion-board');
    }else{
        res.redirect('/discussion-board');
        //alert("You can only delete your own discussion");
        //res.redirect('/discussion-board');
        // alert("You can only delete your own discussion");
    }
};

var delReply = async function(req, res,next) {
    var accountName = req.body.accountName;
    // console.log(accountName);
    var  authorId = req.body.authorId;
    var id = req.body.id;

    await Discussion.findById(authorId, function(err, doc){

        discussionInfo = doc;
        for(var i = 0; i < discussionInfo.reply.length; i++){

            if (discussionInfo.reply[i].id == id){
                console.log(discussionInfo.reply[i].content);
                discussionInfo.reply.remove(id);
                doc.save();
                res.redirect("/discussion-board");
            }
        }
    });
};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


//a functionality that to reply to the discussion;
var reply = async function(req,res,next){

    var replyContent = req.body.reply;
    var username = req.cookies["Username"];

    if (replyContent == "" | !replyContent) {
        res.redirect("/discussion-board");
        return;
    }

    //make sure user is logged in;
    if (req.cookies["Username"] != null) {
        var id = req.body.id;
        //find the discussion and add the reply to it;
        await Discussion.findById(id, function(err, doc){
            if(err){
                console.error('error, no user found');
            }
            User.findOne({accountName: username}, function (err, result) {
                var avatar = result.photo;
                doc.reply.unshift({accountName:username ,content:replyContent, date:getDate(), author_id: id, avatar: avatar});
                doc.save();
                
            })

            res.redirect("/discussion-board");
        });

    } else {
        //if user havent log in, let them log in;
        res.redirect("/user/login");
    }

}

//user can like the discussion that may useful
var like = async function(req,res,next) {
    var id = req.body.id;
    var username = req.cookies["Username"];
    if (username != null) {
        await Discussion.findById(id, function (err, doc) {
            if (err) {
                console.error('error, no user found');
            }
            doc.likes++;
            doc.save();
            res.redirect("/discussion-board");
        });
    }
    else{
        //if user havent log in, let them log in;
        res.redirect("/user/login");
    }

}



module.exports.createDiscussion = createDiscussion;
module.exports.getAllDiscussion = getAllDiscussion;
module.exports.deleteDiscussion = deleteDiscussion;
module.exports.reply = reply;
module.exports.like = like;
module.exports.delreply = delReply;