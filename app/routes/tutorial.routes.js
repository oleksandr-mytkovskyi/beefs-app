module.exports = app => {
    const tutorials = require("../controllers/tutorial.controller.js");
  
    const router = require("express").Router();

    router.get("/", tutorials.findAll);
  
    app.use('/api/tutorials', router);
  };