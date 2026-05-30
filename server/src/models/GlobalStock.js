import mongoose from 'mongoose'

const globalStockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true }, // e.g., 'RELIANCE', 'TCS'
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  changePercent: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('GlobalStock', globalStockSchema)
