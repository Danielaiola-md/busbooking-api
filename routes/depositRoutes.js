const express = require("express");
const router = express.Router();
const depositsController = require("../controllers/depositsController");
const protectMiddleware = require("../middleware/authMiddleware");

router
  .route("/")
  .get( depositsController.getAllDeposit)
  .post(depositsController.createNewDeposit)
  .patch(depositsController.updateDeposit)
  .delete(depositsController.deleteDeposit);

router.route('/userDeposit').get( depositsController.getUserDeposit)
  

module.exports = router;
