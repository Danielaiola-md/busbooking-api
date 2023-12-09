const Deposit = require('../models/deposits')
const asyncHandler = require("express-async-handler");
const User = require("../models/User")

// @desc Get all deposits
// @route GET /deposits
// @access Private

const getAllDeposit = asyncHandler(async (req, res) => {
    
        const deposits = await Deposit.find().lean()
        if (!deposits?.length) {
            res.status(400).json({ message: "No Deposits Found" })
        } 
            res.status(200).json(deposits);
        
    } 
)



const createNewDeposit = asyncHandler(async (req, res) => {
        const {amount,transactionId,completed,userName,userId,id,plan} = req.body

    if (!amount || !transactionId || !plan) {
            res.status(400).json({message: "All Fields required"})
    }
    const userCreatedDeposit = await User.findById(id).exec()
 
    const deposit = await Deposit.create({
      amount,
      transactionId,
      completed,
      userName: userCreatedDeposit.username,
        userId: userCreatedDeposit._id,
      plan
    });
    
    if (deposit) {
        res.status(201).json({message: 'New Deposit Created'})
    } else {
        res.status(400).json({message: "Invalid data Received"})
    }
});

const updateDeposit = asyncHandler(async (req, res) => {
    const { id,completed,userId} = req.body
    
    if (!id || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const deposit = await Deposit.findById(id).exec();
    const user = await User.findById(userId).exec()

    if (!deposit) {
        return res.status(400).json({message: "No deposit with that Id found "})
    }
    
    let referrerDetails;
    if (user) {
        let a = user.referrer
        referrerDetails = await User.findOne({ a} )
    } 

    if (referrerDetails) {
        referrerDetails.withdrawalTimes += 0.5
        await referrerDetails.save()
 deposit.completed = completed || deposit.completed;
 const updatedDeposit = await deposit.save();
 res.json(`'Deposit ${updatedDeposit.id}' updated`);

    } else if (completed) {
        deposit.completed = completed;
        const updatedDeposit = await deposit.save();
        res.json(`'Deposit ${updatedDeposit.id}' updated`);
    } else {
        return res.status(400).json({message:"No changes made"})
    }



  
})

const deleteDeposit = asyncHandler(async (req, res) => {
    const { id } = req.body
    if (!id) {
        res.status(400).json({message:"Please provide an Id"})
    }
    const deposit = await Deposit.findById(id).exec()
    if (!deposit) {
        res.status(400).json({message:`No deposit with Id of ${id} found`})
    }

    const result = await deposit.deleteOne();

    const reply = `Deposit '${result.transactionId}' with ID '${result.userId}' deleted`;

    res.json(reply);
});
const getUserDeposit = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    const userDeposit = user.userId

    if (user) {
        const deposits = await Deposit.find({userDeposit})

        if (deposits) {
            res.status(201).json(deposits)
        } else {
            res.status(401).json({ message: "No Deposit Found" })
        }
    }
}
)


module.exports = {
    getAllDeposit,
    createNewDeposit,
    updateDeposit,
    deleteDeposit,
    getUserDeposit
}
