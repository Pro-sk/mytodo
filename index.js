const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const Blog = require('./models/Blog');
const mongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv/config');
const app = express();

const conn = mongoose.createConnection(process.env.DB_CONNECT,{useNewUrlParser: true,useUnifiedTopology: true },()=>console.log('connected'));

const connection = new mongoStore({
  mongooseConnection:conn,
  collection:'sessions',
  ttl: 14 * 24 * 60 * 60 
}); 

app.use(session({
  name:'user',
  secret: 'keyboard cat',
  saveUninitialized: false, // don't create session until something stored
  resave: false,
  store: connection
}));

const ejs = require('ejs');


app.set('view engine','ejs');
app.set('trust proxy', 1) // trust first proxy


//import route
const postroute = require('./views/posts/Post');
const userroute = require('./views/users/User');

// const singleBlog = require('./middleware/user');

app.use('/assets',express.static('assets'));

app.use('/post',postroute);
app.use('/user',userroute);

app.get('/',function(req,res){
    const blog = Blog.find({},function(err,data){
        res.render('home',{data:data,request:req});
    }).sort({_id:'-1'}).limit(3);
})
app.listen(process.env.PORT||5000,()=>console.log("Server is running..."));

module.exports = app;