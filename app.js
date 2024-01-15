const express = require("express");
const { getTopics } = require("./controllers/topicsControllers");
const endpoints = require("./endpoints.json");
const { getArticleById } = require("./controllers/topicsControllers");
const { getArticles } = require("./controllers/topicsControllers");
const { getCommentsByArticleId } = require("./controllers/topicsControllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", (req,res,next) => {
    res.status(200).send({endpoints})
    next()
})
app.get("/api/articles/:article_id",getArticleById)
app.get("/api/articles",getArticles)
app.get("/api/articles/:article_id/comments",getCommentsByArticleId)

app.all("/*", (req, res, next) => {
    res.status(404).send({ message: "Path not found" });
  
})
app.use((err,req,res,next) =>{
    
    if (err.code === "22P02" && err.article_id){
        res.status(400).send({message:`${err.article_id} is an invalid article_id (number)`})
    }
    else if (err.statusCode === 404){
        
        res.status(404).send({message:err.message})
    }
    else {
        res.status(500).send({ message: 'Internal Server Error' })
    }
})


module.exports = app;