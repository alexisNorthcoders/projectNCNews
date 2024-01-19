const { deleteCommentByCommentId, patchCommentsByCommentId } = require('../controllers/ncNewsControllers');

const commentsRouter = require('express').Router();

commentsRouter
    .route("/:comment_id")
    .delete(deleteCommentByCommentId)
    .patch(patchCommentsByCommentId);

module.exports = commentsRouter;