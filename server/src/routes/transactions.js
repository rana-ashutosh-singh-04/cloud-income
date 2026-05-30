import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import User from '../models/User.js'
import Transaction from '../models/Transaction.js'
import { auth } from '../middleware/auth.js'
import { getIO } from '../config/socket.js'

const router = express.Router()

// Wallet deposits run in simulated Sandbox Mode

// Send money
router.post('/send', auth, async (req, res) => {
  try {
    const vpaParam = req.body.vpa
    const amountParam = req.body.amount
    const noteParam = req.body.note
    const note = String(noteParam || '').trim()
    const pinParam = req.body.pin
    const sender = req.user

    // Validate sender
    if (!sender || !sender._id) {
      return res.status(401).json({ message: 'User not authenticated' })
    }

    // Verify PIN
    const pinStr = String(pinParam || '').trim()
    if (!pinStr) {
      return res.status(400).json({ message: 'PIN is required to authorize transaction' })
    }
    const isPinMatch = await bcrypt.compare(pinStr, sender.pin)
    if (!isPinMatch) {
      return res.status(400).json({ message: 'Invalid PIN' })
    }

    // Validate request body
    if (!vpaParam || !amountParam) {
      return res.status(400).json({ message: 'VPA and amount are required' })
    }

    const numAmount = Number(amountParam)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    const target = String(vpaParam).trim()
    const targetDigits = target.replace(/\D/g, '')

    // Case-insensitive regex for VPA lookup
    const vpaRegex = new RegExp(`^${target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i')

    const queryConditions = [
      { vpa: target },
      { vpa: { $regex: vpaRegex } }
    ]

    // If it looks like a phone number (at least 10 digits), match by the last 10 digits.
    if (targetDigits.length >= 10) {
      const last10Digits = targetDigits.slice(-10)
      queryConditions.push({ phone: { $regex: new RegExp(last10Digits + '$') } })
    } else {
      queryConditions.push({ phone: target })
    }

    const receiver = await User.findOne({ $or: queryConditions })
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
    const { qrData, amount } = req.body
    const vpa = String(qrData || '').trim()
    const note = String(req.body.note || '').trim()
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

// Simulate incoming payment from QR scan
router.post('/simulate-receive', auth, async (req, res) => {
  try {
    const { amount } = req.body
    const senderName = String(req.body.senderName || '').trim()
    const note = String(req.body.note || '').trim()
    const receiver = req.user
    
    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // Find or create mock sender
    const cleanSenderName = senderName || 'Guest User'
    const senderVpa = cleanSenderName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@upi'
    
    let sender = await User.findOne({ vpa: senderVpa })
    if (!sender) {
      const hashedPin = await bcrypt.hash('000000', 10)
      sender = new User({
        name: cleanSenderName,
        phone: '9' + Math.floor(100000000 + Math.random() * 900000000),
        vpa: senderVpa,
        pin: hashedPin,
        balance: 100000
      })
      await sender.save()
    } else {
      if (sender.balance < numAmount) {
        sender.balance = numAmount + 100000
        await sender.save()
      }
    }

    // Perform atomic balance transfer
    const updatedSender = await User.findOneAndUpdate(
      { _id: sender._id, balance: { $gte: numAmount } },
      { $inc: { balance: -numAmount } },
      { new: true }
    )

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
      note: note || 'QR Payment Scan',
      reference
    })

    const creditTxn = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount: numAmount,
      type: 'CREDIT',
      counterpartyName: sender.name,
      note: note || 'QR Payment Scan',
      reference
    })

    await debitTxn.save()
    await creditTxn.save()

    const io = getIO()
    if (io) {
      io.to(`user:${receiver._id}`).emit('transaction:new', {
        id: creditTxn._id,
        amount: numAmount,
        type: 'CREDIT',
        counterpartyName: sender.name,
        note: note || 'QR Payment Scan',
        reference,
        createdAt: creditTxn.createdAt,
        balance: updatedReceiver.balance
      })
      io.to(`user:${receiver._id}`).emit('balance:update', { balance: updatedReceiver.balance })
      io.to(`user:${receiver._id}`).emit('payment:received', {
        from: sender.name,
        amount: numAmount,
        reference
      })
    }

    res.json({
      message: 'Simulated payment received successfully',
      reference
    })
  } catch (error) {
    console.error('Error in /simulate-receive route:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Create Simulated Deposit Order
router.post('/razorpay-order', auth, async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' })
    }

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // Simulated sandbox order ID
    return res.json({
      orderId: `order_mock_${uuidv4().replace(/-/g, '').slice(0, 14)}`,
      amount: Math.round(numAmount * 100),
      currency: 'INR',
      sandbox: true
    })
  } catch (error) {
    console.error('Error in /razorpay-order:', error)
    res.status(500).json({ message: 'Failed to create order', error: error.message })
  }
})

// Verify Simulated Deposit
router.post('/razorpay-verify', auth, async (req, res) => {
  try {
    const { razorpay_payment_id, amount } = req.body
    const user = req.user

    console.log("Verifying payment in simulated Sandbox Mode.")
    const numAmount = Number(amount) / 100 // Convert paisa back to INR
    
    // Update user balance atomically
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { balance: numAmount } },
      { new: true }
    )

    // Find or create gateway user for logs
    let systemUser = await User.findOne({ vpa: 'gateway@upi' })
    if (!systemUser) {
      const hashedPin = await bcrypt.hash('000000', 10)
      systemUser = new User({
        name: 'UPI Payment Gateway',
        phone: '0000000000',
        vpa: 'gateway@upi',
        pin: hashedPin,
        balance: 9999999999
      })
      await systemUser.save()
    }

    const reference = razorpay_payment_id || `pay_mock_${uuidv4().replace(/-/g, '').slice(0, 14)}`

    const creditTxn = new Transaction({
      sender: systemUser._id,
      receiver: user._id,
      amount: numAmount,
      type: 'CREDIT',
      counterpartyName: 'Payment Gateway (Simulated)',
      note: 'Loaded wallet via Sandbox Deposit',
      reference
    })

    await creditTxn.save()

    const io = getIO()
    if (io) {
      io.to(`user:${user._id}`).emit('transaction:new', {
        id: creditTxn._id,
        amount: numAmount,
        type: 'CREDIT',
        counterpartyName: creditTxn.counterpartyName,
        note: creditTxn.note,
        reference,
        createdAt: creditTxn.createdAt,
        balance: updatedUser.balance
      })
      io.to(`user:${user._id}`).emit('balance:update', { balance: updatedUser.balance })
    }

    return res.json({
      message: 'Payment verified successfully (Simulated)',
      balance: updatedUser.balance,
      reference
    })
  } catch (error) {
    console.error('Error in /razorpay-verify:', error)
    res.status(500).json({ message: 'Verification failed', error: error.message })
  }
})

// Withdraw money from wallet
router.post('/withdraw', auth, async (req, res) => {
  try {
    const methodStr = String(req.body.method || '').trim()
    const pinStr = String(req.body.pin || '').trim()
    const { details, amount } = req.body
    const user = req.user

    // Basic validation
    if (!methodStr || !details || !amount || !pinStr) {
      return res.status(400).json({ message: 'All fields (method, details, amount, pin) are required' })
    }

    if (typeof details !== 'object' || details === null) {
      return res.status(400).json({ message: 'Invalid details format' })
    }

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' })
    }

    // Verify PIN
    const isPinMatch = await bcrypt.compare(pinStr, user.pin)
    if (!isPinMatch) {
      return res.status(400).json({ message: 'Invalid PIN' })
    }

    // Validate details depending on method
    let counterparty = ''
    let noteText = ''
    if (methodStr === 'upi') {
      const vpaStr = String(details.vpa || '').trim()
      if (!vpaStr) {
        return res.status(400).json({ message: 'UPI ID is required' })
      }
      counterparty = vpaStr
      noteText = 'Withdrawal to UPI'
    } else if (methodStr === 'bank') {
      const accountNoStr = String(details.accountNo || '').trim()
      const ifscStr = String(details.ifsc || '').trim()
      const bankNameStr = String(details.bankName || '').trim()
      if (!accountNoStr || !ifscStr || !bankNameStr) {
        return res.status(400).json({ message: 'Bank account number, IFSC, and bank name are required' })
      }
      counterparty = `${bankNameStr} (A/C: ...${accountNoStr.slice(-4)})`
      noteText = 'Withdrawal to Bank Account'
    } else {
      return res.status(400).json({ message: 'Invalid withdrawal method' })
    }

    // Perform atomic balance transfer
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, balance: { $gte: numAmount } },
      { $inc: { balance: -numAmount } },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    const reference = `with_${uuidv4().replace(/-/g, '').slice(0, 14)}`

    // Create DEBIT transaction
    const debitTxn = new Transaction({
      sender: user._id,
      receiver: null, // Leaves platform
      amount: numAmount,
      type: 'DEBIT',
      counterpartyName: counterparty,
      note: noteText,
      reference
    })

    await debitTxn.save()

    // Emit WebSocket updates
    const io = getIO()
    if (io) {
      io.to(`user:${user._id}`).emit('transaction:new', {
        id: debitTxn._id,
        amount: numAmount,
        type: 'DEBIT',
        counterpartyName: debitTxn.counterpartyName,
        note: debitTxn.note,
        reference,
        createdAt: debitTxn.createdAt,
        balance: updatedUser.balance
      })
      io.to(`user:${user._id}`).emit('balance:update', { balance: updatedUser.balance })
    }

    res.json({
      message: 'Withdrawal processed successfully',
      reference,
      balance: updatedUser.balance
    })
  } catch (error) {
    console.error('Error in /withdraw endpoint:', error)
    res.status(500).json({ message: 'Server error during withdrawal' })
  }
})

export default router
