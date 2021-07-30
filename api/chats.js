const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/UserModel");
const ChatModel = require("../models/ChatModel");

//GET all chats
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { userId } = req
        const usermodel = await UserModel.findById(userId)
        if (usermodel.unreadMessage) {
            usermodel.unreadMessage = false
            await usermodel.save()
        }
        const user = await ChatModel.findOne({ user: userId }).populate('chats.messagesWith')
        let chatsToBeSent = []
        if (user.chats.length > 0) {
            chatsToBeSent = await user.chats.map(c => ({
                messagesWith: c.messagesWith._id,
                name: c.messagesWith.name,
                profilePicUrl: c.messagesWith.profilePicUrl,
                lastMessage: c.messages[c.messages.length - 1]?.msg || '',
                date: c.messages[c.messages.length - 1]?.date
            }))
        }
        res.json(chatsToBeSent)
    } catch (error) {
        console.error(error)
        return res.status(500).send("Server Error")
    }
})

router.get('/user/:userToFindId', authMiddleware, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userToFindId)
        if (!user) {
            return res.status(404).send("No user found")
        }
        return res.json({ name: user.name, profilePicUrl: user.profilePicUrl })
    } catch (error) {
        console.error(error)
        return res.status(500).send("Server Error")
    }
})

router.delete('/:messagesWith', authMiddleware, async (req, res) => {
    try {
        const { userId } = req
        const user = await ChatModel.findOne({ user: userId })
        const chatToDelete = user.chats.find(chat => chat.messagesWith.toString() === req.params.messagesWith)
        if (!chatToDelete) {
            return res.status(200).send("Deleted")
        }
        const index = user.chats.indexOf(chatToDelete)
        user.chats.splice(index, 1)
        await user.save()
        return res.status(200).send("Chat deleted")

    } catch (error) {
        console.error(error)
        return res.status(500).send("Server Error")
    }
})

module.exports = router