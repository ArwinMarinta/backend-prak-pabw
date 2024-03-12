const express = require("express"),
  controller = require("../../controller/auth"),
  { verifyToken } = require("../../middleware/verify.token"),
  router = express.Router();

router.get("/profile", verifyToken, controller.auth.getProfile);

module.exports = router;
