const { json } = require("express");

const db = require("../../../prisma/connection"),
  utils = require("../../utils/utils"),
  {
    NODEMAILER_SERVICE,
    NODEMAILER_HOST,
    NODEMAILER_PORT,
    NODEMAILER_EMAIL,
    NODEMAILER_PASS,
    JWT_SECRET_KEY,
  } = process.env,
  { sendEmail } = require("../../utils/senEmail"),
  { verifyToken } = require("../../middleware/verify.token"),
  jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Cek apakah email sudah terdaftar
      const existingUser = await db.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        return res.status(400).json(utils.apiError("Email sudah terdaftar."));
      }

      const hashPassword = await utils.createHasData(password);

      const payload = { email: email };

      const token = await utils.createJwt(payload);

      const datas = {
        token: token,
      };

      // Buat token verifikasi

      const link = `http://localhost:3000/verify/${token}`;

      const mailOptions = {
        from: NODEMAILER_EMAIL,
        to: email,
        subject: `Reset Password from ${NODEMAILER_EMAIL}`,
        html: `
                <p>Hello,</p>
                <p>Verify Email</p>
                <p><a href="${link}" style="color:black;font-size:25px;letter-spacing:2px;"><strong>click this link</strong></a></p>
                <p>It will expire in 5 minutes.</p>
                <p>Best regards,</p>
                <p>Team c8</p>
            `,
      };
      await sendEmail(mailOptions);

      // Simpan pengguna dengan status verifikasi false dan token verifikasi
      const user = await db.user.create({
        data: {
          name: name,
          email: email,
          password: hashPassword,
          role: "USER",
          photoProfile:
            "https://www.iprcenter.gov/image-repository/blank-profile-picture.png/@@images/image.png",
          verify: false,
          verificationToken: datas.token, // Pastikan kolom ini ada
        },
      });

      // Kirim email verifikasi

      const data = {
        name: user.name,
        email: user.email,
      };

      return res
        .status(201)
        .json(
          utils.apiSuccess("Pendaftaran Berhasil. Silakan verifikasi email Anda.", data)
        );
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

      if (!user) return res.status(400).json(utils.apiError("Email tidak terdaftar"));

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

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) return res.status(404), json(utils.apiError("Token Tidak Terdaftar"));
      console.log(token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await db.user.findUnique({ where: { email: decoded.email } });
      if (!user) {
        return res.status(400).json({ message: "Token verifikasi tidak valid" });
      }

      console.log(user.id);

      await db.user.update({
        where: { id: user.id },
        data: { verify: true, verificationToken: null },
      });

      return res.status(200).json({ message: "Email berhasil diverifikasi" });
    } catch (error) {
      console.error(error);
      return res.status(500).json(utils.apiError("Kesalahan pada internal server"));
    }
  },
};
