const express = require('express')
const router = express.Router()
const UserModel = require('../models/UserModel')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')
const isEmail = require('validator/lib/isEmail')
const baseUrl = require('../utils/baseUrl')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_KEY)

router.post('/', async (req, res) => {
  try {
    const { email } = req.body
    if (!isEmail(email)) {
      return res.status(401).send('Invalid email')
    }
    const user = await UserModel.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(401).send('Invalid email')
    }
    const token = crypto.randomBytes(32).toString('hex')
    user.resetToken = token
    user.expireToken = Date.now() + 60 * 60 * 1000 //expires in 1 hour
    await user.save()

    const href = `${baseUrl}/reset/${token}`
    const mailOptions = {
      to: user.email,
      from: {
        email: 'numan.naeem@outlook.com',
        name: 'NumStagram'
      },
      subject: 'Password reset request',
      html: `<b>Hey ${user.name.split(' ')[0].toString()},</b>
            <p>You requested to reset your NumStagram account password</p>
            <br />
            <a href=${href}>Click here to proceed</a>
            <p><i>this link expires in one hour</i></p>
            <hr />
            <p>If you did not initiate this, you may ignore this email and your password won't be changed</p>`
    }
    await sgMail.send(mailOptions)
    return res.status(200).send('Email sent successfully')
  } catch (error) {
    console.error(error)
    return res.status(500).send('Server error')
  }
})

router.post('/token', async (req, res) => {
  try {
    const { token, password } = req.body

    if (!token) {
      return res.status(401).send('Unauthorized')
    }

    const user = await UserModel.findOne({ resetToken: token })

    if (!user) {
      return res.status(404).send('Invalid token')
    }

    if (password.length < 6)
      return res.status(401).send('Password must be atleast 6 characters')

    if (Date.now() > user.expireToken) {
      return res.status(401).send('Token expired. Generate new one.')
    }

    user.password = await bcrypt.hash(password, 10)

    user.resetToken = ''
    user.expireToken = undefined

    await user.save()

    return res.status(200).send('Password updated')
  } catch (error) {
    console.error(error)
    return res.status(500).send('Server Error')
  }
})

module.exports = router
