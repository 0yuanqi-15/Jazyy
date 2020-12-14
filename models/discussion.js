var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var discussionSchema = new Schema({
    accountName: String,
    title: String,
    content: String,
    likes: {type: Number, default: 0},
    date: {type: String},
    avatar: String,
    reply: [{accountName: String, content: String, date: {type: String}, author_id: {type: String}, avatar:String}]
}, {collection: 'Discussions'});

mongoose.model('discussions', discussionSchema);