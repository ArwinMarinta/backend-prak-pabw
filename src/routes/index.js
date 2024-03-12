const express = require("express"),
  authRoute = require("./auth"),
  userRoute = require("./user");
router = express.Router();

router.use("/auth", authRoute);
router.use(userRoute);

module.exports = router;
