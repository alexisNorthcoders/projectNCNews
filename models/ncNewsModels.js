const { use } = require('../app');
const db = require('../db/connection');

exports.fetchAllTopics = () => {
    const query = `SELECT * FROM topics`;
    return db.query(query).then((topics) => {
        return topics.rows;
    });
};
exports.fetchArticleById = (article_id) => {
    const queryParams = [article_id];
    const query = `SELECT articles.*,
    CAST(COUNT(comments.article_id) AS int) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `;
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
exports.fetchArticles = (topic, sort_by = "created_at", order = "DESC",limit=10,p=1) => {
    const validSortQueries = ["author", "title", "article_id", "topic", "created_at", "votes", "comment_count"];
    const validOrderQueries = ["asc", "desc"];
    const offset = limit * (p-1)
    
    if (!validSortQueries.includes(sort_by)) {

        return Promise.reject({ statusCode: 400, message: `${sort_by} is not a valid sort_by value` });
    }
    if (!validOrderQueries.includes(order.toLowerCase())) {
        return Promise.reject({ statusCode: 400, message: `${order} is not a valid order value` });
    }
    if (typeof parseInt(limit) !== "number"){
        return Promise.reject({ statusCode: 400, message: `${limit} is not a valid limit value` });
    }
    if (typeof parseInt(p) !== "number"){
        return Promise.reject({ statusCode: 400, message: `${p} is not a valid page value` });
    }
    const queryParams = [];
    let query = `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

    if (topic) {
        queryParams.push(topic);
        query += ` WHERE articles.topic = $1`;
    }
    query += ` GROUP BY articles.article_id
               ORDER BY articles.${sort_by} ${order}`;

    query += ` LIMIT ${limit}`

    if (p){
        query += ` OFFSET ${offset}`
    }


    return db.query(query, queryParams)
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

        return rows[0];

    });
};
exports.removeCommentByCommentId = (comment_id) => {
    const query = `DELETE FROM comments WHERE comment_id = $1`;

    return db.query(query, [comment_id]).then(({ rowCount }) => {
        if (rowCount === 0) {
            return Promise.reject({ statusCode: 404, message: "Comment not found!" });
        }

    });
};
exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`).then(({ rows }) => {
        return rows;
    });
};
exports.fetchUserByUsername = (username) => {
    const query = `SELECT * FROM users WHERE username = $1`;
    const queryParams = [username];

    return db.query(query, queryParams).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ statusCode: 404, message: `${username} not found!` });
        }
        return rows[0];
    });
};
exports.updateCommentByCommentId = (inc_votes, comment_id) => {
    const query = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`;
    const queryParams = [inc_votes, comment_id];

    return db.query(query, queryParams).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ statusCode: 404, message: `comment_id ${comment_id} not found!` });
        }
        return rows[0];
    });
};
exports.insertArticle = (article) => {

    let query = `INSERT INTO articles (author,title,body,topic `;
    const queryParams = [article.author, article.title, article.body, article.topic];
    if (article.article_img_url) {
        queryParams.push(article.article_img_url);
        query += `,article_img_url`;
    }
    query += `) VALUES ($1, $2, $3 ,$4 `;
    if (article.article_img_url) {

        query += `,$5`;
    }
    query += `) RETURNING * `;



    return db.query(query, queryParams).then(({ rows }) => {
        return rows[0];
    });
}

