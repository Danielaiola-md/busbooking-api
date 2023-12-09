const Withdraw = require("../models/withdraw");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const getAllWithdrawal = asyncHandler(async (req, res) => {
    const withdrawals = await Withdraw.find().select("-pin").lean();

    if (!withdrawals?.length) {
        res.status(400).json({message:"No Withdrawals Found"})
    }

    res.status(200).json(withdrawals)
    

})

const createNewWithdrawal = asyncHandler(async (req, res) => {
    const {id, pin, address, amount, completed, UserId, UserName,method } = req.body
    
    if (!pin, !address, !amount) {
        res.status(400).json({message: "All Field required"})
    }
    const userCreatedWithdrawal = await User.findById(id).exec()
    
  
  
    if (pin !== userCreatedWithdrawal.pin) {
        res.json({message: "Pin does Not match"})
    }
    
  userCreatedWithdrawal.withdrawalTimes -= 1

  await userCreatedWithdrawal.save()
  
    const withdrawal = await Withdraw.create({
      address,
      amount,
      completed,
      UserName: userCreatedWithdrawal.username,
      UserId: userCreatedWithdrawal._id,
    });
    
    if (withdrawal) {
        res.status(201).json({message: 'New Withdrawal Created'})
    } else {
        res.status(400).json({message: "Invalid data Received"})
    }
});



const updateWithdrawal = asyncHandler(async (req, res) => {
    const { id,completed } = req.body
    
    if (!id) {
        res.status(400).json({message: "Id is required"})
    }

    const withdrawal = await Withdraw.findById(id).exec();

    if (!withdrawal) {
      return res
        .status(400)
        .json({ message: "No Withdrawal with that Id found " });
    }
    if (completed) {
      withdrawal.completed = completed;
    } else {
      return res.status(400).json({ message: "No changes made" });
    }

    const updatedWithdrawal = await withdrawal.save();

    res.json(`'Deposit ${updatedWithdrawal.id}' updated`);


});

const deleteWithdrawal = asyncHandler(async (req, res) => {
      const { id } = req.body;
      if (!id) {
        res.status(400).json({ message: "Please provide an Id" });
      }
      const withdrawal = await Withdraw.findById(id).exec();
      if (!withdrawal) {
        res.status(400).json({ message: `No withdrawal with Id of ${id} found` });
      }

      const result = await withdrawal.deleteOne();

      const reply = `Withdrawal '${result.userId}' made by'${result.userName}' deleted`;

      res.json(reply);
});

module.exports = {
    getAllWithdrawal,
    createNewWithdrawal,
    updateWithdrawal,
    deleteWithdrawal
}
