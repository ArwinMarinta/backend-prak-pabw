const express = require("express"),
  userRoute = require("./user"),
  router = express.Router();

router.use(userRoute);

module.exports = router;
