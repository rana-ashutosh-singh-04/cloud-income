import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  vpa: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  balance: { type: Number, default: 1000 },
  rewards: { type: Number, default: 0 },
  gold: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
