const { deleteCommentByCommentId } = require('../controllers/ncNewsControllers');

const commentsRouter = require('express').Router();

commentsRouter.delete("/:comment_id",deleteCommentByCommentId)

module.exports = commentsRouter