const express = require('express')
const app = express()
const server = require('http').Server(app)
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const io = require('socket.io')(server)
const handle = nextApp.getRequestHandler()
const path = require('path')
require('dotenv').config({ path: './config.env' })
const connectDb = require('./utilsServer/connectDb')
// const { addUser, removeUser, findConnectedUser } = require('./utilsServer/roomActions')
const {
  loadMessages,
  sendMsg,
  setMsgToUnread,
  deleteMsg
} = require('./utilsServer/messageActions')

connectDb()
app.use(express.json())
const PORT = process.env.PORT || 3000

const findConnectedUser = (userId) => {
  const sockets = io.sockets.sockets
  for (var socketId in sockets) {
    let userToFindId = io.sockets.connected[socketId].username
    if (userToFindId === userId) return socketId
  }
}

io.on('connection', (socket) => {
  socket.on('join', async ({ userId }) => {
    socket.username = userId
    console.log(userId + ' joined')
    let users = []
    const sockets = io.sockets.sockets
    for (var socketId in sockets) {
      let connectedSocket = io.sockets.connected[socketId]
      if (socket.id !== socketId && connectedSocket.username === userId) {
        connectedSocket.disconnect()
        console.log(`${socketId} disconnected`)
      } else {
        let userId = connectedSocket.username
        userId && users.push({ userId, socketId })
      }
    }
    console.log('Users:\n', users)
    io.emit('connectedUsers', {
      users
    })
    setInterval(() => {
      let users = []
      const sockets = io.sockets.sockets
      for (var socketId in sockets) {
        let userId = io.sockets.connected[socketId].username
        if (userId && !users.find((socket) => socket.userId === userId)) {
          users.push({ userId, socketId })
        }
      }
      socket.emit('connectedUsers', {
        users
      })
    }, 15 * 1000)
  })

  socket.on('disconnect', () => {
    console.log(socket.username + ' disconnected')
    let users = []
    const sockets = io.sockets.sockets
    for (var socketId in sockets) {
      let connectedSocket = io.sockets.connected[socketId]
      if (socket.id !== socketId && connectedSocket.username !== socket.username) {
        let userId = connectedSocket.username
        userId && users.push({ userId, socketId })
      }
    }
    io.emit('connectedUsers', {
      users
    })
  })

  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith)
    if (!error) {
      socket.emit('messagesLoaded', { chat })
    } else {
      socket.emit('noChatFound')
    }
  })

  socket.on('sendNewMsg', async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg)
    const receiverSocket = findConnectedUser(msgSendToUserId)
    if (receiverSocket) {
      io.to(receiverSocket).emit('newMsgReceived', { newMsg })
    } else {
      await setMsgToUnread(msgSendToUserId)
    }
    if (!error) {
      socket.emit('msgSent', { newMsg })
    }
  })

  socket.on('deleteMsg', async ({ userId, messagesWith, messageId }) => {
    const { success } = await deleteMsg(userId, messagesWith, messageId)
    if (success) {
      socket.emit('msgDeleted')
    }
  })

  socket.on('sendMsgFromNotification', async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg)
    const receiverSocket = findConnectedUser(msgSendToUserId)
    if (receiverSocket) {
      io.to(receiverSocket).emit('newMsgReceived', { newMsg })
    } else {
      await setMsgToUnread(msgSendToUserId)
    }
    if (!error) {
      socket.emit('msgSentFromNotification')
    }
  })
})

nextApp.prepare().then(() => {
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https')
        res.redirect(`https://${req.header('host')}${req.url}`)
      else next()
    })
  }

  app.get('/service-worker.js', express.static(path.join(__dirname, '.next')))

  app.use('/api/signup', require('./api/signup'))
  app.use('/api/auth', require('./api/auth'))
  app.use('/api/search', require('./api/search'))
  app.use('/api/posts', require('./api/posts'))
  app.use('/api/profile', require('./api/profile'))
  app.use('/api/notifications', require('./api/notifications'))
  app.use('/api/chats', require('./api/chats'))
  app.use('/api/reset', require('./api/reset'))

  app.all('*', (req, res) => handle(req, res))

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log('Express server running')
  })
})
