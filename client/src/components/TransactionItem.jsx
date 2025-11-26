export default function TransactionItem({ txn }) {
const sign = txn.type === 'DEBIT' ? '-' : '+'
return (
<div className="flex items-center justify-between py-3 border-b last:border-b-0">
<div>
<div className="font-medium">{txn.counterpartyName}</div>
<div className="text-xs text-slate-500">{new Date(txn.createdAt).toLocaleString('en-IN')}</div>
</div>
<div className={`font-semibold ${txn.type==='DEBIT' ? 'text-rose-600' : 'text-emerald-600'}`}>
{sign}₹{txn.amount}
</div>
</div>
)
}
