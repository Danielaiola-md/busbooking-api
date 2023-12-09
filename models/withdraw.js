const mongoose = require("mongoose");

const withdrawSchema = mongoose.Schema(
    {
        pin: {
            type: String
        },
        amount: {
            type: Number,
            required: true,
          
        },
        address: {
            type: String
        },
        completed: {
            type: Boolean,
            default: false
        },
        UserId: {
            type: String
        },
        UserName: {
            type:String
        }
    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("Withdrawal", withdrawSchema);

