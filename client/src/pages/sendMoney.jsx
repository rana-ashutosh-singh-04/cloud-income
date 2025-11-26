import { useState } from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/card'
import { api } from '../lib/api'

export default function SendMoney() {
  const [vpa, setVpa] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('') // clear previous status
    try {
      const { data } = await api.post('/txn/send', {
        vpa,
        amount: Number(amount),
        note,
      })
      setStatus(`✅ Success! Reference: ${data.reference}`)
      setVpa('')
      setAmount('')
      setNote('')
    } catch (err) {
      const msg = err?.response?.data?.message || '❌ Transaction failed'
      setStatus(msg)
    }
  }

  return (
    <div>
      <Navbar />
      <main className="max-w-md mx-auto p-4 grid gap-4">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-center">Send Money (Mock UPI)</h2>
          <form onSubmit={submit} className="grid gap-3">
            <input
              type="text"
              value={vpa}
              onChange={(e) => setVpa(e.target.value)}
              placeholder="Receiver UPI ID (e.g. user@bank)"
              className="bg-soft rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (₹)"
              min="1"
              className="bg-soft rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)"
              className="bg-soft rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-black rounded-xl py-2 hover:bg-primary/90 transition"
            >
              Pay Now
            </button>
          </form>
          {status && (
            <div
              className={`mt-4 text-sm text-center ${
                status.includes('Success') ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {status}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
