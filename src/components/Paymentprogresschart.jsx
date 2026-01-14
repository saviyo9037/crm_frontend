// import React, { useEffect, useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getallpaymentstatus } from "../services/paymentstatusRouter";
// import Spinner from "./Spinner";
// import { motion } from "framer-motion";
// import { HiOutlineUser } from "react-icons/hi2";

// const COLORS = [
//   "from-green-400 to-green-600",
//   "from-blue-400 to-blue-600",
//   "from-yellow-400 to-yellow-600",
//   "from-pink-400 to-pink-600",
//   "from-indigo-400 to-indigo-600",
//   "from-purple-400 to-purple-600",
// ];

// export  const Paymentprogresschart = () => {
//   const [paymentProgressData, setPaymentProgressData] = useState([]);
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["paymentStatus"],
//     queryFn: getallpaymentstatus,
//     refetchOnWindowFocus: false, // Disable refetch on window focus for static data
//     retry: 1,
//   });

//   useEffect(() => {
//     if (Array.isArray(data?.data)) {
//       const filtered = data.data.filter(
//         (payment) => payment.totalPaid > 0 && payment.totalAmount > 0
//       );

//       const mapped = filtered.map((payment, index) => {
//         const percent = Math.min(
//           ((payment.totalPaid / payment.totalAmount) * 100).toFixed(1),
//           100
//         );
//         const nextPaymentDate = payment.nextPaymentDate
//           ? new Date(payment.nextPaymentDate)
//           : null;

//         return {
//           name: payment.customer?.name || `Payment #${index + 1}`,
//           percent: parseFloat(percent),
//           payment_paid: payment.totalPaid,
//           total_payment: payment.totalAmount,
//           color: COLORS[index % COLORS.length],
//           nextPaymentDate: payment.nextPaymentDate
//             ? new Date(payment.nextPaymentDate).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//               })
//             : "N/A",
//         };
//       });

//       setPaymentProgressData(mapped);
//     }
//   }, [data]);

//   if (isLoading) return <Spinner />;
//   if (error)
//     return (
//       <p className="text-center text-red-500 flex items-center justify-center">
//         <span className="mr-2">⚠️</span> Error: {error.message}
//       </p>
//     );
//   if (paymentProgressData.length === 0)
//     return (
//       <p className="text-center text-gray-500">No payment records available</p>
//     );

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
//         Payment Progress Overview
//       </h2>
//       <ul className="space-y-6 max-h-[500px] overflow-y-auto">
//         {paymentProgressData.map((entry, index) => (
//           <motion.li
//             key={index}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//             className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
//             role="listitem"
//           >
//             {/* Top row with name + amount */}
//             <div className="flex items-center justify-between mb-2">
//               <div className="flex items-center gap-2 text-gray-700 font-medium">
//                 <HiOutlineUser className="text-gray-400" aria-hidden="true" />
//                 <span>{entry.name}</span>
//               </div>
//               <div className="text-sm font-medium text-gray-600">
//                 ₹{entry.payment_paid.toLocaleString()} / ₹
//                 {entry.total_payment.toLocaleString()}
//               </div>
//             </div>
//             {/* Next Payment Date */}
//             <div className="text-sm text-gray-500 mb-2">
//               Next Payment: {entry.nextPaymentDate}
//             </div>
//             {/* Progress bar */}
//             <div
//               className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative"
//               role="progressbar"
//               aria-valuenow={entry.percent}
//               aria-valuemin="0"
//               aria-valuemax="100"
//               aria-label={`Payment progress for ${entry.name}: ${entry.percent}%`}
//             >
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${entry.percent}%` }}
//                 transition={{ duration: 1.2, ease: "easeInOut" }}
//                 className={`h-full bg-gradient-to-r ${entry.color} rounded-full`}
//               />
//               <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">
//                 {entry.percent}%
//               </span>
//             </div>
//           </motion.li>
//         ))}
//       </ul>
//     </div>
//   );
// };


import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getallpaymentstatus } from "../services/paymentstatusRouter";
import Spinner from "./Spinner";
import { motion } from "framer-motion";
import { HiOutlineUser } from "react-icons/hi2";

// ----------------- UI Colors -----------------
const COLORS = [
  "from-green-400 to-green-600",
  "from-blue-400 to-blue-600",
  "from-yellow-400 to-yellow-600",
  "from-pink-400 to-pink-600",
  "from-indigo-400 to-indigo-600",
  "from-purple-400 to-purple-600",
];

// Format dates safely
const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return isNaN(d.getTime())
    ? "N/A"
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
};

export const Paymentprogresschart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["paymentStatus"],
    queryFn: getallpaymentstatus,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const paymentProgressData = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((p) => p.totalPaid > 0 && p.totalAmount > 0)
      .map((p, i) => {
        const percent = Math.min(
          Number(((p.totalPaid / p.totalAmount) * 100).toFixed(1)),
          100
        );

        return {
          name: p.customer?.name || `Payment #${i + 1}`,
          percent,
          paid: p.totalPaid,
          total: p.totalAmount,
          nextPayment: formatDate(p.nextPaymentDate),
          color: COLORS[i % COLORS.length],
        };
      });
  }, [data]);

  // UI States
  if (isLoading) return <Spinner />;
  if (error)
    return (
      <p className="text-center text-red-500">
        ⚠️ Error loading payments
      </p>
    );
  if (paymentProgressData.length === 0)
    return (
      <p className="text-center text-gray-500">No payment records available</p>
    );

  // Render
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
        Payment Progress Overview
      </h2>

      <ul className="space-y-6 max-h-[500px] overflow-y-auto">
        {paymentProgressData.map((entry, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <HiOutlineUser className="text-gray-400" />
                <span>{entry.name}</span>
              </div>

              <div className="text-sm font-medium text-gray-600">
                ₹{entry.paid.toLocaleString()} / ₹{entry.total.toLocaleString()}
              </div>
            </div>

            {/* Next Payment */}
            <div className="text-sm text-gray-500 mb-2">
              Next Payment: {entry.nextPayment}
            </div>

            {/* Progress Bar */}
            <div
              className="w-full bg-gray-200 rounded-full h-4 overflow-hidden relative"
              aria-valuenow={entry.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${entry.percent}%` }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
                className={`h-full bg-gradient-to-r ${entry.color} rounded-full`}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white drop-shadow">
                {entry.percent}%
              </span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
