const app = require('../../index');
const router = require('express').Router();
const user = require('../users/User');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongo = require('mongodb');
const session = require('express-session');
const Blog = require('../../models/Blog');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/',function(req,res){
    const blog = Blog.find({},function(err,data){
        res.render('blogs',{data:data,request:req});
    }).sort({_id:'-1'});
})

router.get('/new',function(req,res){
    res.render('new-blog',{request:req});
})

router.get('/delete/:id',function(req,res){
    Blog.findByIdAndDelete({_id:mongo.ObjectID(req.param('id'))},function(err,data){
        if(err) throw err;
        res.redirect('/post');
    });
});

router.get('/edit/:id',function(req,res){
    const blog = Blog.findById(req.param('id'),function(err,data){
        if(err) throw err;
        res.render('edit',{data:data,request:req});
    })
});

router.post('/edit',urlencodedParser,function(req,res){
    const blog = Blog.findByIdAndUpdate(req.body.id,{$set:req.body},function(err,data){
        if(err) throw err;
        res.redirect(`/post/${req.body.id}`);
    })
});

router.post('/new',urlencodedParser,function(req,res){
    const blog = new Blog({
        user: [req.session.user['_id'],req.session.user.username,req.session.user.email],
        title:req.body.title,
        desc:req.body.desc
    });
    blog.save(function(err,data){
        if(err) throw err;
    });
    res.redirect('/post');
})

router.get('/:id',function(req,res){

    const blog = Blog.find({_id:mongo.ObjectID(req.param('id'))},function(err,data){
        if(err || data.length<=0)
        {
            res.render('404',{error:'No Blog Found',request:req});
        }
        else{
            res.render('blog',{data:data,request:req});
        }
        
    });
});
module.exports = router;