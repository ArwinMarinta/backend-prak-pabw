const { body } = require("express-validator");

module.exports = {
  register: [
    body("name")
      .notEmpty()
      .withMessage("Nama tidak boleh kosong")
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage("Nama tidak boleh mengandung karakter spesial")
      .isString()
      .withMessage("Nama harus berupa string"),
    body("email").notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("password")
      .notEmpty()
      .withMessage("Password tidak boleh kosong")
      .isLength({ min: 8 })
      .withMessage("Password minimal 8 karakter")
      .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      .withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka")
      .isString()
      .withMessage("Password harus berupa string"),
    body("confPassword")
      .notEmpty()
      .withMessage("Konfirmasi password tidak boleh kosong")
      .custom((confPassword, { req }) => {
        if (confPassword !== req.body.password) {
          throw new Error("Password dan konfirmasi password tidak cocok");
        }
        return true;
      })
      .isString()
      .withMessage("Konfirmasi password harus berupa string"),
  ],

  login: [
    body("email").notEmpty().withMessage("Email tidak boleh kosong").isEmail().withMessage("Format email tidak valid"),
    body("password")
      .notEmpty()
      .withMessage("Password tidak boleh kosong")
      .isLength({ min: 8 })
      .withMessage("Password minimal 8 karakter")
      .matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      .withMessage("Password harus mengandung setidaknya satu huruf kapital dan satu angka")
      .isString()
      .withMessage("Password harus berupa string"),
  ],
};
