const  jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Use secure cookies in production
    sameSite: "none", // Prevent CSRF attacks
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });
};

module.exports = generateToken;
