const express = require('express')
const router = express.Router()
const UserModel = require('../models/UserModel')
const FollowerModel = require('../models/FollowerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const isEmail = require('validator/lib/isEmail')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, async (req, res) => {
  const { userId } = req

  try {
    const user = await UserModel.findById(userId)
    const userFollowStats = await FollowerModel.findOne({ user: userId })
    const newUsers = await UserModel.find({
      createdAt: { $gte: Date.now() - 7 * 60 * 60 * 24 * 1000 }
    }).sort({ createdAt: -1 })

    return res.status(200).json({ user, userFollowStats, newUsers })
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

router.post('/', async (req, res) => {
  const { email, password } = req.body.user

  if (!isEmail(email)) return res.status(401).send('Invalid Email')

  if (password.length < 6) {
    return res.status(401).send('Password must be atleast 6 characters')
  }

  try {
    const user = await UserModel.findOne({ email: email.toLowerCase() }).select(
      '+password'
    )

    if (!user) {
      return res.status(401).send('Invalid Credentials')
    }

    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword) {
      return res.status(401).send('Invalid Credentials')
    }

    const payload = { userId: user._id }
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }, (err, token) => {
      if (err) throw err
      res.status(200).json(token)
    })
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Server error`)
  }
})

module.exports = router
