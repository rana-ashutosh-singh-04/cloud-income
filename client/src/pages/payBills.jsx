import Navbar from "../components/Navbar";
import Card from "../components/card";

export default function PayBills() {
  const bills = [
    { name: "Electricity", icon: "💡" },
    { name: "Water", icon: "🚰" },
    { name: "Broadband", icon: "🌐" },
    { name: "DTH", icon: "📺" },
    { name: "Gas", icon: "🔥" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Card className="shadow-md rounded-2xl p-6">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-purple-700 mb-6">
            Pay Your Bills
          </h2>

          {/* Bills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
            {bills.map((bill) => (
              <div
                key={bill.name}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col items-center justify-center hover:shadow-md hover:bg-purple-50 transition-all cursor-pointer"
              >
                <div className="text-4xl mb-2">{bill.icon}</div>
                <div className="text-sm font-medium text-gray-700">
                  {bill.name}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
