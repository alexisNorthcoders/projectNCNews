const { getArticles, getArticleById, getCommentsByArticleId, patchVotesByArticleId, postCommentByArticleId, postArticle, deleteArticle } = require('../controllers/ncNewsControllers');

const articlesRouter = require('express').Router();

articlesRouter
    .route("/")
    .get(getArticles)
    .post(postArticle);
articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchVotesByArticleId)
    .delete(deleteArticle);
articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId);

module.exports = articlesRouter;