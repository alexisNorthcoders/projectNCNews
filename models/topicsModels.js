const db = require('../db/connection');

exports.fetchAllTopics=()=>{
    let query= `SELECT * FROM topics`
    return db.query(query).then((rows) => {
       
        return rows.rows 
    })
    
    

}