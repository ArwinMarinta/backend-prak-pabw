const express = require("express"),
  schema = require("../../validation/auth.schema"),
  controller = require("../../controller/auth"),
  validate = require("../../middleware/validations"),
  router = express.Router();

router.post("/register", validate(schema.register), controller.auth.register);
router.post("/login", validate(schema.login), controller.auth.login);
router.patch("/verify/:token", controller.auth.verifyEmail);

module.exports = router;
