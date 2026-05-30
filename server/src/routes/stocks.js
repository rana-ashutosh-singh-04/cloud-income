import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import Stock from '../models/Stock.js'
import StockTransaction from '../models/StockTransaction.js'
import GlobalStock from '../models/GlobalStock.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Get all available stocks with current prices
router.get('/market', auth, async (req, res) => {
  try {
    const dbStocks = await GlobalStock.find()
    const stocks = dbStocks.map(stock => ({
      symbol: stock.symbol,
      companyName: stock.name,
      currentPrice: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
    }))
    res.json({ stocks })
  } catch (error) {
    console.error('Error in /market route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get stock price history (for charts) - returns last 30 days of mock data
router.get('/history/:symbol', auth, async (req, res) => {
  try {
    const { symbol } = req.params
    const stock = await GlobalStock.findOne({ symbol })
    
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
    console.error('Error in /history route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user's stock holdings
router.get('/holdings', auth, async (req, res) => {
  try {
    const holdings = await Stock.find({ user: req.user._id })
    const dbStocks = await GlobalStock.find()
    const stockMap = dbStocks.reduce((acc, s) => {
      acc[s.symbol] = s
      return acc
    }, {})
    
    // Update current prices
    const updatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const stockData = stockMap[holding.symbol]
        if (stockData) {
          holding.currentPrice = stockData.price
          await holding.save()
          
          const totalValue = holding.quantity * stockData.price
          const totalCost = holding.quantity * holding.averagePrice
          const profitLoss = totalValue - totalCost
          const profitLossPercent = totalCost > 0 ? ((profitLoss / totalCost) * 100) : 0
          
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
    console.error('Error in /holdings route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Buy stocks
router.post('/buy', auth, async (req, res) => {
  try {
    const symbolStr = String(req.body.symbol || '').trim().toUpperCase()
    const quantityNum = Math.floor(Number(req.body.quantity))
    const user = req.user

    if (!symbolStr || isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ message: 'Invalid symbol or quantity' })
    }

    const stockData = await GlobalStock.findOne({ symbol: symbolStr })
    if (!stockData) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    const price = stockData.price
    const totalAmount = price * quantityNum

    if (user.balance < totalAmount) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    // Check if user already owns this stock
    let holding = await Stock.findOne({ user: user._id, symbol: symbolStr })
    
    if (holding) {
      // Update existing holding (calculate new average price)
      const totalCost = (holding.averagePrice * holding.quantity) + totalAmount
      const totalQuantity = holding.quantity + quantityNum
      holding.averagePrice = totalCost / totalQuantity
      holding.quantity = totalQuantity
      holding.currentPrice = price
    } else {
      // Create new holding
      holding = new Stock({
        user: user._id,
        symbol: symbolStr,
        companyName: stockData.name,
        quantity: quantityNum,
        averagePrice: price,
        currentPrice: price,
      })
    }

    // Deduct balance
    user.balance -= totalAmount

    // Create transaction record
    const transaction = new StockTransaction({
      user: user._id,
      symbol: symbolStr,
      companyName: stockData.name,
      type: 'BUY',
      quantity: quantityNum,
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
        symbol: symbolStr,
        quantity: quantityNum,
        price,
        totalAmount,
        reference: transaction.reference,
      },
      balance: user.balance,
    })
  } catch (error) {
    console.error('Error in /buy route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Sell stocks
router.post('/sell', auth, async (req, res) => {
  try {
    const symbolStr = String(req.body.symbol || '').trim().toUpperCase()
    const quantityNum = Math.floor(Number(req.body.quantity))
    const user = req.user

    if (!symbolStr || isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ message: 'Invalid symbol or quantity' })
    }

    const stockData = await GlobalStock.findOne({ symbol: symbolStr })
    if (!stockData) {
      return res.status(404).json({ message: 'Stock not found' })
    }

    const holding = await Stock.findOne({ user: user._id, symbol: symbolStr })
    if (!holding || holding.quantity < quantityNum) {
      return res.status(400).json({ message: 'Insufficient stock holdings' })
    }

    const price = stockData.price
    const totalAmount = price * quantityNum

    // Update holding
    holding.quantity -= quantityNum
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
      symbol: symbolStr,
      companyName: stockData.name,
      type: 'SELL',
      quantity: quantityNum,
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
        symbol: symbolStr,
        quantity: quantityNum,
        price,
        totalAmount,
        reference: transaction.reference,
      },
      balance: user.balance,
    })
  } catch (error) {
    console.error('Error in /sell route:', error)
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
    console.error('Error in stock /transactions route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
