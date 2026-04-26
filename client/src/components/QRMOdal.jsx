import { useState } from 'react'


export default function QRModal({ open, onClose }) {
if (!open) return null
// NOTE: For demo, we render a placeholder QR. Replace with real QR lib if needed.
return (
<div className="fixed inset-0 bg-[#2a1f17]/40 flex items-center justify-center z-50">
<div className="bg-[#ffffff] rounded-[16px] p-8 w-[360px] shadow-[0_2px_16px_rgba(58,48,42,0.06)] border border-[rgba(216,208,200,0.7)]">
<h3 className="text-xl font-bold mb-6 text-[#2a1f17] text-center">Receive via QR</h3>
<div className="bg-[#f3ece0] p-6 rounded-[12px] flex items-center justify-center mb-6">
<div className="w-48 h-48 bg-[#ffffff] border border-[rgba(216,208,200,0.7)] rounded-[8px]" />
</div>
<button onClick={onClose} className="w-full bg-[#c2652a] text-white py-3 rounded-[8px] font-semibold hover:bg-[#a8541f] transition">Close</button>
</div>
</div>
)
}