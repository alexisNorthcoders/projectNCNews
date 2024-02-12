const express = require("express");
const apiRouter = require("./routes/api-router.js");
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


app.use("/api",apiRouter)

app.all("/*", (req, res, next) => {
    res.status(404).send({ message: "Path not found" });

});
app.use((err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';

    if (err.code === "23505") {
        statusCode = 400;
        message = `${err.topic} topic already exists!`;
    } else if (err.code === "42703") {
        statusCode = 400;
        message = 'Bad request!';
    } else if (err.code === "22P02") {
        if (err.patcharticle_id && !err.where.includes("$1")) {
            statusCode = 400;
            message = `${err.patcharticle_id} is an invalid article_id (number)`;
        } else if (err.inc_votes && !err.where.includes("$2")) {
            statusCode = 400;
            message = `${err.inc_votes}(inc_votes) is an invalid type (number)`;
        } else if (err.article_id || err.comment_id) {
            statusCode = 400;
            message = `${err.article_id || err.comment_id} is an invalid ${err.article_id ? 'article_id' : 'comment_id'} (number)`;
        }
    } else if (err.code === "23503") {
        if (err.article_id) {
            statusCode = 404;
            message = `Couldn't find article_id ${err.article_id}!`;
        } else if (err.username) {
            statusCode = 404;
            message = `Couldn't find username ${err.username}!`;
        } else if (err.topic && err.detail.includes("topic")) {
            statusCode = 404;
            message = `Couldn't find topic ${err.topic}`;
        } else if (err.author) {
            statusCode = 404;
            message = `Couldn't find author ${err.author}`;
        }
    } else if (err.code === "23502") {
        statusCode = 400;
        message = "Invalid request! Missing information!";
    } else if (err.statusCode === 404 || err.statusCode === 400) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).send({ message });
});


module.exports = app;