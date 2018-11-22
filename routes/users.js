const express = require('express');//expressjs
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require("../config/database");//database file

const User = require("../models/user");

const mysql = require('mysql');//mysql
const db = mysql.createConnection(config.database);


//register
router.post('/register', (req, res, next) => {
    const email = req.body.email;
    //console.log(email);
    db.beginTransaction((err) => {
        if (err) throw err;
        User.addEmail(email, (err) => {
            if (err) {
                res.json({ success: false, msg: "Failed to register user " + err.sqlMessage });
                db.rollback();
                return;
            }
            //console.log("email added");
            User.getUserID(email, (err, data) => {
                if (err) {
                    console.log(err);
                    res.json({ success: false, msg: "Failed to register user " + err.sqlMessage });
                    db.rollback();
                    return;
                }
                //console.log(data);
                this.user_ID = data[0].user_ID;
                newUser = { user_ID: this.user_ID, password: req.body.password, user_type: req.body.user_type, name: req.body.name };
                User.addUser(newUser, (err, user) => {
                    if (err) {
                        //console.log(err);
                        res.json({ success: false, msg: "Failed to register user " + err.sqlMessage });
                        db.rollback();
                        return;
                    } else {
                        //res.json({ success: true, msg: "user registerd " });
                        if (req.body.user_type === 'customer') {
                            let customer = { cus_ID: this.user_ID, home_no: req.body.home_no, city: req.body.city, state: req.body.state, postal_code: req.body.postal_code, type: req.body.type }
                            User.addCustomer(customer, (err, data) => {
                                if (err) {
                                    //console.log(err);
                                    res.json({ success: false, msg: "Failed to register customer " + err.sqlMessage });
                                    db.rollback();
                                    return;
                                } else {
                                    res.json({ success: true, msg: "customer registerd " });
                                }
                            });
                        }

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

//authenticate
router.post('/login', (req, res, next) => {
    const user_ID = req.body.user_ID;
    const password = req.body.password;
    //console.log(user_ID);

    User.getUserById(user_ID, (err, data) => {
        if (err) throw err;
        //console.log(user);
        if (!data) {
            //console.log(err);
            res.json({ success: false, msg: "User not found" });
        }
        //console.log(data[0].password);
        User.comparePassword(password, data[0].password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                const token = jwt.sign(JSON.parse(JSON.stringify(data[0])), config.secret, {
                    expiresIn: 3600
                }); 
                var date = new Date();
                date = date.getUTCFullYear() + '-' +
                        ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
                        ('00' + date.getUTCDate()).slice(-2) + ' ' +
                        ('00' + date.getUTCHours()).slice(-2) + ':' +
                        ('00' + date.getUTCMinutes()).slice(-2) + ':' +
                        ('00' + date.getUTCSeconds()).slice(-2);     

                User.addLastlogin(date, user_ID, (err, data) => {
                    console.log("adding login time...");
                    if (err) throw err;
                    else console.log("login recorded");
                });

                res.json({
                    success: true,
                    token: token,
                    user: {
                        user_type: data[0].user_type,
                        name: data[0].name,
                        email: data[0].email
                    }
                });
            } else {
                return res.json({ success: false, msg: "wrong password" });
            }
        });
    });
});

router.post('/test', (req, res, next) => {
    User.test_func(req.body);
    if (res.err) {
        res.json({ success: false, msg: "failed to register" })
    }
    res.json({ success: true, msg: "customer registerd " });
});



module.exports = router;
