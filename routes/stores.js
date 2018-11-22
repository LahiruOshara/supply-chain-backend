const express = require('express');//expressjs
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require("../config/database");//database file

const Store = require("../models/store");

router.post('/addTruck', (req, res, next) => {
    let truckID=req.body.truckID;
    let storeID=req.body.storeID;

    Store.addTruck(truckID,storeID,(err)=>{
        if (err) {
            res.json({ success: false, msg: "Failed to add truck " + err.sqlMessage });
            return;
        }
        res.json({ success: true, msg: "truck registerd " });
    });


});

module.exports = router;

