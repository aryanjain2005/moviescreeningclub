// controllers/authController.js
const bcrypt = require('bcrypt')
const User = require('@/models/user/user.model')
const OTP = require('@/models/user/otp.model')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
  try {
    const { name, phoneNumber, designation, password, otp, email } = req.body
    // Check if all details are provided
    if (!name || !email || !password || !otp || !phoneNumber) {
      return res.status(403).json({
        success: false,
        message: 'All fields are required'
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid'
      })
    }
    // Secure password
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message
      })
    }
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      designation
    })
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({ success: false, error: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        usertype: user.usertype || 'standard',
        name: user.name || 'user',
        phone: user.phoneNumber || ''
      },
      `${process.env.JWT_SECRET || 'secret'}`,
      {
        expiresIn: '24h'
      }
    )
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

const update = async (req, res) => {
  try {
    const { email, password, otp } = req.body
    console.log(req.body)
    // Check if all details are provided
    if (!email || !password || !otp) {
      console.log('input error')
      return res.status(403).json({
        success: false,
        message: 'All fields are required'
      })
    }
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)

    if (response.length === 0 || otp !== response[0].otp) {
      console.log('otp error')
      return res.status(400).json({
        success: false,
        message: 'The OTP is not valid'
      })
    }
    let hashedPassword
    try {
      hashedPassword = await bcrypt.hash(password, 10)
    } catch (error) {
      console.log('password error')
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      console.log('user error')
      return res.status(404).json({ error: 'User not found' })
    }
    user.password = hashedPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    })
  } catch (error) {
    console.error('Error updating password:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { signup, login, update }
