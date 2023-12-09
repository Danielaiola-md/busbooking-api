const Plan= require('../models/postPlans')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all plans
// @route GET /plans
// @access Private
const getAllPlans = asyncHandler(async (req, res) => {
    // Get all plans from MongoDB
    const plans = await Plan.find().lean()

    // If no notes 
    if (!plans?.length) {
        return res.status(400).json({ message: 'No plans found' })
    }
    res.json(plans)
})

// @desc Create new Plan
// @route POST /plns
// @access Private
const createNewPlan = asyncHandler(async (req, res) => {
    const {title,message,price,duration,status } = req.body

    // Confirm data
    if ( !title || !message || !price || !duration) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Plan.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate Plan title' })
    }

    // Create and store the new user 
    const plan = await Plan.create({  title, message,price,duration,status })

    if (plan) { // Created 
        return res.status(201).json({ message: 'New Plan created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }

})

// @desc Update a note
// @route PATCH /plans
// @access Private
const updatePlan = asyncHandler(async (req, res) => {
    const { id, title,message,duration,price,} = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm plan exists to update
    const plan = await Plan.findById(id).exec()

    if (!plan) {
        return res.status(400).json({ message: 'Plan not found' })
    }

    // Check for duplicate title
    const duplicate = await Plan.findOne({ title }).lean().exec()

    // Allow renaming of the original note 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate Plan title' })
    }
    if (title) {
        plan.title = title
    } else {
        res.json({message:"No changes made"})
    }
    if (message) {
        plan.message = message
    }
    if (duration) {
        plan.duration = duration
    }
    if (price) {
        plan.price = price
    }

    const updatedPlan = await plan.save()

    res.json(`'Plan ${updatedPlan.id}' updated`)
})

// @desc Delete a plan
// @route DELETE /plans
// @access Private
const deletePlan = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Plan ID required' })
    }

    // Confirm note exists to delete 
    const plan = await Plan.findById(id).exec()

    if (!plan) {
        return res.status(400).json({ message: 'Plan not found' })
    }

    const result = await plan.deleteOne()

    const reply = `Plan '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllPlans,
    createNewPlan,
    updatePlan,
    deletePlan
}