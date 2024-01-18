const { getArticles, getArticleById, getCommentsByArticleId, patchVotesByArticleId, postCommentByArticleId } = require('../controllers/ncNewsControllers');

const articlesRouter = require('express').Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id",getArticleById)
articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.patch("/:article_id", patchVotesByArticleId);

articlesRouter.post("/:article_id/comments", postCommentByArticleId);

module.exports = articlesRouter