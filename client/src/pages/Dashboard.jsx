import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TransactionItem from "../components/TransactionItem";
import QRModal from "../components/QRMOdal";
import Card from "../components/card";
import MoneyTile from "../components/MoneyTitle";
import { api } from "../lib/api";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [txns, setTxns] = useState([]);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: me }, { data: list }] = await Promise.all([
          api.get("/auth/me"),
          api.get("/txn/recent"),
        ]);
        setProfile(me.user);
        setTxns(list.transactions);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8 grid gap-6">
        {/* Money Tiles */}
        <div className="grid md:grid-cols-3 gap-4">
          <MoneyTile title="Wallet Balance" value={profile?.balance || 0} />
          <MoneyTile title="Rewards" value={profile?.rewards || 0} />
          <MoneyTile title="Gold (gm)" value={profile?.gold || 0} />
        </div>

        {/* Quick Actions + Transactions */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* QUICK ACTIONS */}
          <Card className="shadow-md rounded-xl">
            <h3 className="font-semibold mb-4 text-lg text-gray-800">
              Quick Actions
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {/* SEND */}
              <button className="bg-purple-100 text-purple-700 font-medium rounded-xl py-3 hover:bg-purple-200 transition">
                Send
              </button>

              {/* RECEIVE */}
              <button
                className="bg-purple-100 text-purple-700 font-medium rounded-xl py-3 hover:bg-purple-200 transition"
                onClick={() => setQrOpen(true)}
              >
                Receive
              </button>

              {/* SCAN */}
              <button className="bg-purple-100 text-purple-700 font-medium rounded-xl py-3 hover:bg-purple-200 transition">
                Scan
              </button>
            </div>
          </Card>

          {/* TRANSACTIONS */}
          <Card className="md:col-span-2 shadow-md rounded-xl">
            <h3 className="font-semibold mb-4 text-lg text-gray-800">
              Recent Transactions
            </h3>

            <div className="space-y-3">
              {txns.length > 0 ? (
                txns.map((txn) => (
                  <TransactionItem key={txn._id} txn={txn} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">No recent transactions</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </main>

      <QRModal open={qrOpen} onClose={() => setQrOpen(false)} />
    </div>
  );
}
