const mysql = require('mysql');//mysql
const bcrypt = require('bcryptjs');
const config = require("../config/database");//database file

const db = mysql.createConnection(config.database);

module.exports.addTruck = function (truck_ID,store_ID, callback) {
    console.log("addTruck");
    let truck={truck_ID:truck_ID,store_ID:store_ID};
    let sql = "INSERT INTO Truck SET ?";//INSERT INTO email_userID (email) VALUE ();
    db.query(sql,truck,callback);
}
