/**
 * author: lints
 * date: 2017-12-1
 * mysql数据库连接
 */
const mysql = require('mysql');
const dbConfig = require('./db.conf');

function db() {
    return mysql.createConnection(dbConfig);
}


module.exports = db;