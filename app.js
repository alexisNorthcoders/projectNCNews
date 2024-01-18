const express = require("express");
const { getTopics, postCommentByArticleId, patchVotesByArticleId, deleteCommentByCommentId, getUsers } = require("./controllers/ncNewsControllers.js");
const endpoints = require("./endpoints.json");
const { getArticleById } = require("./controllers/ncNewsControllers.js");
const { getArticles } = require("./controllers/ncNewsControllers.js");
const { getCommentsByArticleId } = require("./controllers/ncNewsControllers.js");


const app = express();
app.use(express.json());


app.get("/api/topics", getTopics);

app.get("/api", (req, res, next) => {
    res.status(200).send({ endpoints });
    next();
});
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.all("/*", (req, res, next) => {
    res.status(404).send({ message: "Path not found" });

});
app.use((err, req, res, next) => {
    
    if (err.code === "22P02") {
        if (err.patcharticle_id && err.where.includes("$2")) {
            res.status(400).send({ message: `${err.patcharticle_id} is an invalid article_id (number)` });
        }
        else if (err.inc_votes) {
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
    }
    else if (err.code === "23502") {
        res.status(400).send({ message: "Invalid request! Missing information!" });
    }
    else if (err.statusCode === 404) {

        res.status(404).send({ message: err.message });
    }
    else {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


module.exports = app;