const mysql = require('mysql');//mysql
const bcrypt = require('bcryptjs');
const config = require("../config/database");//database file

const db = mysql.createConnection(config.database);

module.exports.addEmail = function (email, callback) {
    console.log(email);
    let em = { email: email };
    let sql = "INSERT INTO email_userID SET ?";//INSERT INTO email_userID (email) VALUE ();
    db.query(sql, em, callback);
}

module.exports.getUserID = function (email, callback) {
    let em = { email: email };
    let sql = `SELECT user_ID FROM email_userID where email ="${email}"`;//SELECT user_ID FROM email_userID where email
    db.query(sql, email, callback);
}

module.exports.addUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (error, salt) {
        bcrypt.hash(newUser.password, salt, function (error, hash) {
            //console.log(newUser,salt,error);
            if (error) throw error;
            newUser.password = hash;
            let sql = "INSERT INTO User SET ?";
            db.query(sql, newUser, callback);
        });
    });
}

module.exports.addLastlogin = function (date, user_ID, callback) {

    /*UPDATE Customers
    SET ContactName='Juan'
    WHERE Country='Mexico';*/

    let sql = `UPDATE User SET last_login=${date} WHERE user_ID=${user_ID}`
    db.query(sql, callback);
}

module.exports.addCustomer = function (customer, callback) {
    let sql = "INSERT INTO Customer SET ?";
    db.query(sql, customer, callback);
}

module.exports.getUserById = function (user_ID, callback) {
    //console.log(user_ID);
    let sql = `SELECT * from User where user_ID=${user_ID}`;
    db.query(sql, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (error, isMatch) {
        if (error) throw error;
        callback(null, isMatch);
    });
}

















































/*
module.exports.test_func = function (newUser, callback) {
    let email = newUser.email;
    let user_ID = null;
    db.beginTransaction((err) => {
        if (err) throw err;
        let em = { email: newUser.email };
        let sql = "INSERT INTO email_userID SET ?";//INSERT INTO email_userID (email) VALUE ();
        db.query(sql, em, (err, data) => {
            if (err) {
                db.rollback(() => {
                    throw err;
                });
            }
            //getting user id back

            let sql = `SELECT user_ID FROM email_userID where email ="${email}"`;
            db.query(sql, (err, data) => {
                if (err) {
                    db.rollback(() => {
                        throw err;
                    });
                }
                this.user_ID = data[0].user_ID;

                nUser = { user_ID: this.user_ID, password: newUser.password, user_type: newUser.user_type, name: newUser.name };

                bcrypt.genSalt(10, function (error, salt) {
                    bcrypt.hash(nUser.password, salt, function (error, hash) {
                        //console.log(newUser,salt,error);
                        if (error) throw error;
                        nUser.password = hash;
                        let sql = "INSERT INTO User SET ?";
                        db.query(sql, nUser, function (err, result) {
                            if (err) {
                                db.rollback(function () {
                                    throw err;
                                });
                            }
                            db.commit(function (err) {
                                if (err) {
                                    connection.rollback(function () {
                                        throw err;
                                    });
                                }
                                console.log('Transaction Complete.');
                                db.end();
                            });
                        });
                    });
                });


            });
        });
    });
}*/



