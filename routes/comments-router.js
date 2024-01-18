const { deleteCommentByCommentId, patchCommentsByCommentId } = require('../controllers/ncNewsControllers');

const commentsRouter = require('express').Router();

commentsRouter.delete("/:comment_id",deleteCommentByCommentId)
commentsRouter.patch("/:comment_id",patchCommentsByCommentId)

module.exports = commentsRouter