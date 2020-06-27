const mongoose = require('mongoose');
const mongo = require('mongodb');
const dotenv = require('dotenv/config');
const bcrypt = require('bcrypt');
db = mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true,useUnifiedTopology: true },()=>console.log('connected'));


const schema = new mongoose.Schema({
    username:{
        type:String,
        min:1,
        max:10,
        required:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    email:{
        type:String,
        required:true
    }
})
//hashing a password before saving it to the database
schema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });
module.exports = mongoose.model('User',schema);