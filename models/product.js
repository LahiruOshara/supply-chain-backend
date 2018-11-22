const mysql = require('mysql');//mysql
const bcrypt = require('bcryptjs');
const config = require("../config/database");//database file

const db = mysql.createConnection(config.database);

module.exports.addProduct = function (product,callback) {
    let sql = "INSERT INTO product SET ?";//INSERT INTO email_userID (email) VALUE ();
    db.query(sql,product,callback);
}

//work in progress
module.exports.updateProduct=function(update,callback){
    if(update.fragility!=undefined){
        let sql=`UPDATE product SET fragility=${update.fragility} WHERE product_ID=${update.product_ID}`;
        db.query(sql,update,callback);
    }
    if(update.capacity!=undefined){
        let sql=`UPDATE product SET fragility=${update.capacity} WHERE product_ID=${update.product_ID}`;
        db.query(sql,update,callback);
    }
    if(update.price!=undefined){
        let sql=`UPDATE product SET fragility=${update.price} WHERE product_ID=${update.product_ID}`;
        db.query(sql,update,callback);
    }
}

module.exports.removeProduct=function(product_ID,callback){
    let sql=`DELETE FROM product WHERE product_ID=${product_ID}`;
    db.query(sql,callback);
}