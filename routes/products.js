const express = require('express');//expressjs
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require("../config/database");//database file

const Product = require("../models/product");

router.post('/addProduct', (req, res, next) => {
    product = { fragility: req.body.fragility, capacity: req.body.capacity, price: req.body.price };
    Product.addProduct(product, (err) => {
        if (err) {
            res.json({ success: false, msg: "Failed to add product " + err.sqlMessage });
            return;
        }
        res.json({ success: true, msg: " Product added " });
    });
});

router.post('/removeProduct', (req, res, next) => {
    let product_ID = req.body.product_ID;
    Product.getProduct(product_ID, (err, data) => {
        if (err) throw err;
        if (!data[0]) {
            //console.log(err);
            console.log("not found!!!");
            res.json({ success: false, msg: "Product not found" });
            return;
        }
        Product.removeProduct(product_ID, (err) => {
            if (err) {
                res.json({ success: false, msg: "Failed to remove product " + err.sqlMessage });
                return;
            }
            res.json({ success: true, msg: " Product removed " })
        });
    });
});

router.post('/updateProduct', (req, res) => {
    Product.updateProduct(req.body.update, req.body.product_ID, (err) => {
        if (err) {
            res.json({ success: false, msg: "Failed to update product details" + err.sqlMessage });
            return;
        }
        res.json({ success: true, msg: "Product details updated" })
    });
});

module.exports = router;

