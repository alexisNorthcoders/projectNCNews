const express = require("express");
const apiRouter = require("./routes/api-router.js");


const app = express();
app.use(express.json());


app.use("/api",apiRouter)

app.all("/*", (req, res, next) => {
    res.status(404).send({ message: "Path not found" });

});
app.use((err, req, res, next) => {
    console.log(err)
    if (err.code === "42703") {
        res.status(400).send({ message: `Bad request!`})
    }
    if (err.code === "22P02") {
        if (err.patcharticle_id && !err.where.includes("$1")) {
            
            res.status(400).send({ message: `${err.patcharticle_id} is an invalid article_id (number)` });
        }
        else if (err.inc_votes && !err.where.includes("$2")) {
            
            res.status(400).send({ message: `${err.inc_votes}(inc_votes) is an invalid type (number)` });
        }
        else if (err.article_id ) {
            res.status(400).send({ message: `${err.article_id} is an invalid article_id (number)` });
        }
        else if (err.comment_id) {
            
            res.status(400).send({ message: `${err.comment_id} is an invalid comment_id (number)` });
        }
    }
    else if (err.code === "23503") {
        if (err.article_id) {
            res.status(404).send({ message: `Couldn't find article_id ${err.article_id}!` });
        }
        else if (err.username) {
            res.status(404).send({ message: `Couldn't find username ${err.username}!` });
        }
        else if (err.topic && err.detail.includes("topic")){
            res.status(404).send({message :`Couldn't find topic ${err.topic}`})
        }
        else if (err.author){
            res.status(404).send({message :`Couldn't find author ${err.author}`})
        }
       
    }
    else if (err.code === "23502") {
        res.status(400).send({ message: "Invalid request! Missing information!" });
    }
    else if (err.statusCode === 404) {

        res.status(404).send({ message: err.message });
    }
    else if (err.statusCode === 400) {

        res.status(400).send({ message: err.message });
    }
    else {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


module.exports = app;