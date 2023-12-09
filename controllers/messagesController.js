const Message = require("../models/messages");
const asyncHandler = require("express-async-handler");

const getAllMessages = asyncHandler(async (req, res) => {
    const messages = await Message.find().lean()

    if (!messages?.length) {
        return res.status(400).json({ message: "No Messages Found" })
    }

    res.json(messages)
});

const createNewMessage = asyncHandler(async (req, res) => {
    const { title, message } = req.body
    
    if (!title || !message) {
        res.status(400).json({message: "All fields required"})
    }
    
    const newMessage = await Message.create({
        title,
        message
    })

     if (newMessage) {
       // Created
       return res.status(201).json({ message: "New Message created" });
     } else {
       return res.status(400).json({ message: "Invalid message data received" });
     }
});

const updateMessage = asyncHandler(async (req, res) => {
    const { id, title, message } = req.body;

    // Confirm data
    if (!id || !title) {
       return res.status(400).json({ message: "All fields are required" });
     }

     // Confirm plan exists to update
     const existingMessage = await Message.findById(id).exec();

     if (!existingMessage) {
       return res.status(400).json({ message: "Message not found" });
     }

     // Check for duplicate title
     const duplicate = await Message.findOne({ title }).lean().exec();

     // Allow renaming of the original note
     if (duplicate && duplicate?._id.toString() !== id) {
       return res.status(409).json({ message: "Duplicate Message title" });
     }
   
    existingMessage.title = title;
    
    if (message) {
        existingMessage.message = message;
    }
   

     const updatedMesssage = await existingMessage.save();

     res.json(`'${updatedMesssage.id}' updated`);
})

const deleteMessage = asyncHandler(async (req, res) => {
     const { id } = req.body;

     // Confirm data
     if (!id) {
       return res.status(400).json({ message: "Message ID required" });
     }

     // Confirm note exists to delete
     const message = await Message.findById(id).exec();

     if (!message) {
       return res.status(400).json({ message: "Message not found" });
     }

     const result = await message.deleteOne();

     const reply = `Plan '${result.title}' with ID ${result._id} deleted`;

     res.json(reply);
})


module.exports = {
  getAllMessages,
  createNewMessage,
  updateMessage,
  deleteMessage,
};