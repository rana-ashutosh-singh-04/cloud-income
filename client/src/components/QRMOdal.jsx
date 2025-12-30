import { useState } from 'react'


export default function QRModal({ open, onClose }) {
if (!open) return null
// NOTE: For demo, we render a placeholder QR. Replace with real QR lib if needed.
return (
<div className="fixed inset-0 bg-black/30 flex items-center justify-center">
<div className="bg-white rounded-2xl p-6 w-[360px]">
<h3 className="text-lg font-semibold mb-2">Receive via QR</h3>
<div className="bg-gray-100 p-6 rounded-xl grid place-items-center mb-4">
<div className="w-40 h-40 bg-slate-300 rounded" />
</div>
<button onClick={onClose} className="w-full bg-purple-700 text-white py-2 rounded-xl hover:bg-purple-800 transition">Close</button>
</div>
</div>
)
}