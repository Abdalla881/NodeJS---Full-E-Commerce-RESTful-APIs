const jwt = require("jsonwebtoken");

const createToken = (payload) => {
  const token = jwt.sign({ userId: payload }, process.env.Secret_Key, {
    expiresIn: process.env.expiresIn,
  });
  return token;
};

module.exports = createToken;
