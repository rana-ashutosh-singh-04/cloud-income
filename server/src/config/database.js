import mongoose from 'mongoose'
import GlobalStock from '../models/GlobalStock.js'

const seedInitialStocks = async () => {
  try {
    const count = await GlobalStock.countDocuments()
    if (count === 0) {
      const defaultStocks = [
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2450.50, change: 12.30, changePercent: 0.50 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3420.75, change: -15.25, changePercent: -0.44 },
        { symbol: 'INFY', name: 'Infosys Limited', price: 1520.30, change: 8.50, changePercent: 0.56 },
        { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1680.90, change: -5.20, changePercent: -0.31 },
        { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 1120.45, change: 18.75, changePercent: 1.70 },
        { symbol: 'BHARTIARTL', name: 'Bharti Airtel', price: 1320.60, change: 22.40, changePercent: 1.72 },
        { symbol: 'SBIN', name: 'State Bank of India', price: 780.25, change: 5.15, changePercent: 0.66 },
        { symbol: 'WIPRO', name: 'Wipro Limited', price: 485.80, change: -3.20, changePercent: -0.65 },
        { symbol: 'LT', name: 'Larsen & Toubro', price: 3420.00, change: 45.50, changePercent: 1.35 },
        { symbol: 'AXISBANK', name: 'Axis Bank', price: 1250.75, change: 10.30, changePercent: 0.83 },
      ]
      await GlobalStock.insertMany(defaultStocks)
      console.log('Seeded initial global stocks successfully.')
    }
  } catch (error) {
    console.error('Error seeding initial stocks:', error)
  }
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cloud_income')
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    await seedInitialStocks()
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}
