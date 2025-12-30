import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './useAuth'

export function useSocket() {
  const { user, token } = useAuth()
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [lastTransaction, setLastTransaction] = useState(null)
  const [balanceUpdate, setBalanceUpdate] = useState(null)
  const [paymentReceived, setPaymentReceived] = useState(null)

  useEffect(() => {
    if (!user || !token) {
      // Disconnect if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
      return
    }

    // Connect to WebSocket server
    const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      setIsConnected(false)
      
      // If authentication fails, clear invalid token
      if (error.message?.includes('Authentication error') || error.message?.includes('Invalid token')) {
        console.warn('Socket authentication failed, clearing token')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // The API interceptor will handle redirecting to login
      }
    })

    // Listen for new transactions
    socket.on('transaction:new', (transaction) => {
      console.log('New transaction received:', transaction)
      setLastTransaction(transaction)
    })

    // Listen for balance updates
    socket.on('balance:update', (data) => {
      console.log('Balance updated:', data)
      setBalanceUpdate(data)
    })

    // Listen for payment received notifications
    socket.on('payment:received', (data) => {
      console.log('Payment received:', data)
      setPaymentReceived(data)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [user, token])

  return {
    isConnected,
    lastTransaction,
    balanceUpdate,
    paymentReceived,
    clearPaymentNotification: () => setPaymentReceived(null),
    clearTransaction: () => setLastTransaction(null)
  }
}


