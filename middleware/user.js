const mongoos = require('mongoose');
const mongo = require('mongodb');
const Blog = require('../models/Blog');

const getSingleBlog = function(req,res,next){
    Blog.find({_id:req.params('id')},function(err,data) {
        return data;
    });
}

module.exports = getSingleBlog;