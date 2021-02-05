const express = require('express');
const cors = require("cors");


global.logger = require("./config/log");
global.message = require("./config/message"); 

  const port = process.env.PORT || 7075;
  const HOST = "0.0.0.0";
  const service = "Task";
  
  const todo = require('./routes/todo');
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  app.use((req, res, next) => {
    var requestedUrl = req.protocol + "://" + req.get("Host") + req.url;
    let log = service + " recived request. " + requestedUrl;
    if (req.query && req.query.user) {
      log = log + ", by user : " + req.query.user;
    }
    logger.info(log);
    next();
  });
  
  app.use('/todo', todo);
  
  app.use((req, res, next) => {
    var requestedUrl = req.protocol + "://" + req.get("Host") + req.url;
    logger.error(
      "Inside 'resource not found' handler , Req resource: " + requestedUrl
    );
    return res.status(404).send({ success: false, message: "Url Not found" });
  });
  
  // error handler
  app.use((err, req, res, next) => {
    logger.error("Error handler:", err);
    return res.status(500).send({ success: false, message: "Error" });
  });

app.listen(port, HOST, () => {
    logger.info(`Running on http://${HOST}:${port}`);
    logger.info("Server started at " + port);
});
