const express = require('express')
const router = express.Router()
const plansController = require('../controllers/plansController');
const protectMiddleware = require("../middleware/authMiddleware");


router
  .route("/")
  .get(protectMiddleware.protect,plansController.getAllPlans)
  .post(protectMiddleware.protect, plansController.createNewPlan)
  .patch( protectMiddleware.protect,plansController.updatePlan)
  .delete(protectMiddleware.protect,plansController.deletePlan);

module.exports = router
