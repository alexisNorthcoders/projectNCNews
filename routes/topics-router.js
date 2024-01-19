const { getTopics, postTopic } = require('../controllers/ncNewsControllers');

const topicsRouter = require('express').Router();

topicsRouter.get("/", getTopics);

topicsRouter.post("/", postTopic)

module.exports = topicsRouter