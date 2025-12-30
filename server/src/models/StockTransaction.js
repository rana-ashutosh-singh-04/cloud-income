import mongoose from 'mongoose'

const stockTransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  companyName: { type: String, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Price per share at transaction time
  totalAmount: { type: Number, required: true }, // quantity * price
  reference: { type: String, unique: true }, // UUID for tracking
}, { timestamps: true })

export default mongoose.model('StockTransaction', stockTransactionSchema)


