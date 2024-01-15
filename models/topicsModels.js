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
            return Promise.reject({message:"Article not found"})
        }
        else{
        return article.rows[0]
        }
    })
    
}