import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import morgan from 'morgan'
import cors from 'cors'
import { connectDB } from './config/database.js'
import { initializeSocket } from './config/socket.js'
import authRoutes from './routes/auth.js'
import transactionRoutes from './routes/transactions.js'
import stockRoutes from './routes/stocks.js'

const app = express()
const server = createServer(app)

// Initialize Socket.IO
export const io = initializeSocket(server)

// Middleware
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Connect to database
connectDB()

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/txn', transactionRoutes)
app.use('/api/stocks', stockRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`WebSocket server initialized`)
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
})
