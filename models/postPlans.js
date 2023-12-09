const mongoose = require('mongoose')

const plansSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required:true
    },
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'inactive'  
    },

},{
    timestamps:true
}
)

module.exports = mongoose.model("Plans", plansSchema);

