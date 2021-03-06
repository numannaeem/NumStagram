const ChatModel = require('../models/ChatModel')
const UserModel = require('../models/UserModel')
const uuid = require("uuid").v4;

const loadMessages = async (userId, messagesWith) => {
    try {
        const user = await ChatModel.findOne({ user: userId }).populate('chats.messagesWith')

        let chat = user.chats.find(chat => chat.messagesWith._id.toString() === messagesWith)

        if (!chat) {
            const messagesWithUser = await UserModel.findById(messagesWith)
            chat = {
                messagesWith: messagesWithUser,
                messages: []
            }
        }

        return { chat }

    } catch (error) {
        console.error(error)
        return { error }
    }
}

const sendMsg = async (userId, msgSendToUserId, msg) => {
    try {
        const loggedUser = await ChatModel.findOne({ user: userId })
        const msgSendToUser = await ChatModel.findOne({ user: msgSendToUserId })
        const newMsg = {
            _id: uuid(),
            sender: userId,
            receiver: msgSendToUserId,
            msg,
            date: Date.now()
        }
        const previousChat = loggedUser.chats.find(chat => chat.messagesWith.toString() === msgSendToUserId)
        if (previousChat) {
            previousChat.messages.push(newMsg)
            await loggedUser.save()
        } else {
            const newChat = {
                messagesWith: msgSendToUserId,
                messages: [newMsg]
            }
            loggedUser.chats.unshift(newChat)
            await loggedUser.save()
        }

        const previousChatForReceiver = msgSendToUser.chats.find(chat => chat.messagesWith.toString() === userId)
        if (previousChatForReceiver) {
            previousChatForReceiver.messages.push(newMsg)
            await msgSendToUser.save()
        } else {
            const newChat = {
                messagesWith: userId,
                messages: [newMsg]
            }
            msgSendToUser.chats.unshift(newChat)
            await msgSendToUser.save()
        }

        return { newMsg }
    } catch (error) {
        console.error(error)
        return { error }
    }
}

const setMsgToUnread = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user.unreadMessage) {
            user.unreadMessage = true
            await user.save()
        }
        return;
    } catch (error) {
        console.error(error)
    }
}

const deleteMsg = async (userId, messagesWith, messageId) => {
    try {
        const user = await ChatModel.findOne({ user: userId })
        const chat = user.chats.find(chat => chat.messagesWith.toString() === messagesWith)
        if (!chat) {
            return { success: false };
        }
        const messageToDelete = chat.messages.find(m => m._id.toString() === messageId)
        if (!messageToDelete) {
            return { success: false };
        }
        if (messageToDelete.sender.toString() !== userId) { //Msg being deleted wasn't sent by the Logged in user
            return { success: false };
        }
        const index = chat.messages.indexOf(messageToDelete)
        await chat.messages.splice(index, 1)
        await user.save()
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false }
    }
}
module.exports = { loadMessages, sendMsg, setMsgToUnread, deleteMsg }