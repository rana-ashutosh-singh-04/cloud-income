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

    const receiver = await User.findOne({ vpa })
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' })
    }

    if (receiver._id.equals(sender._id)) {
      return res.status(400).json({ message: 'Cannot send money to yourself' })
    }

    // --- ATOMIC BALANCE TRANSFERS ---
    // 1. Deduct from sender atomically (ensures no race conditions if multiple requests fire simultaneously)
    const updatedSender = await User.findOneAndUpdate(
      { _id: sender._id, balance: { $gte: numAmount } },
      { $inc: { balance: -numAmount } },
      { new: true }
    )

    if (!updatedSender) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    // 2. Add to receiver atomically
    const updatedReceiver = await User.findByIdAndUpdate(
      receiver._id,
      { $inc: { balance: numAmount } },
      { new: true }
    )

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
      balance: updatedSender.balance
    }

    const receiverTransactionData = {
      id: creditTxn._id,
      amount: numAmount,
      type: 'CREDIT',
      counterpartyName: sender.name,
      note,
      reference,
      createdAt: creditTxn.createdAt,
      balance: updatedReceiver.balance
    }

    const io = getIO()
    if (io) {
      // Notify sender
      io.to(`user:${sender._id}`).emit('transaction:new', transactionData)
      io.to(`user:${sender._id}`).emit('balance:update', { balance: updatedSender.balance })

      // Notify receiver
      io.to(`user:${receiver._id}`).emit('transaction:new', receiverTransactionData)
      io.to(`user:${receiver._id}`).emit('balance:update', { balance: updatedReceiver.balance })
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
    res.status(500).json({ 
      message: 'Server error',
      error: error.message || 'Unknown error'
    })
  }
})

// Get recent transactions
router.get('/recent', auth, async (req, res) => {
  try {
    // BUGFIX: Only fetch DEBIT txns where user is sender, OR CREDIT txns where user is receiver
    // This prevents double-counting the two distinct Transaction documents created per transfer.
    const transactions = await Transaction.find({
      $or: [
        { sender: req.user._id, type: 'DEBIT' }, 
        { receiver: req.user._id, type: 'CREDIT' }
      ]
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: -1 })
    .limit(20)

    const formattedTransactions = transactions.map(txn => ({
      id: txn._id,
      amount: txn.amount,
      type: txn.type,
      counterpartyName: txn.counterpartyName,
      note: txn.note,
      createdAt: txn.createdAt
    }))

    res.json({ transactions: formattedTransactions })
  } catch (error) {
    console.error('Error in /recent route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// QR Payment
router.post('/qr-pay', auth, async (req, res) => {
  try {
    const { qrData, amount, note } = req.body
    const vpa = qrData
    const sender = req.user

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const receiver = await User.findOne({ vpa })
    if (!receiver) {
      return res.status(404).json({ message: 'Invalid QR code' })
    }

    if (receiver._id.equals(sender._id)) {
      return res.status(400).json({ message: 'Cannot send money to yourself' })
    }

    // --- ATOMIC BALANCE TRANSFERS ---
    const updatedSender = await User.findOneAndUpdate(
      { _id: sender._id, balance: { $gte: numAmount } },
      { $inc: { balance: -numAmount } },
      { new: true }
    )

    if (!updatedSender) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    const updatedReceiver = await User.findByIdAndUpdate(
      receiver._id,
      { $inc: { balance: numAmount } },
      { new: true }
    )

    const reference = uuidv4()

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

    await debitTxn.save()
    await creditTxn.save()

    const io = getIO()
    if (io) {
      io.to(`user:${sender._id}`).emit('transaction:new', {
        id: debitTxn._id, amount: numAmount, type: 'DEBIT', counterpartyName: receiver.name, note, reference, createdAt: debitTxn.createdAt, balance: updatedSender.balance
      })
      io.to(`user:${sender._id}`).emit('balance:update', { balance: updatedSender.balance })

      io.to(`user:${receiver._id}`).emit('transaction:new', {
        id: creditTxn._id, amount: numAmount, type: 'CREDIT', counterpartyName: sender.name, note, reference, createdAt: creditTxn.createdAt, balance: updatedReceiver.balance
      })
      io.to(`user:${receiver._id}`).emit('balance:update', { balance: updatedReceiver.balance })
      io.to(`user:${receiver._id}`).emit('payment:received', { from: sender.name, amount: numAmount, reference })
    }

    res.json({
      message: 'Payment successful',
      transaction: { id: debitTxn._id, amount: numAmount, receiver: receiver.name, reference }
    })
  } catch (error) {
    console.error('Error in /qr-pay route:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
