import mongoose from 'mongoose'

const stockSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true }, // e.g., 'RELIANCE', 'TCS', 'INFY'
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  averagePrice: { type: Number, required: true }, // Average purchase price
  currentPrice: { type: Number, required: true }, // Latest price
}, { timestamps: true })

// Compound index to ensure one stock per user
stockSchema.index({ user: 1, symbol: 1 }, { unique: true })

export default mongoose.model('Stock', stockSchema)


