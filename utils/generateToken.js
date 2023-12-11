const  jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
       httpOnly: true,
    secure: true,
    domain:["https://busbookingusdt.xyz","http://localhost:3000"],
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });
};

module.exports = generateToken;
