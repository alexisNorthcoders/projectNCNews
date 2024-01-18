const { getUsers } = require('../controllers/ncNewsControllers');

const usersRouter = require('express').Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter