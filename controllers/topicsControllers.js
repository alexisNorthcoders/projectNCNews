const { fetchAllTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, insertCommentByArticleId } = require("../models/topicsModels");


exports.getTopics = (req, res, next) => {
    fetchAllTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch((err) => next(err));
};
exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params;

    fetchArticleById(article_id)
        .then((article) => res.status(200).send({ article }))
        .catch((err) => {
            err.article_id = article_id;
            return next(err);
        });
};
exports.getArticles = (req, res, next) => {
    fetchArticles().then((articles) => {

        res.status(200).send({ articles });
    });
};
exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const articleExistsQuery = fetchArticleById(article_id);
    const commentsByArticleIdQuery = fetchCommentsByArticleId(article_id);
    Promise.all([articleExistsQuery, commentsByArticleIdQuery])
        .then((response) => {
            const comments = response[1];
            res.status(200).send({ comments });
        })
        .catch((err) => {
            err.article_id = article_id;
            next(err);
        });
};
exports.postCommentByArticleId = (req,res,next) => {
    const {article_id} = req.params
    const {body} = req
    
    insertCommentByArticleId(article_id,body).then((comment) => {
        res.status(201).send({comment})
    }).catch(err => next(err))
}