const express = require("express");
const router = express.Router();
const withdrawalsController = require("../controllers/withdrawalsController");
const protectMiddleware = require("../middleware/authMiddleware");


router
  .route("/")
  .get( withdrawalsController.getAllWithdrawal)
  .post(withdrawalsController.createNewWithdrawal)
  .patch(withdrawalsController.updateWithdrawal)
  .delete(withdrawalsController.deleteWithdrawal);

module.exports = router;
