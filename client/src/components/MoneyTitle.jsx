export default function MoneyTile({ title, value, onClick }) {
return (
<button onClick={onClick} className="bg-white rounded-2xl p-4 shadow-card text-left w-full hover:scale-[1.01] transition">
<div className="text-sm text-slate-500">{title}</div>
<div className="text-2xl font-semibold">₹{Number(value).toLocaleString('en-IN')}</div>
</button>
)
}