import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getallpaymentstatus,
  getTransactions,
} from "../../services/paymentstatusRouter";
import {
  FaRupeeSign,
  FaCalendarAlt,
  FaUser,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimes,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount || 0);

const PaymentDetails = ({ startDate, endDate }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["allPaymentStatus", startDate, endDate],
    queryFn: () => getallpaymentstatus({ startDate, endDate }),
  });

  const payments = data?.data ?? [];
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const handleCustomerClick = async (customer) => {
    setSelectedCustomer(customer);
    setLoadingTransactions(true);

    try {
      const res = await getTransactions(customer._id, { startDate, endDate });
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setTransactions([]);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60 bg-gray-50 rounded-2xl">
        <div className="animate-pulse flex flex-col items-center">
          <FaRupeeSign className="text-4xl text-gray-400 mb-3" />
          <p className="text-lg font-medium text-gray-500">
            Loading Payments...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-60 bg-red-50 rounded-2xl border border-red-200">
        <div className="text-center">
          <FaExclamationCircle className="text-4xl text-red-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-red-600">
            Error Loading Payments
          </p>
          <p className="text-sm text-gray-600 mt-1">Please try again later.</p>
        </div>
      </div>
    );

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mt-8 border border-gray-200/80">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Customer Payment Overview
      </h1>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                <FaUser className="mr-2" /> Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaCalendarAlt className="inline mr-2" /> Joining Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Paid
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length > 0 ? (
              payments.map((payment) => {
                const customer = payment.customer || {};
                const dueAmount =
                  (payment.totalAmount || 0) - (payment.totalPaid || 0);

                let statusLabel, statusColor, StatusIcon;
                if ((payment.totalPaid || 0) >= (payment.totalAmount || 0)) {
                  statusLabel = "Paid";
                  statusColor = "bg-green-100 text-green-800";
                  StatusIcon = <FaCheckCircle />;
                } else {
                  statusLabel = "Pending";
                  statusColor = "bg-red-100 text-red-800";
                  StatusIcon = <FaExclamationCircle />;
                }

                return (
                  <tr
                    key={payment._id}
                    className="hover:bg-gray-50/50 transition-colors duration-150"
                  >
                    <td
                      className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      {customer.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.createdAt
                        ? new Date(customer.createdAt).toLocaleDateString(
                            "en-GB"
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 text-right">
                      {formatCurrency(payment.totalAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-green-600 font-semibold text-right">
                      {formatCurrency(payment.totalPaid)}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold text-right ${
                        dueAmount > 0 ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {formatCurrency(dueAmount)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                      >
                        <span className="mr-1.5">{StatusIcon}</span>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10">
                  <FaExclamationCircle className="text-3xl text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    No payment data available.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Transaction Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              onClick={closeModal}
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Transactions for {selectedCustomer.name}
            </h2>

            {loadingTransactions ? (
              <p className="text-gray-500">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Amount</th>
                      <th className="p-3 text-left">Mode</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, index) => (
                      <tr key={tx._id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">
                          {new Date(tx.transactionDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="p-3 font-semibold text-green-600">
                          {formatCurrency(tx.paidAmount)}
                        </td>
                        <td className="p-3 capitalize flex items-center gap-2">
                          {tx.paymentMode === "cash" ? (
                            <FaMoneyBillWave className="text-green-500" />
                          ) : (
                            <FaCreditCard className="text-blue-500" />
                          )}
                          {tx.paymentMode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No transactions found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
