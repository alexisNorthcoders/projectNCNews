const express = require("express");
const { getTopics } = require("./controllers/topicsControllers");
const endpoints = require("./endpoints.json")

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", (req,res,next) => {
    res.status(200).send({endpoints})
    next()
   
})

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
  
})



module.exports = app;