require('dotenv').config();
var mongoose = require('mongoose');
// const uri = process.env.CONNECTION_URL;
const uri = CONNECTION_URL = "mongodb+srv://net_user:adminadmin@jazyy.07mlv.mongodb.net/jazyy?retryWrites=true&w=majority"

mongoose.connect(uri,
    function(err){
    if(!err){
        console.log('Connected to mongo.');
    }else{
        console.log('Failed to connect to mongo!', err);
    }
});

require('./user.js');
require('./discussion.js');
