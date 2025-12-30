import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3, Newspaper } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { api } from "../lib/api";
import { useAuth } from "../hooks/useAuth";

export default function StockMarketWidget() {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketData();
  }, []);

  useEffect(() => {
    if (selectedStock && stocks.length > 0) {
      loadPriceHistory(selectedStock.symbol);
    }
  }, [selectedStock, stocks]);

  const loadMarketData = async () => {
    try {
      setLoading(true);
      // For non-authenticated users, use mock data
      if (!user) {
        const mockStocks = [
          { symbol: "RELIANCE", companyName: "Reliance Industries", currentPrice: 2450.50, change: 12.30, changePercent: 0.50 },
          { symbol: "TCS", companyName: "Tata Consultancy Services", currentPrice: 3420.75, change: -15.25, changePercent: -0.44 },
          { symbol: "INFY", companyName: "Infosys Limited", currentPrice: 1520.30, change: 8.50, changePercent: 0.56 },
          { symbol: "HDFCBANK", companyName: "HDFC Bank", currentPrice: 1680.90, change: -5.20, changePercent: -0.31 },
          { symbol: "ICICIBANK", companyName: "ICICI Bank", currentPrice: 1120.45, change: 18.75, changePercent: 1.70 },
          { symbol: "BHARTIARTL", companyName: "Bharti Airtel", currentPrice: 1320.60, change: 22.40, changePercent: 1.72 },
        ];
        setStocks(mockStocks);
        if (mockStocks.length > 0) {
          setSelectedStock(mockStocks[0]);
        }
      } else {
        const stocksRes = await api.get("/stocks/market");
        setStocks(stocksRes.data.stocks);
        if (stocksRes.data.stocks.length > 0) {
          setSelectedStock(stocksRes.data.stocks[0]);
        }
      }
      // Mock news data
      setNews([
        {
          id: 1,
          title: "Sensex hits new all-time high, crosses 75,000 mark",
          source: "Economic Times",
          time: "2h ago",
          category: "Market",
        },
        {
          id: 2,
          title: "Reliance Industries announces major expansion plans",
          source: "Business Standard",
          time: "4h ago",
          category: "Company",
        },
        {
          id: 3,
          title: "IT sector sees strong Q4 earnings, TCS leads",
          source: "Money Control",
          time: "6h ago",
          category: "Earnings",
        },
        {
          id: 4,
          title: "Banking stocks surge on RBI policy announcement",
          source: "Livemint",
          time: "8h ago",
          category: "Policy",
        },
      ]);
    } catch (error) {
      console.error("Error loading market data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPriceHistory = async (symbol) => {
    try {
      if (!user) {
        // Generate mock history for non-authenticated users
        const mockHistory = [];
        const stock = stocks.find(s => s.symbol === symbol) || selectedStock;
        const basePrice = stock?.currentPrice || 1000;
        const today = new Date();
        for (let i = 14; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const variation = (Math.random() - 0.5) * 0.1;
          const price = basePrice * (1 + variation);
          mockHistory.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(price * 100) / 100,
          });
        }
        setPriceHistory(mockHistory);
      } else {
        const res = await api.get(`/stocks/history/${symbol}`);
        setPriceHistory(res.data.history);
      }
    } catch (error) {
      console.error("Error loading price history:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
          <BarChart3 className="w-10 h-10 text-purple-600" />
          Stock Market
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Track market trends and stay updated with the latest financial news
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Market Overview - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Stocks */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-xl text-gray-900">Top Stocks</h3>
              {user && (
                <Link
                  to="/stocks"
                  className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1"
                >
                  View All <ArrowUpRight className="w-4 h-4" />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stocks.slice(0, 6).map((stock) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedStock(stock)}
                    className={`p-4 rounded-xl border-2 transition ${
                      selectedStock?.symbol === stock.symbol
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{stock.symbol}</h4>
                      <span
                        className={`flex items-center gap-1 text-xs font-semibold ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1 truncate">{stock.companyName}</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{stock.currentPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Chart */}
          {selectedStock && priceHistory.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{selectedStock.symbol}</h3>
                  <p className="text-sm text-gray-600">{selectedStock.companyName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{selectedStock.currentPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      selectedStock.changePercent >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {selectedStock.changePercent >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {selectedStock.changePercent >= 0 ? "+" : ""}
                      {selectedStock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={priceHistory.slice(-15)}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `₹${value.toFixed(0)}`}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${value.toFixed(2)}`, "Price"]}
                    labelFormatter={(label) => {
                      const date = new Date(label);
                      return date.toLocaleDateString("en-IN");
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

        {/* News Section - Right Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <Newspaper className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-xl text-gray-900">Market News</h3>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-purple-300 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h4>
                  <p className="text-xs text-gray-600">{item.source}</p>
                </div>
              ))}
            </div>
            {!user && (
              <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-sm text-gray-700 mb-3">
                  Sign in to access full market data and start trading
                </p>
                <Link
                  to="/signup"
                  className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

