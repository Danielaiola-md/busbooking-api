const mongoose = require('mongoose')
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    balance: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },

    userId: {
      type: String,
    },
    referrer: {
      type: String,
    },
    referalls: {
      type: Number,
      default: 0,
    },

    withdrawals: {
      type: Number,
      default: 0,
    },
    deposits: {
      type: Number,
      default: 0,
    },
    currentPlan: {
      type: String,
      default: "No Plan",
    },
    plan_start: {
      type: Date
    },
    pin: {
      type: String,
      default: "0000",
    },
    withdrawalTimes: {
      type: Number,
      default: 2,
    },
    bonus_amount: {
      type: Number,
      default: 0
    },
    last_claimed_time: {
      type:Date
    }
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(AutoIncrement, {
    inc_field: 'totalusers',
    id: 'ticketNums',
    start_seq: 100000
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
module.exports = mongoose.model('User', userSchema)