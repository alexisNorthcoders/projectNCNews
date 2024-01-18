const { checkTopicExists } = require("../db/seeds/utils");
const { fetchAllTopics, fetchArticleById, fetchArticles, fetchCommentsByArticleId, insertCommentByArticleId, updateVotesByArticleId, removeCommentByCommentId, fetchUsers } = require("../models/ncNewsModels");


exports.getTopics = (req, res, next) => {
    fetchAllTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch((err) => 
        {
        return next(err)});
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
    const {topic} = req.query
    const fetchArticlesQuery = fetchArticles(topic)
    const allQueries = [fetchArticlesQuery]
    
    if (topic) {  
        const topicExistsQuery = checkTopicExists(topic)
        allQueries.push(topicExistsQuery)
    }
    
    Promise.all(allQueries)
    .then((response) => {
        const articles = response[0]
        res.status(200).send({ articles });
    })
    .catch(err => next(err))
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
exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { body } = req;

    insertCommentByArticleId(article_id, body).then((comment) => {
        res.status(201).send({ comment });
    }).catch(err => {

        if (err.detail.includes("author")) { err.username = body.username; }
        else if (err.detail.includes("article_id")) { err.article_id = article_id; }


        return next(err);

    });
};
exports.patchVotesByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { body: { inc_votes } } = req;

    updateVotesByArticleId(article_id, inc_votes).then((article) => {

        res.status(200).send({ article });
    })
        .catch(err => {
            err.patcharticle_id = article_id
            err.inc_votes = inc_votes
            return next(err);
        });
};
exports.deleteCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params;
    removeCommentByCommentId(comment_id).then(() => {
        res.status(204).send();
    })
        .catch(err => {
            err.comment_id = comment_id;
            return next(err);
        });
};
exports.getUsers = (req, res, next) => {
    fetchUsers()
    .then((users)=> {res.status(200).send({users})})
    .catch((err)=> {return next(err)})
};