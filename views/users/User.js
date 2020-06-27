const app = require('../../index');
const router = require('express').Router();
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const mongo = require('mongodb');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Blog = require('../../models/Blog');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/',function(req,res){
    
});

function isLogined(req,res,next){
    if(req.session.user)
    {
        res.redirect('/');
    }
    else{
        next();
    }
}

function checkLogin(req,res,next){
    if(req.session.user)
    {
        next();
    }
    else{
        res.redirect('/user/login');
    }
}

router.get('/register',isLogined,function(req,res){
    res.render('register',{request:req});
})

router.post('/register',urlencodedParser,function(req,res){
    const check = User.find({email:req.body.email},function(err,data){
        if(data.length>=1)
        {
            res.render('register',{error:"Email already register !!! try to login",request:req});
        }
        else{
                const user = new User(req.body);
                user.save(function(err,data){
                if(err) throw err;
                res.redirect('/user/login');
            });
        }
    });
});

function userexist(email)
{
    const check = User.find({email:email},function(err,data){
        if(!data)
        {
            return false;
        }
        else{
            return true;
        }
    });
}
router.get('/login',isLogined,function(req,res){
    res.render('login',{request:req});
})
router.post('/login',urlencodedParser,function(req,res){
    if(!userexist(req.body.email))
    {
        const check = User.find({email:req.body.email},function(err,user){
            bcrypt.compare(req.body.password, user[0].password, function (err, result) {
                if (result === true) {
                    req.session.user = user[0];
                    // (req.session);
                    res.redirect('/');
                } else {
                    res.render('login',{error:'incorrect password',request:req});
                }
                });
        });
    }
    else{
        res.render('login',{error:'User is not Registered',data:data,request:req});
    }
});


router.get('/profile',checkLogin,function(req,res){
    const data = User.findById(req.session.user['_id'],function(err,data){
        res.render('profile',{data:data,data:data,request:req});
    });
});

router.post('/profile',checkLogin,urlencodedParser,function(req,res){
    const data = User.findByIdAndUpdate(req.body.id,req.body,function(err,pastData){
        Blog.updateMany({user:[pastData.id,pastData.username,pastData.email]},{$set:{'user':[req.body.id,req.body.username,req.body.email]}},function(err,newBlogData){
        });
        User.findById(req.body.id,function(err,newData){
            res.render('profile',{data:newData,request:req});
        });
    });
});

router.get('/logout',function(req,res,next){
    if (req.session.user) {
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            res.clearCookie('user');
            return res.redirect('/user/login');
          }
        });
      }
      else{
        req.session.destroy(()=>{});
        res.redirect('/');
      }
})
module.exports = router;