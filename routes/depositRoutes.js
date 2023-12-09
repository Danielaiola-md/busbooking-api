const express = require("express");
const router = express.Router();
const depositsController = require("../controllers/depositsController");
const protectMiddleware = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protectMiddleware.protect, depositsController.getAllDeposit)
  .post(protectMiddleware.protect, depositsController.createNewDeposit)
  .patch(protectMiddleware.protect, depositsController.updateDeposit)
  .delete(protectMiddleware.protect,depositsController.deleteDeposit);

router.route('/userDeposit').get(protectMiddleware.protect, depositsController.getUserDeposit)
  

module.exports = router;
