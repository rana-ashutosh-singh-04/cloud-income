import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
  counterpartyName: { type: String, required: true },
  note: { type: String, default: '' },
  reference: { type: String, unique: true },
}, { timestamps: true })

export default mongoose.model('Transaction', transactionSchema)
