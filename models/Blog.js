const mongoose = require('mongoose');
const mongo = require('mongodb');
const dotenv = require('dotenv/config');

db = mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true,useUnifiedTopology: true },()=>console.log('connected'));


const schema = new mongoose.Schema({
    user:{
        type:Array,
        min:1,
        required:true
    },
    title:{
        type:String,
        required:true,
        min:5
    },
    desc:{
        type:String,
        required:true,
        min:10,
        max:500
    },
    date_uploaded:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('Blog',schema);