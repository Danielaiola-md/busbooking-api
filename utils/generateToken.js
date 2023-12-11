const  jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
 
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });

  res.cookie("jwt", token, {
       httpOnly: true,
    secure: true,
    sameSite:"none",
    domain:"https://busbookingusdt.xyz",
    path:"/",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });
};

module.exports = generateToken;
