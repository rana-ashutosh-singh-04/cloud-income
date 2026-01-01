import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { auth } from '../middleware/auth.js'
import { getIO } from '../config/socket.js'

const router = express.Router()

// Send money
router.post('/send', auth, async (req, res) => {
  try {
    const { vpa, amount, note } = req.body
    const sender = req.user

    // Validate sender
    if (!sender || !sender._id) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    // Validate request body
    if (!vpa || !amount) {
      return res.status(400).json({ message: 'VPA and amount are required' })
    }

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // Ensure balance is a number
    const senderBalance = Number(sender.balance) || 0
    if (senderBalance < numAmount) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    const receiver = await User.findOne({ vpa })
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

    if (receiver._id.equals(sender._id)) {
      return res.status(400).json({ message: 'Cannot send money to yourself' })
    }

    // Generate unique reference
    const reference = uuidv4()

    // Create transactions
    const debitTxn = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: numAmount,
      type: 'DEBIT',
      counterpartyName: receiver.name,
      note: note || '',
      reference
    })

    const creditTxn = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: numAmount,
      type: 'CREDIT',
      counterpartyName: sender.name,
      note: note || '',
      reference
    })

    // Update balances
    sender.balance = senderBalance - numAmount
    receiver.balance = (Number(receiver.balance) || 0) + numAmount

    // 1️⃣ Save balances first
    await sender.save()
    await receiver.save()

    // 2️⃣ Then save transactions
    await debitTxn.save()
    await creditTxn.save()


    // Emit real-time events
    const transactionData = {
      id: debitTxn._id,
      amount: numAmount,
      type: 'DEBIT',
      counterpartyName: receiver.name,
      note,
      reference,
      createdAt: debitTxn.createdAt,
      balance: sender.balance
    }

    const receiverTransactionData = {
      id: creditTxn._id,
      amount: numAmount,
      type: 'CREDIT',
      counterpartyName: sender.name,
      note,
      reference,
      createdAt: creditTxn.createdAt,
      balance: receiver.balance
    }

    // Emit real-time events
    const io = getIO()
    if (io) {
      // Notify sender
      io.to(`user:${sender._id}`).emit('transaction:new', transactionData)
      io.to(`user:${sender._id}`).emit('balance:update', { balance: sender.balance })

      // Notify receiver
      io.to(`user:${receiver._id}`).emit('transaction:new', receiverTransactionData)
      io.to(`user:${receiver._id}`).emit('balance:update', { balance: receiver.balance })
      io.to(`user:${receiver._id}`).emit('payment:received', {
        from: sender.name,
        amount: numAmount,
        reference
      })
    }

    res.json({
      message: 'Money sent successfully',
      transaction: {
        id: debitTxn._id,
        amount: numAmount,
        receiver: receiver.name,
        reference
      }
    })
  } catch (error) {
    console.error('Error in /send route:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    })
    res.status(500).json({ 
      message: 'Server error',
      error: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        name: error.name,
        code: error.code
      } : undefined
    })
  }
})

// Get recent transactions
router.get('/recent', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: -1 })
    .limit(20)

    const formattedTransactions = transactions.map(txn => ({
      id: txn._id,
      amount: txn.amount,
      type: txn.sender._id.equals(req.user._id) ? 'DEBIT' : 'CREDIT',
      counterpartyName: txn.sender._id.equals(req.user._id) ? txn.receiver.name : txn.sender.name,
      note: txn.note,
      createdAt: txn.createdAt
    }))

    res.json({ transactions: formattedTransactions })
  } catch (error) {
    console.error('Error in /recent route:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// QR Payment (simplified - just send money)
router.post('/qr-pay', auth, async (req, res) => {
  try {
    const { qrData, amount, note } = req.body
    // In a real app, qrData would contain receiver info
    // For simplicity, assume qrData is the receiver's VPA
    const vpa = qrData

    const receiver = await User.findOne({ vpa })
    if (!receiver) {
      return res.status(404).json({ message: 'Invalid QR code' })
    }

    // Reuse send logic
    const sender = req.user

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    if (sender.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    if (receiver._id.equals(sender._id)) {
      return res.status(400).json({ message: 'Cannot send money to yourself' })
    }

    const reference = uuidv4()

    const debitTxn = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'DEBIT',
      counterpartyName: receiver.name,
      note,
      reference
    })

    const creditTxn = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'CREDIT',
      counterpartyName: sender.name,
      note,
      reference
    })

    sender.balance -= amount
    receiver.balance += amount

    // 1️⃣ Save balances first
    await sender.save()
    await receiver.save()

    // 2️⃣ Then save transactions
    await debitTxn.save()
    await creditTxn.save()

    // Emit real-time events
    const transactionData = {
      id: debitTxn._id,
      amount: numAmount,
      type: 'DEBIT',
      counterpartyName: receiver.name,
      note,
      reference,
      createdAt: debitTxn.createdAt,
      balance: sender.balance
    }

    const receiverTransactionData = {
      id: creditTxn._id,
      amount: numAmount,
      type: 'CREDIT',
      counterpartyName: sender.name,
      note,
      reference,
      createdAt: creditTxn.createdAt,
      balance: receiver.balance
    }

    // Emit real-time events
    const io = getIO()
    if (io) {
      // Notify sender
      io.to(`user:${sender._id}`).emit('transaction:new', transactionData)
      io.to(`user:${sender._id}`).emit('balance:update', { balance: sender.balance })

      // Notify receiver
      io.to(`user:${receiver._id}`).emit('transaction:new', receiverTransactionData)
      io.to(`user:${receiver._id}`).emit('balance:update', { balance: receiver.balance })
      io.to(`user:${receiver._id}`).emit('payment:received', {
        from: sender.name,
        amount: numAmount,
        reference
      })
    }

    res.json({
      message: 'Payment successful',
      transaction: {
        id: debitTxn._id,
        amount:numAmount,
        receiver: receiver.name,
        reference
      }
    })
  } catch (error) {
    console.error('Error in /qr-pay route:', error)
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

export default router
