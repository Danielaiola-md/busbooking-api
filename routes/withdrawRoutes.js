const express = require("express");
const router = express.Router();
const withdrawalsController = require("../controllers/withdrawalsController");
const protectMiddleware = require("../middleware/authMiddleware");


router
  .route("/")
  .get(protectMiddleware.protect, withdrawalsController.getAllWithdrawal)
  .post(protectMiddleware.protect, withdrawalsController.createNewWithdrawal)
  .patch(protectMiddleware.protect, withdrawalsController.updateWithdrawal)
  .delete(protectMiddleware.protect,withdrawalsController.deleteWithdrawal);

module.exports = router;
