import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Register
router.post('/signup', async (req, res) => {
  try {
    const nameStr = String(req.body.name || '').trim()
    const phoneStr = String(req.body.phone || '').trim()
    const vpaStr = String(req.body.vpa || '').trim()
    const pinStr = String(req.body.pin || '').trim()

    if (!nameStr || !phoneStr || !vpaStr || !pinStr) {
      return res.status(400).json({ message: 'All fields (name, phone, vpa, pin) are required' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ phone: phoneStr }, { vpa: vpaStr }] })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash pin
    const hashedPin = await bcrypt.hash(pinStr, 10)

    // Create user
    const isAdmin = req.body.adminSecret === (process.env.ADMIN_SECRET_KEY || 'superadmin123')

    const user = new User({
      name: nameStr,
      phone: phoneStr,
      vpa: vpaStr,
      pin: hashedPin,
      isAdmin
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
        gold: user.gold,
        isAdmin: user.isAdmin
      }
    })
  } catch (error) {
    console.error('Error in /signup route:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const phoneStr = String(req.body.phone || '').trim()
    const pinStr = String(req.body.pin || '').trim()

    if (!phoneStr || !pinStr) {
      return res.status(400).json({ message: 'Phone and PIN are required' })
    }

    const user = await User.findOne({ phone: phoneStr })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(pinStr, user.pin)
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
        gold: user.gold,
        isAdmin: user.isAdmin
      }
    })
  } catch (error) {
    console.error('Error in /login route:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
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
      gold: req.user.gold,
      isAdmin: req.user.isAdmin
    }
  })
})

export default router
