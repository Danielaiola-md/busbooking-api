const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const protectMiddleware = require('../middleware/authMiddleware')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

router.route('/')
    .get(protectMiddleware.adminProtect,usersController.getAllUsers)
    .post(usersController.createNewUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)
   
router.post('/auth', usersController.authUser)
    
router.post('/logout', usersController.logoutUser)

router.route("/profile").get(usersController.getUserProfile);

router.post("/claim-bonus", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    // Check if 24 hours have passed since the last claim
    if (
      !user.last_claimed_time ||
      Date.now() - user.last_claimed_time >= 24 * 3600 * 1000
    ) {
        function calculateBonusLogic(user) {
            if (user === "Vip 1") {
              return 1.5;
            } else if (user === "Vip 2") {
              return 3;
            } else if (user === "Vip 3") {
              return 4.5;
            } else if (user === "Vip 4") {
              return 6;
            } else if (user === "Vip 5") {
              return 10;
            } else if (user === "Vip 6") {
              return 14;
            } else if (user === "Vip 7") {
              return 30;
            } else if (user === "Vip 8") {
              return 45;
            } else if (user === "Vip 9") {
              return 60;
            } else if (user === "Vip 10") {
              return 150;
            }
        }
      const bonusAmount = calculateBonusLogic(user.currentPlan);

      // Update user data in the database
      user.bonus_amount += bonusAmount;
      user.balance += bonusAmount; // Add bonus to the balance
      user.last_claimed_time = new Date();
        await user.save();

        res.json({
            message: `Daily Income of ${bonusAmount} claimed successfully!`,
        });
    } else {
      res
        .status(400)
        .json({
          message: "You can claim the bonus only once every 24 hours.",
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({  message: "Internal Server Error" });
  }
});


module.exports = router
