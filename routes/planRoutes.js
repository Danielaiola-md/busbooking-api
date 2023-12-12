const express = require('express')
const router = express.Router()
const plansController = require('../controllers/plansController');
const protectMiddleware = require("../middleware/authMiddleware");


router
  .route("/")
  .get(plansController.getAllPlans)
  .post( plansController.createNewPlan)
  .patch( plansController.updatePlan)
  .delete(plansController.deletePlan);

module.exports = router
