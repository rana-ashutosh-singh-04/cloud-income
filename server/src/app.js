import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { connectDB } from './config/database.js'
import authRoutes from './routes/auth.js'
import transactionRoutes from './routes/transactions.js'

const app = express()

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Connect to database
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/txn', transactionRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
