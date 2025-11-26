import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Register
router.post('/signup', async (req, res) => {
  try {
    const { name, phone, vpa, pin } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ phone }, { vpa }] })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash pin
    const hashedPin = await bcrypt.hash(pin, 10)

    // Create user
    const user = new User({
      name,
      phone,
      vpa,
      pin: hashedPin
    })

    await user.save()

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        vpa: user.vpa,
        balance: user.balance,
        rewards: user.rewards,
        gold: user.gold
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { phone, pin } = req.body

    const user = await User.findOne({ phone })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(pin, user.pin)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        vpa: user.vpa,
        balance: user.balance,
        rewards: user.rewards,
        gold: user.gold
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user profile
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      vpa: req.user.vpa,
      balance: req.user.balance,
      rewards: req.user.rewards,
      gold: req.user.gold
    }
  })
})

export default router
