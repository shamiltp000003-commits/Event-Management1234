import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IoCardOutline,
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
} from "react-icons/io5";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    totalRefund: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/getAllBookings", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const bookings = res.data.data;

          let totalSpent = 0;
          let totalRefund = 0;

          const txns = bookings.map((b) => {
            if (b.status === "cancelled") {
              totalRefund += b.refundAmount || 0;

              return {
                id: b._id,
                type: "refund",
                amount: b.refundAmount || 0,
                date: b.cancelledAt || b.updatedAt,
                service: b.serviceName,
              };
            } else {
              totalSpent += b.totalPrice || 0;

              return {
                id: b._id,
                type: "payment",
                amount: b.totalPrice || 0,
                date: b.createdAt,
                service: b.serviceName,
              };
            }
          });

          setTransactions(txns);
          setSummary({ totalSpent, totalRefund });
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          My Transactions
        </h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-100 p-6 rounded-xl shadow">
            <h3 className="text-gray-700">Total Spent</h3>
            <p className="text-2xl font-bold text-green-700">
              ₹{summary.totalSpent.toLocaleString()}
            </p>
          </div>

          <div className="bg-blue-100 p-6 rounded-xl shadow">
            <h3 className="text-gray-700">Total Refund</h3>
            <p className="text-2xl font-bold text-blue-700">
              ₹{summary.totalRefund.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Transactions List */}
        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <IoCardOutline className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No transactions found</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center p-4 border-b last:border-none"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {txn.service || "Service Booking"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(txn.date)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {txn.type === "payment" ? (
                    <>
                      <IoArrowUpCircleOutline className="text-red-500 w-5 h-5" />
                      <span className="text-red-600 font-semibold">
                        - ₹{txn.amount.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <>
                      <IoArrowDownCircleOutline className="text-green-500 w-5 h-5" />
                      <span className="text-green-600 font-semibold">
                        + ₹{txn.amount.toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;