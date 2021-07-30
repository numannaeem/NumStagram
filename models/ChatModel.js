const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chats: [{
        messagesWith: { type: Schema.Types.ObjectId, ref: "User" },
        messages: [{
            _id: { type: String, required: true },
            msg: { type: String, required: true },
            sender: { type: Schema.Types.ObjectId, ref: "User" },
            reciever: { type: Schema.Types.ObjectId, ref: "User" },
            date: { type: Date }
        }]
    }]
})

module.exports = mongoose.model("Chat", ChatSchema)