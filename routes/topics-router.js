const { getTopics } = require('../controllers/ncNewsControllers');

const topicsRouter = require('express').Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter