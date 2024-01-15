const db = require('../db/connection');

exports.fetchAllTopics = () => {
    const query = `SELECT * FROM topics`;
    return db.query(query).then((topics) => {
        return topics.rows;
    });
};
exports.fetchArticleById = (article_id) => {
    const queryParams = [article_id]
    
    const query = `SELECT * FROM articles
    WHERE article_id = $1`
    return db.query(query,queryParams)
    .then((article)=> {
        
        if (article.rows.length === 0){
            return Promise.reject({statusCode:404,message:"Article not found"})
        }
        else{
        return article.rows[0]
        }
    })
    
}
exports.fetchArticles = () => {
    const query = `SELECT articles.author,articles.title,articles.article_id,articles.topic,articles.created_at,articles.votes,articles.article_img_url,
    COUNT(comments.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url
    ORDER BY articles.created_at DESC`
    return db.query(query)
    .then((articles)=> articles.rows)
}