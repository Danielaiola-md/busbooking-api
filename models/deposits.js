const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
     
    },
    userName: {
      type: String,
    },
    plan: {
      type:String
    }
  },
  {
    timestamps: true,
  }
);

module.exports  = mongoose.model("Deposit", depositSchema);


