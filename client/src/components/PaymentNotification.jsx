import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function PaymentNotification({ payment, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (payment) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); 
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [payment, onClose]);

  if (!payment || !visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-[#ffffff] rounded-[16px] shadow-[0_2px_16px_rgba(58,48,42,0.06)] border border-[rgba(216,208,200,0.7)] p-6 max-w-sm">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-[#c2652a]/10 rounded-full">
            <CheckCircle className="w-6 h-6 text-[#c2652a]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#2a1f17] mb-1">Payment Received!</h3>
            <p className="text-sm text-[#605850] mb-2">
              You received ₹{payment.amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} from {payment.from}
            </p>
            <p className="text-xs text-[#8c7e72]">
              Ref: {payment.reference}
            </p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-[#8c7e72] hover:text-[#605850] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
