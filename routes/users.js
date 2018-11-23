const express = require('express');//expressjs
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require("../config/database");//database file

const User = require("../models/user");

//authenticate
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let user_ID = null;
    //console.log(email);
    User.getUserID(email, (err, data) => {
        if (err) {
            res.json({ success: false, msg: "Email not found " + err.sqlMessage });
            return;
        }
        if(!data[0]){
            res.json({ success: false, msg: "User not found" });
            return;
        }
        //console.log(data[0]);
        this.user_ID = data[0].user_ID;
        //console.log(this.user_ID);
        User.getUserById(this.user_ID, (err, data) => {
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
                    User.addLastlogin(this.user_ID, (err, data) => {
                        if (err) {
                            User.rollbackFunc((err) => {
                                if (err) {
                                    res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                                    return;
                                }
                            });
                            return;
                        }
                        console.log("login recorded");
                        res.json({
                            success: true,
                            token: token,
                            user: {
                                user_type: data[0].user_type,
                                name: data[0].name,
                                email: data[0].email
                            }
                        });
                    });
                } else {
                    return res.json({ success: false, msg: "wrong password" });
                }
            });
        });
    });
});



//register
router.post('/register', (req, res, next) => {
    const email = req.body.email;
    User.createTransaction((err) => {
        if (err) {
            res.json({ success: false, msg: "Failed to register user " + err.sqlMessage });
            return;
        }
        console.log("transaction started");
        //adding email to the database
        User.addEmail(email, (err) => {
            if (err) {
                User.rollbackFunc((err) => {
                    if (err) {
                        res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                        return;
                    }
                });
                console.log("roleback done!");
                res.json({ success: false, msg: "Failed to register user " + err.sqlMessage });
                return;
            }
            //getting user id back from the database
            User.getUserID(email, (err, data) => {
                if (err) {
                    User.rollbackFunc((err) => {
                        if (err) {
                            res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                            return;
                        }
                    });
                    console.log("roleback done!");
                    res.json({ success: false, msg: "Failed to register user " + err.sqlMessage });
                    return;
                }

                this.user_ID = data[0].user_ID;
                newUser = { user_ID: this.user_ID, password: req.body.password, user_type: req.body.user_type, name: req.body.name };

                //adding user to the database
                User.addUser(newUser, (err, user) => {
                    if (err) {
                        User.rollbackFunc((err) => {
                            if (err) {
                                res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                                return;
                            }
                            console.log("roleback done!");
                        });
                        res.json({ success: false, msg: "Failed to register user " + err.sqlMessage });
                        return;
                    }
                    User.addLastlogin(this.user_ID, (err, data) => {
                        if (err) {
                            User.rollbackFunc((err) => {
                                if (err) {
                                    res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                                    return;
                                }
                            });
                        }
                        else console.log("login recorded");


                        if (newUser.user_type === 'customer') {
                            customer = { cus_ID: this.user_ID, home_no: req.body.home_no, city: req.body.city, state: req.body.state, postal_code: req.body.postal_code, type: req.body.type };
                            User.addCustomer(customer, (err) => {
                                if (err) {
                                    User.rollbackFunc((err) => {
                                        if (err) {
                                            res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                                            return;
                                        }
                                        console.log("roleback done!");
                                    });
                                    res.json({ success: false, msg: "Failed to register customer " + err.sqlMessage });
                                    return;
                                }
                                User.commitTrans((err) => {
                                    if (err) {
                                        User.rollbackFunc((err) => {
                                            if (err) {
                                                res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                                                return;
                                            }
                                            console.log("roleback done!");
                                        });
                                    }
                                    console.log('Transaction Complete.');
                                    res.json({ success: true, msg: "customer registerd " });
                                });

                            });
                        }
                    });
                });
            });
        });
    });
});



module.exports = router;
/**   User.commitTrans((err) => {
                        if (err) {
                            User.rollbackFunc((err) => {
                                if (err) {
                                    res.json({ success: false, msg: "rollback error " + err.sqlMessage });
                                    return;
                                }
                                console.log("roleback done!");
                            });
                        }
                        console.log('Transaction Complete.');
                        res.json({ success: true, msg: "user registerd " });
                    }); */