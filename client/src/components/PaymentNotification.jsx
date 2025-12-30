import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function PaymentNotification({ payment, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (payment) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for animation
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [payment, onClose]);

  if (!payment || !visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-green-200 p-6 max-w-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">Payment Received!</h3>
            <p className="text-sm text-gray-600 mb-2">
              You received ₹{payment.amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} from {payment.from}
            </p>
            <p className="text-xs text-gray-500">
              Ref: {payment.reference}
            </p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}


