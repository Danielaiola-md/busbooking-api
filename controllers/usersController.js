const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const ShortUniqueId = require("short-unique-id");
const UserId = new ShortUniqueId({ length: 10 });
const generateToken = require("../utils/generateToken");
const withdraw = require('../models/withdraw');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {

      const users = await User.find().select("-password").lean();
      // If no users
        if (!users?.length) {
            return res.status(400).json({ message: "No users found" });
        } 
            res.json(users)
       
    } 

)

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    let {
      username,
      password,
        email,
        referrer,
        bonus,
        balance,
        referrallId,
        referalls,
        userId,
        role,
        currentPlan,
        pin,
        withdrawals,
        deposits,
        bonus_amount,
        plan_start,
        withdrawalTimes
      
    } = req.body;

    // Confirm data
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Email already registered' })
    }
       let generatedReferer;
    if (referrallId) {

        const referrerDetails = await User.findOne({ referrallId })
      
     
        if (referrerDetails) {
            referrerDetails.balance += 2
            referrerDetails.referalls += 1
           const res = await referrerDetails.save()
            generatedReferer = res.email
        }
    } else {
        generatedReferer = 'none'
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds
    const generatedReferallId = UserId.rnd()

    const userObject = {
      username,
      email,
      password: hashedPwd,
      role,
      balance: 0,
      bonus: 20,
      referrer: generatedReferer,
      referalls,
      userId: generatedReferallId,
      currentPlan,
      pin,
      withdrawals,
      deposits,
      bonus_amount,
        last_claimed_time: null,
        plan_start: null,
      withdrawalTimes
    };

    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        generateToken(res,user._id)
        res.status(201).json({
          _id: user._id,
          username: user.username,
            email: user.email,
            role: user.role,
            balance: user.balance,
            bonus: user.bonus,
            referrer: user.referrer,
            referalls: user.referalls,
            userId: user.userId,
            currentPlan: user.currentPlan,
            withdrawals: user.withdrawals,
            deposits:user.deposits,
            pin: user.pin,
            last_claimed_time: user.last_claimed_time,
            withdrawalTimes: user.withdrawalTimes,

      plan_start: user.plan_start
        });
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})



// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const {
        id,
        username,
        password,
        email,
        balance,
        bonus,
        withdrawals,
        deposits,
        currentPlan,
        pin,
        role,
        withdrawalTimes,
        plan_start,
        last_claimed_time
    } = req.body;

    // Does the user exist to update?
    const user = await User.findById(req.body.id);
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
        
    }

    const duplicate = await User.findOne({ username });

    // Allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== req.body.id) {
        return res.status(409).json({ message: "Duplicate username" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.balance = balance || user.balance;
    user.bonus = bonus || user.bonus;
    user.deposits = deposits || user.deposits;
    user.withdrawals = withdrawals || user.withdrawals;
    user.pin = pin || user.pin;
    user.currentPlan = currentPlan || user.currentPlan
    user.role = role || user.role
    user.withdrawalTimes = withdrawalTimes | user.withdrawalTimes
    user.last_claimed_time = last_claimed_time || user.last_claimed_time
      user.plan_start= plan_start||user.plan_start;
    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }    // salt rounds


  const updatedUser = await user.save();

  res
    .status(200)
    .json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      balance: updatedUser.balance,
      bonus: updatedUser.bonus,
      referrer: updatedUser.referrer,
      referalls: updatedUser.referalls,
      userId: updatedUser.userId,
      currentPlan: updatedUser.currentPlan,
      withdrawals: updatedUser.withdrawals,
      deposits: updatedUser.deposits,
        pin: updatedUser.pin,
        withdrawalTimes: updatedUser.withdrawalTimes,
        plan_start: updatedUser.plan_start,
      last_claimed_time: updateUser.last_claimed_time
    });
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

 

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });


         
    if (user && (await user.matchPassword(password))) {
        if (user.currentPlan !== 'No Plan') {
            if (user.plan_start && Date.now() - user.plan_start >= 720 * 3600 * 1000) {
                user.currentPlan = 'No Plan'
                await user.save()
            }
        }
    
    
            //created
            generateToken(res, user._id)
            res
                .status(201)
                .json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    balance: user.balance,
                    bonus: user.bonus,
                    referrer: user.referrer,
                    referalls: user.referalls,
                    userId: user.userId,
                    currentPlan: user.currentPlan,
                    withdrawals: user.withdrawals,
                    deposits: user.deposits,
                    pin: user.pin,
                    last_claimed_time: user.last_claimed_time,
                    withdrawalTimes: user.withdrawalTimes,
                    plan_start: user.plan_start
                });
        } else {
            res.status(401).json({ message: 'Invalid email or password received' })
        }
    
    
    }
)

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        sameSite:'None',
        expires: new Date(0)
    })


    res.status(200).json({mesage: 'User logged out'})
})
const getUserProfile = asyncHandler(async (req, res) => {

       const { id } = req.body
    const user = await User.findById(id);

  
        if (user) {
            res.json({
              _id: user._id,
              username: user.username,
              email: user.email,
              role: user.role,
              balance: user.balance,
              bonus: user.bonus,
              referrer: user.referrer,
              referalls: user.referalls,
              userId: user.userId,
              currentPlan: user.currentPlan,
              withdrawals: user.withdrawals,
              deposits: user.deposits,
              pin: user.pin,
              last_claimed_time: user.last_claimed_time,
              withdrawalTimes: user.withdrawalTimes,
              plan_start: user.plan_start,
            });
        }else {
        res.status(404);
        throw new Error("User not found");
}
}
    )


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    authUser,
    logoutUser,
    getUserProfile
}
