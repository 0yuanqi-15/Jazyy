var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    photo:{type: String, required: false},
    accountName: {type: String, required: true},
    password: {type: String, required: true},

    file:{type: [String], required: false},
    fname:{type: String, required: false},
    lname:{type: String, required: false},
    content: {type: String, required: false},
    country: {type: String, required: false},
    gender: {type: String, required: false},
    birthday: {type: String, required: false},
    occupation: {type: String, required: false},
    userphoto: {type: [String], required: false},
    customizekey1: {type: String, required: false},
    customizeInfo1: {type: String, required: false},
    customizekey2: {type: String, required: false},
    customizeInfo2: {type: String, required: false},
    customizekey3: {type: String, required: false},
    customizeInfo3: {type: String, required: false},
    PDF: [{file: String, description: String, required: false}],
    image: [{file: String, description: String, required: false}],
    myPhoto: {type:String, required: false},
    link: [{file: String, description: String, required: false}],
    video: [{file: String, description: String, required: false}]




}, {collection: 'Users'});

mongoose.model('users', userSchema);