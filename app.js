const express = require('express');//expressjs
const path = require('path');// a core module, don't have to npm install
const mysql = require('mysql');//mysql
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require("./config/database");//database file

const port = '4000';// port number

const app = express();//initializing express
const users = require("./routes/users"); // user routes
const products=require("./routes/products");//product routes
const stores=require("./routes/stores")//store routes

//cors lets us access our middleware using a different domain name
app.use(cors());

//Body Parser Middleware
app.use(bodyParser.json()); // Parsers incoming data

//pasport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection(config.database);

//start server
app.listen(port, () => {
    console.log("server started on port " + port);
});

//*******ROUTES*********//

//user routes
app.use('/users', users);

app.use('/products',products);

app.use('/stores',stores);

//index route
app.get('/', (req, res) => {
    res.send('Index Page');
})

//add user
app.post('/register', (req, res, next) => {
    //let user={password:"1234",user_type:"customer",name:"oshara",email:"t@test.com"}
    let user = { password: req.body.password, user_type: req.body.user_type, name: req.body.name, email: req.body.email };
    console.log(req.body);
    //console.log(req.password);
    let sql = "INSERT INTO user SET ?";
    db.query(sql, user, (err, result) => {
        if (err) {
            res.json(err.sqlMessage + " re-enter the email");
            return;
        }
        //console.log(result);
        res.json("user registerd");
    });
});

//login
app.get('/login', (req, res, next) => {
    let sql = "SELECT * from user";
    db.query(sql, (err, result) => {
        if (err) {
            res.json(err.sqlMessage + " re-enter the email");
            return;
        }
        console.log(result);
        res.json("displayed");
    });
});













