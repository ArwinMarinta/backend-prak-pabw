const jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  slugify = require("slugify"),
  { JWT_SECRET_KEY } = require("../config");

module.exports = {
  apiSuccess: (msg, data, extraData = {}) => {
    const response = {
      status: "success",
      message: msg,
      ...extraData,
      data: data,
    };
    return response;
  },

  apiError: (msg, errors) => {
    const response = {
      status: "error",
      message: msg,
      errors: errors,
    };
    return response;
  },

  createJwt: async (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
    } catch (error) {
      console.log(error);
    }
  },
  createSlug: async (data) => {
    try {
      const dataSlug = await slugify(data, { lower: true, remove: /[*+~.()'"!:@]/g });
      return dataSlug;
    } catch (error) {
      console.log(error);
    }
  },

  createHasData: async (data, saltRounds = 10) => {
    try {
      return (handleData = await bcrypt.hash(data, saltRounds));
    } catch (error) {
      console.log(error);
    }
  },

  verifyHashData: async (unhashed, hashed) => {
    try {
      const match = await bcrypt.compare(unhashed, hashed);
      return match;
    } catch (error) {
      console.log(error);
    }
  },
};
