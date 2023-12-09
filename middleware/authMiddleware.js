const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/User')



   const protect = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
     
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
     console.log(token);
    throw new Error('Not authorized, no token');
  }
});


const adminProtect = asyncHandler(async (req, res,next) => {
     let token;

     token = req.cookies.jwt;

     if (token) {
       try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

           req.user = await User.findById(decoded.userId).select("-password");
           
           if (req.user.role === 'admin') {
                 next();
           } else {
               throw new Error("Not authorised, not an admin")
           }

           
       
       } catch {
         res.status(401);
         throw new Error("Not authorised, not an admin");
       }
     } else {
       res.status(401);
       throw new Error("Not authorised, no token");
     }
})
module.exports = { protect, adminProtect };
