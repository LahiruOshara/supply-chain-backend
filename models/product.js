const mysql = require('mysql');//mysql
const bcrypt = require('bcryptjs');
const config = require("../config/database");//database file

const db = mysql.createConnection(config.database);

module.exports.addProduct = function (product,callback) {
    let sql = "INSERT INTO product SET ?";//INSERT INTO email_userID (email) VALUE ();
    db.query(sql,product,callback);
}

module.exports.getProduct=function(product_ID,callback){
    let sql = `SELECT * from product where product_ID=${product_ID}`;
    db.query(sql,callback);
}

//work in progress
module.exports.updateProduct=function(update,product_ID,callback){
        let sql=`UPDATE product SET ? WHERE product_ID=${product_ID}`;
        db.query(sql,update,callback);
}

module.exports.removeProduct=function(product_ID,callback){
        sql=`DELETE FROM product WHERE product_ID=${product_ID}`;
        db.query(sql,callback);
}