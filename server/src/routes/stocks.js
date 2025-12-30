import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import Stock from '../models/Stock.js'
import StockTransaction from '../models/StockTransaction.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Mock stock data - In production, this would come from a real stock API
const STOCK_DATA = {
  'RELIANCE': { name: 'Reliance Industries', price: 2450.50, change: 12.30, changePercent: 0.50 },
  'TCS': { name: 'Tata Consultancy Services', price: 3420.75, change: -15.25, changePercent: -0.44 },
  'INFY': { name: 'Infosys Limited', price: 1520.30, change: 8.50, changePercent: 0.56 },
  'HDFCBANK': { name: 'HDFC Bank', price: 1680.90, change: -5.20, changePercent: -0.31 },
  'ICICIBANK': { name: 'ICICI Bank', price: 1120.45, change: 18.75, changePercent: 1.70 },
  'BHARTIARTL': { name: 'Bharti Airtel', price: 1320.60, change: 22.40, changePercent: 1.72 },
  'SBIN': { name: 'State Bank of India', price: 780.25, change: 5.15, changePercent: 0.66 },
  'WIPRO': { name: 'Wipro Limited', price: 485.80, change: -3.20, changePercent: -0.65 },
  'LT': { name: 'Larsen & Toubro', price: 3420.00, change: 45.50, changePercent: 1.35 },
  'AXISBANK': { name: 'Axis Bank', price: 1250.75, change: 10.30, changePercent: 0.83 },
}

// Get all available stocks with current prices
router.get('/market', auth, async (req, res) => {
  try {
    const stocks = Object.entries(STOCK_DATA).map(([symbol, data]) => ({
      symbol,
      companyName: data.name,
      currentPrice: data.price,
      change: data.change,
      changePercent: data.changePercent,
    }))
    res.json({ stocks })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get stock price history (for charts) - returns last 30 days of mock data
router.get('/history/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params
    const stock = STOCK_DATA[symbol]
    
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    // Generate mock historical data (last 30 days)
    const history = []
    const basePrice = stock.price
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      // Simulate price fluctuations
      const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
      const price = basePrice * (1 + variation)
      
      history.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100,
        volume: Math.floor(Math.random() * 1000000) + 500000,
      })
    }

    res.json({ symbol, history })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's stock holdings
router.get('/holdings', auth, async (req, res) => {
  try {
    const holdings = await Stock.find({ user: req.user._id })
    
    // Update current prices
    const updatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const stockData = STOCK_DATA[holding.symbol]
        if (stockData) {
          holding.currentPrice = stockData.price
          await holding.save()
          
          const totalValue = holding.quantity * stockData.price
          const totalCost = holding.quantity * holding.averagePrice
          const profitLoss = totalValue - totalCost
          const profitLossPercent = ((profitLoss / totalCost) * 100)
          
          return {
            id: holding._id,
            symbol: holding.symbol,
            companyName: holding.companyName,
            quantity: holding.quantity,
            averagePrice: holding.averagePrice,
            currentPrice: stockData.price,
            totalValue,
            totalCost,
            profitLoss,
            profitLossPercent: Math.round(profitLossPercent * 100) / 100,
            change: stockData.change,
            changePercent: stockData.changePercent,
          }
        }
        return null
      })
    )

    res.json({ holdings: updatedHoldings.filter(h => h !== null) })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Buy stocks
router.post('/buy', auth, async (req, res) => {
  try {
    const { symbol, quantity } = req.body
    const user = req.user

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid symbol or quantity' })
    }

    const stockData = STOCK_DATA[symbol]
    if (!stockData) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    const price = stockData.price
    const totalAmount = price * quantity

    if (user.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    // Check if user already owns this stock
    let holding = await Stock.findOne({ user: user._id, symbol })
    
    if (holding) {
      // Update existing holding (calculate new average price)
      const totalCost = (holding.averagePrice * holding.quantity) + totalAmount
      const totalQuantity = holding.quantity + quantity
      holding.averagePrice = totalCost / totalQuantity
      holding.quantity = totalQuantity
      holding.currentPrice = price
    } else {
      // Create new holding
      holding = new Stock({
        user: user._id,
        symbol,
        companyName: stockData.name,
        quantity,
        averagePrice: price,
        currentPrice: price,
      })
    }

    // Deduct balance
    user.balance -= totalAmount

    // Create transaction record
    const transaction = new StockTransaction({
      user: user._id,
      symbol,
      companyName: stockData.name,
      type: 'BUY',
      quantity,
      price,
      totalAmount,
      reference: uuidv4(),
    })

    await Promise.all([
      holding.save(),
      user.save(),
      transaction.save(),
    ])

    res.json({
      message: 'Stock purchased successfully',
      transaction: {
        id: transaction._id,
        symbol,
        quantity,
        price,
        totalAmount,
        reference: transaction.reference,
      },
      balance: user.balance,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Sell stocks
router.post('/sell', auth, async (req, res) => {
  try {
    const { symbol, quantity } = req.body
    const user = req.user

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid symbol or quantity' })
    }

    const stockData = STOCK_DATA[symbol]
    if (!stockData) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    const holding = await Stock.findOne({ user: user._id, symbol })
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock holdings' })
    }

    const price = stockData.price
    const totalAmount = price * quantity

    // Update holding
    holding.quantity -= quantity
    holding.currentPrice = price

    if (holding.quantity === 0) {
      await Stock.deleteOne({ _id: holding._id })
    } else {
      await holding.save()
    }

    // Add balance
    user.balance += totalAmount

    // Create transaction record
    const transaction = new StockTransaction({
      user: user._id,
      symbol,
      companyName: stockData.name,
      type: 'SELL',
      quantity,
      price,
      totalAmount,
      reference: uuidv4(),
    })

    await Promise.all([
      user.save(),
      transaction.save(),
    ])

    res.json({
      message: 'Stock sold successfully',
      transaction: {
        id: transaction._id,
        symbol,
        quantity,
        price,
        totalAmount,
        reference: transaction.reference,
      },
      balance: user.balance,
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Get transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await StockTransaction.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)

    res.json({ transactions })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router


