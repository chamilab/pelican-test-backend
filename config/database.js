const mysql = require("mysql2/promise");
global.logger = require("./log");

var mysqlSettings = {
    host: 'localhost',
    user: "root",
    database: "pelican_todo",
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
    password: 'root'
  };
  
  const pool = mysql.createPool(mysqlSettings);
  pool.on("acquire", function (connection) {
    logger.info("Connection %d acquired", connection.threadId);
  });
  
  pool.on("enqueue", function () {
    logger.info("Waiting for available connection slot");
  });
  
  pool.on("release", function (connection) {
    logger.info("Connection %d released", connection.threadId);
  });
  
  var getConnection = function (callback) {
    pool.getConnection(function (err, connection) {
      callback(err, connection);
    });
  };
  
  module.exports.getConnection = getConnection;
  module.exports.pool = pool;