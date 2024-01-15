const express = require("express");
const { getTopics } = require("./controllers/topicsControllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("/*", (req, res, next) => {
    res.status(404).send({ msg: "Path not found" });
})

app.use((err, req, res,next) => {

});

module.exports = app;