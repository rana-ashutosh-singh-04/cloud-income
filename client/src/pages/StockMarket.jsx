import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'
import { useAuth } from '../hooks/useAuth'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function StockMarket() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stocks, setStocks] = useState([])
  const [holdings, setHoldings] = useState([])
  const [selectedStock, setSelectedStock] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [transactionType, setTransactionType] = useState('BUY')
  const [activeTab, setActiveTab] = useState('market') // 'market' or 'holdings'

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadData()
  }, [user, navigate])

  useEffect(() => {
    if (selectedStock) {
      loadPriceHistory(selectedStock.symbol)
    }
  }, [selectedStock])

  const loadData = async () => {
    try {
      setLoading(true)
      const [stocksRes, holdingsRes] = await Promise.all([
        api.get('/stocks/market'),
        api.get('/stocks/holdings'),
      ])
      setStocks(stocksRes.data.stocks)
      setHoldings(holdingsRes.data.holdings)
      if (stocksRes.data.stocks.length > 0 && !selectedStock) {
        setSelectedStock(stocksRes.data.stocks[0])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPriceHistory = async (symbol) => {
    try {
      const res = await api.get(`/stocks/history/${symbol}`)
      setPriceHistory(res.data.history)
    } catch (error) {
      console.error('Error loading price history:', error)
    }
  }

  const handleTransaction = async () => {
    if (!selectedStock || !quantity || parseFloat(quantity) <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    try {
      setTransactionLoading(true)
      const endpoint = transactionType === 'BUY' ? '/stocks/buy' : '/stocks/sell'
      await api.post(endpoint, {
        symbol: selectedStock.symbol,
        quantity: parseFloat(quantity),
      })
      
      alert(`${transactionType === 'BUY' ? 'Purchase' : 'Sale'} successful!`)
      setQuantity('')
      loadData() // Reload data to update holdings and balance
    } catch (error) {
      alert(error.response?.data?.message || 'Transaction failed')
    } finally {
      setTransactionLoading(false)
    }
  }

  const totalPortfolioValue = holdings.reduce((sum, h) => sum + h.totalValue, 0)
  const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0)
  const totalProfitLoss = totalPortfolioValue - totalCost
  const totalProfitLossPercent = totalCost > 0 ? ((totalProfitLoss / totalCost) * 100) : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Stock Market</h1>
          <p className="text-gray-600">Trade stocks, track trends, and manage your portfolio</p>
        </div>

        {/* Portfolio Summary */}
        {holdings.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Portfolio Value</p>
                <p className="text-3xl font-bold">₹{totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Total P&L</p>
                <div className="flex items-center gap-2">
                  {totalProfitLoss >= 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    ₹{totalProfitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <p className={`text-sm ${totalProfitLossPercent >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {totalProfitLossPercent >= 0 ? '+' : ''}{totalProfitLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'market'
                ? 'text-purple-700 border-b-2 border-purple-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setActiveTab('holdings')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'holdings'
                ? 'text-purple-700 border-b-2 border-purple-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Holdings ({holdings.length})
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stock List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-900">
                {activeTab === 'market' ? 'Available Stocks' : 'Your Holdings'}
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {(activeTab === 'market' ? stocks : holdings).map((stock) => {
                  const isSelected = selectedStock?.symbol === stock.symbol
                  const change = stock.change || 0
                  const changePercent = stock.changePercent || 0
                  const isPositive = change >= 0

                  return (
                    <button
                      key={stock.symbol}
                      onClick={() => setSelectedStock(stock)}
                      className={`w-full text-left p-4 rounded-lg transition ${
                        isSelected
                          ? 'bg-purple-100 border-2 border-purple-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900">{stock.symbol}</h3>
                        <span className={`flex items-center gap-1 text-sm font-semibold ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {Math.abs(changePercent).toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{stock.companyName}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{stock.currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}₹{Math.abs(change).toFixed(2)}
                        </span>
                      </div>
                      {activeTab === 'holdings' && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Qty: {stock.quantity}</span>
                            <span>Value: ₹{stock.totalValue?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Chart and Transaction */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStock && (
              <>
                {/* Stock Details Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedStock.symbol}</h2>
                      <p className="text-gray-600">{selectedStock.companyName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        ₹{selectedStock.currentPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <div className={`flex items-center gap-1 ${selectedStock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedStock.changePercent >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="font-semibold">
                          {selectedStock.changePercent >= 0 ? '+' : ''}
                          {selectedStock.changePercent?.toFixed(2)}% ({selectedStock.change >= 0 ? '+' : ''}₹{Math.abs(selectedStock.change || 0).toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price Chart */}
                  {priceHistory.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        30-Day Price Trend
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={priceHistory}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="date" 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => {
                              const date = new Date(value)
                              return `${date.getDate()}/${date.getMonth() + 1}`
                            }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `₹${value.toFixed(0)}`}
                          />
                          <Tooltip 
                            formatter={(value) => [`₹${value.toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => {
                              const date = new Date(label)
                              return date.toLocaleDateString('en-IN')
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#9333ea" 
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Transaction Card */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">Place Order</h3>
                  
                  {/* Transaction Type Toggle */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setTransactionType('BUY')}
                      className={`flex-1 py-3 rounded-lg font-semibold transition ${
                        transactionType === 'BUY'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => setTransactionType('SELL')}
                      className={`flex-1 py-3 rounded-lg font-semibold transition ${
                        transactionType === 'SELL'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Sell
                    </button>
                  </div>

                  {/* Quantity Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                      min="1"
                      step="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Order Summary */}
                  {quantity && parseFloat(quantity) > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Price per share:</span>
                        <span className="font-semibold">₹{selectedStock.currentPrice?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-semibold">{quantity}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">Total Amount:</span>
                        <span className="font-bold text-lg text-purple-700">
                          ₹{(selectedStock.currentPrice * parseFloat(quantity)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Balance Info */}
                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <Wallet className="w-4 h-4" />
                    <span>Available Balance: ₹{user?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleTransaction}
                    disabled={transactionLoading || !quantity || parseFloat(quantity) <= 0}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                      transactionType === 'BUY'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-red-500 hover:bg-red-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {transactionLoading ? 'Processing...' : `${transactionType === 'BUY' ? 'Buy' : 'Sell'} Stock`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


