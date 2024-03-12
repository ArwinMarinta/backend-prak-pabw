const db = require("../../../prisma/connection"),
  utils = require("../../utils/utils");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const hashPassword = await utils.createHasData(password);

      const user = await db.user.create({
        data: {
          name: name,
          email: email,
          password: hashPassword,
          role: "USER",
          photoProfile:
            "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
        },
      });

      const data = {
        name: user.name,
        email: user.email,
      };

      return res.status(201).json(utils.apiSuccess("Pendaftaran Berhasil", data));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) return res.status(400).json(utils.apiError("Emal tidak terdaftar"));

      const verifyPassword = await utils.verifyHashData(password, user.password);

      if (!verifyPassword) return res.status(409).json(utils.apiError("Password salah"));

      const payload = { id: user.id, role: user.role };

      const token = await utils.createJwt(payload);

      const data = {
        token: token,
      };

      return res.status(200).json(utils.apiSuccess("Login Berhasil", data));
    } catch (error) {
      console.log(error);
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id: res.user.id,
        },
      });

      if (!user) return res.status(404).json(utils.apiError("User tidak ditemukkan"));

      const data = {
        name: user.name,
        email: user.email,
        photoProfile: user.photoProfile,
      };

      return res.status(200).json(utils.apiSuccess("Data user berhasil diambil", data));
    } catch (error) {
      console.log(error);
      return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
    }
  },
};
