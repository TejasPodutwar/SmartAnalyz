const express = require("express")
const user_router = express.Router();
const NewsArticle = require('../models/newsArticle');


user_router.get("/news",async (req,res)=>{
    try{
        const articles = await NewsArticle.find();
        res.send(articles);
    }catch(err){
        res.send({error: err});
    }
    
});


module.exports = user_router;