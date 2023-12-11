const  jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    httpOnly: true,
    secure: true,
    sameSite:"none",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });

  res.cookie("jwt", token, {
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });
};

module.exports = generateToken;
