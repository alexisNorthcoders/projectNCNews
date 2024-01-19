const { getTopics, postTopic } = require('../controllers/ncNewsControllers');

const topicsRouter = require('express').Router();

topicsRouter
    .route("/")
    .get(getTopics)
    .post(postTopic);

module.exports = topicsRouter;