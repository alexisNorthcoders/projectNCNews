const db = require('../db/connection');

exports.fetchAllTopics = () => {
    const query = `SELECT * FROM topics`;
    return db.query(query).then((topics) => {
        return topics.rows;
    });
};
exports.fetchArticleById = (article_id) => {
    const queryParams = [article_id];
    const query = `SELECT * FROM articles
    WHERE article_id = $1`;
    return db.query(query, queryParams)
        .then(({ rows }) => {

            if (rows.length === 0) {
                return Promise.reject({ statusCode: 404, message: "Article not found" });
            }
            else {
                return rows[0];
            }
        });
};
exports.fetchArticles = () => {
    const query = `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`;
    return db.query(query)
        .then(({ rows }) => rows);
};
exports.fetchCommentsByArticleId = (article_id) => {
    const queryParams = [article_id];
    const query = `SELECT * FROM comments
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC`;
    return db.query(query, queryParams).then(({ rows }) => {

        return rows;
    });
};
exports.insertCommentByArticleId = (article_id, comment) => {
    const { username, body } = comment;

    const query = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`;
    const queryParams = [article_id, username, body];

    return db.query(query, queryParams).then(({ rows }) => rows[0]);
};
exports.updateVotesByArticleId = (article_id, inc_votes) => {
    const query = `UPDATE articles
SET votes = votes + $1
WHERE article_id = $2
RETURNING *`;
    const queryParams = [inc_votes, article_id];

    return db.query(query, queryParams).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ statusCode: 404, message: `Couldn't find article_id ${article_id}!` });
        }
        else{
        return rows[0]}
    });
};
exports.removeCommentByCommentId = (comment_id) =>{
    const query= `DELETE FROM comments WHERE comment_id = $1`

    return db.query(query,[comment_id]).then(({rowCount})=>{
        if (rowCount === 0) {
            return Promise.reject({ statusCode: 404, message: "Comment not found!" })
        }
        
    })
}
exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        return rows
    })
}