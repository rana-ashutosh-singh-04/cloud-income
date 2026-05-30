import express from 'express'
import mongoose from 'mongoose'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import Stock from '../models/Stock.js'
import StockTransaction from '../models/StockTransaction.js'
import GlobalStock from '../models/GlobalStock.js'
import { auth } from '../middleware/auth.js'
import { adminAuth } from '../middleware/adminAuth.js'

const router = express.Router()

// Apply protection to all endpoints in this router
router.use(auth)
router.use(adminAuth)

// 1. GET /api/admin/users - List all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-pin').sort({ createdAt: -1 })
    res.json({ users })
  } catch (error) {
    console.error('Error listing users:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 2. GET /api/admin/users/:id - Get detailed user info
router.get('/users/:id', async (req, res) => {
  try {
    const idStr = String(req.params.id || '').trim()
    if (!mongoose.Types.ObjectId.isValid(idStr)) {
      return res.status(400).json({ message: 'Invalid User ID format' })
    }

    const user = await User.findById(idStr, '-pin')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get stock holdings
    const holdings = await Stock.find({ user: idStr })

    // Get transactions (regular + stock)
    const txns = await Transaction.find({
      $or: [{ sender: idStr }, { receiver: idStr }]
    }).sort({ createdAt: -1 }).limit(50)

    const stockTxns = await StockTransaction.find({ user: idStr })
      .sort({ createdAt: -1 })
      .limit(50)

    res.json({
      user,
      holdings,
      transactions: txns,
      stockTransactions: stockTxns
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 3. PUT /api/admin/users/:id/balance - Update user balance/rewards/gold
router.put('/users/:id/balance', async (req, res) => {
  try {
    const idStr = String(req.params.id || '').trim()
    if (!mongoose.Types.ObjectId.isValid(idStr)) {
      return res.status(400).json({ message: 'Invalid User ID format' })
    }

    const { balance, rewards, gold } = req.body

    const user = await User.findById(idStr)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (balance !== undefined) {
      const parsedBalance = Number(balance)
      if (!isNaN(parsedBalance)) user.balance = parsedBalance
    }
    if (rewards !== undefined) {
      const parsedRewards = Number(rewards)
      if (!isNaN(parsedRewards)) user.rewards = parsedRewards
    }
    if (gold !== undefined) {
      const parsedGold = Number(gold)
      if (!isNaN(parsedGold)) user.gold = parsedGold
    }

    await user.save()
    res.json({
      message: 'User balance/assets updated successfully',
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
    console.error('Error updating user balance:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 4. DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const idStr = String(req.params.id || '').trim()
    if (!mongoose.Types.ObjectId.isValid(idStr)) {
      return res.status(400).json({ message: 'Invalid User ID format' })
    }

    if (req.user._id.equals(idStr)) {
      return res.status(400).json({ message: 'Cannot delete yourself' })
    }

    const deletedUser = await User.findByIdAndDelete(idStr)
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Clean up user's holdings and transactions
    await Promise.all([
      Stock.deleteMany({ user: idStr }),
      StockTransaction.deleteMany({ user: idStr }),
      Transaction.deleteMany({ $or: [{ sender: idStr }, { receiver: idStr }] })
    ])

    res.json({ message: 'User and all related records deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 5. GET /api/admin/transactions - Get global logs (all transactions)
router.get('/transactions', async (req, res) => {
  try {
    const txns = await Transaction.find()
      .populate('sender', 'name phone vpa')
      .populate('receiver', 'name phone vpa')
      .sort({ createdAt: -1 })
      .limit(100)

    const stockTxns = await StockTransaction.find()
      .populate('user', 'name phone vpa')
      .sort({ createdAt: -1 })
      .limit(100)

    res.json({
      transactions: txns,
      stockTransactions: stockTxns
    })
  } catch (error) {
    console.error('Error fetching global transactions:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 6. POST /api/admin/stocks - Add a new market stock
router.post('/stocks', async (req, res) => {
  try {
    const symbolStr = String(req.body.symbol || '').trim().toUpperCase()
    const nameStr = String(req.body.name || '').trim()
    const priceNum = Number(req.body.price)

    if (!symbolStr || !nameStr || isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ message: 'All fields (symbol, name, price) are required and price must be a valid positive number' })
    }

    const existingStock = await GlobalStock.findOne({ symbol: symbolStr })
    if (existingStock) {
      return res.status(400).json({ message: 'Stock with this symbol already exists' })
    }

    const newStock = new GlobalStock({
      symbol: symbolStr,
      name: nameStr,
      price: priceNum,
      change: 0,
      changePercent: 0
    })

    await newStock.save()
    res.status(201).json({ message: 'Stock added successfully', stock: newStock })
  } catch (error) {
    console.error('Error adding stock:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 7. PUT /api/admin/stocks/:symbol - Update an existing stock
router.put('/stocks/:symbol', async (req, res) => {
  try {
    const symbolStr = String(req.params.symbol || '').trim().toUpperCase()
    const { name, price } = req.body

    const stock = await GlobalStock.findOne({ symbol: symbolStr })
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    if (name !== undefined) {
      stock.name = String(name).trim()
    }
    if (price !== undefined) {
      const oldPrice = stock.price
      const newPrice = Number(price)
      if (!isNaN(newPrice) && newPrice > 0) {
        const priceChange = newPrice - oldPrice
        const changePercent = oldPrice > 0 ? (priceChange / oldPrice) * 100 : 0

        stock.price = newPrice
        stock.change = Math.round(priceChange * 100) / 100
        stock.changePercent = Math.round(changePercent * 100) / 100
      } else {
        return res.status(400).json({ message: 'Invalid price value' })
      }
    }

    await stock.save()
    res.json({ message: 'Stock updated successfully', stock })
  } catch (error) {
    console.error('Error updating stock:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 8. DELETE /api/admin/stocks/:symbol - Delete a stock from market
router.delete('/stocks/:symbol', async (req, res) => {
  try {
    const symbolStr = String(req.params.symbol || '').trim().toUpperCase()
    const deletedStock = await GlobalStock.findOneAndDelete({ symbol: symbolStr })
    if (!deletedStock) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    res.json({ message: 'Stock deleted from market successfully' })
  } catch (error) {
    console.error('Error deleting stock:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// 9. POST /api/admin/promote - Promote an existing user to Super Admin
router.post('/promote', async (req, res) => {
  try {
    const phoneOrVpa = req.body.phoneOrVpa
    if (!phoneOrVpa) {
      return res.status(400).json({ message: 'Phone number or VPA is required' })
    }
    const queryStr = String(phoneOrVpa).trim()

    const user = await User.findOne({
      $or: [{ phone: queryStr }, { vpa: queryStr }]
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isAdmin = true
    await user.save()

    res.json({
      message: `${user.name} has been promoted to Super Admin successfully.`,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        vpa: user.vpa,
        isAdmin: user.isAdmin
      }
    })
  } catch (error) {
    console.error('Error promoting user:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
