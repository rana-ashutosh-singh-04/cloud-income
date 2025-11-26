import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { auth } from '../middleware/auth.js'

const router = express.Router()

// Send money
router.post('/send', auth, async (req, res) => {
  try {
    const { vpa, amount, note } = req.body
    const sender = req.user

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    if (sender.balance < amount) {
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

    // Update balances
    sender.balance -= amount
    receiver.balance += amount

    await Promise.all([
      debitTxn.save(),
      creditTxn.save(),
      sender.save(),
      receiver.save()
    ])

    res.json({
      message: 'Money sent successfully',
      transaction: {
        id: debitTxn._id,
        amount,
        receiver: receiver.name,
        reference
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
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
    res.status(500).json({ message: 'Server error' })
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

    if (amount <= 0) {
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

    await Promise.all([
      debitTxn.save(),
      creditTxn.save(),
      sender.save(),
      receiver.save()
    ])

    res.json({
      message: 'Payment successful',
      transaction: {
        id: debitTxn._id,
        amount,
        receiver: receiver.name,
        reference
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
