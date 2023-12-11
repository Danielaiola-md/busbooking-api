const  jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, {
       httpOnly: true,
    secure: true.
    domain:"http://192.168.1.125:3000" ,
    sameSite:'None',
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
  });
};

module.exports = generateToken;
