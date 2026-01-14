import React, { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { updatePayment } from "../../services/paymentstatusRouter";

const EditPaymentModal = ({ editPayment, onClose, onUpdated }) => {
  const [amount, setAmount] = useState(editPayment.paidAmount);
  const [date, setDate] = useState(
    editPayment.transactionDate?.split("T")[0] || ""
  );
  const [paymentMode, setPaymentMode] = useState(editPayment.paymentMode);
  const nextPaymentDate = useMemo(() => {
    if (!date) return null;
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);
    return d;
  }, [date]);

  const { mutate: updatePaymentFn, isPending } = useMutation({
    mutationFn: updatePayment,
    onSuccess: () => {
      alert("✅ Payment updated successfully!");
      onUpdated();
      onClose();
    },
    onError: (err) => console.error("❌ Update Error:", err),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      newData: {
        paidAmount: Number(amount),
        transactionDate: new Date(date).toISOString(),
        paymentMode,
        nextPaymentDate: nextPaymentDate?.toISOString(),
      },
    };
    updatePaymentFn({ transactId: editPayment._id, ...payload });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] relative">
        <h2 className="text-lg font-bold text-blue-600 mb-4">
          ✏️ Edit Transaction
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (₹)"
            className="p-2 border rounded-lg"
            min="1"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded-lg"
            required
          />

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="p-3 border rounded-xl"
          required
        >
          <option value="">Select Payment Mode</option>
          <option value="upi">UPI</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>

          {nextPaymentDate && (
            <p className="text-sm text-gray-600">
              Next Payment Date:{" "}
              <span className="font-semibold">
                {nextPaymentDate.toLocaleDateString()}
              </span>
            </p>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPaymentModal;
