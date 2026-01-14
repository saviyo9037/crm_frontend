// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getProductSetting } from "../../services/settingservices/productSettingRouter";
// import { getpaymentDetailsed } from "../../services/paymentstatusRouter";

// // ✅ Helper to format currency into Cr, L, K
// const formatCurrency = (value) => {
//   if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
//   if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
//   if (value >= 1000) return `${(value / 1000).toFixed(1)} K`;
//   return value?.toFixed(0) || 0;
// };

// // ✅ Reusable progress bar
// function ProgressChartBar({ value, max }) {
//   const percentage = max > 0 ? (value / max) * 100 : 0;
//   const color =
//     percentage === 100 ? "bg-green-600" : percentage > 0 ? "bg-blue-500" : "bg-gray-300";

//   return (
//     <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//       <div
//         className={`${color} h-3 rounded-full transition-all duration-500`}
//         style={{ width: `${percentage}%` }}
//       ></div>
//     </div>
//   );
// }

// export default function ProductProgressChart({ startDate, endDate }) {
//   // 🧩 Fetch Products
//   const {
//     data: productData,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["products"],
//     queryFn: getProductSetting,
//   });

//   // 🧩 Fetch Payments
//   const { data: paymentData } = useQuery({
//     queryKey: ["payments", startDate, endDate],
//     queryFn: () => getpaymentDetailsed({ startDate, endDate }),
//   });

//   if (isLoading) return <div className="p-4 text-gray-600">Loading product data...</div>;
//   if (isError) return <div className="p-4 text-red-600">Error fetching product data.</div>;

//   // ✅ Step 1: Extract data safely
//   const products = productData?.Products || [];
//   const payments = paymentData?.allPayment || [];

//   // ✅ Step 2: Group payments by product
//   const paymentMap = payments.reduce((acc, p) => {
//     const pid = p.product;
//     if (!acc[pid]) acc[pid] = { totalAmount: 0, totalPaid: 0 };
//     acc[pid].totalAmount += p.totalAmount || 0;
//     acc[pid].totalPaid += p.totalPaid || 0;
//     return acc;
//   }, {});

//   // ✅ Step 3: Merge product and payment data
//   const mergedProducts = products.map((prod) => {
//     const payment = paymentMap[prod._id] || { totalAmount: 0, totalPaid: 0 };
//     return {
//       ...prod,
//       amount: payment.totalAmount,
//       paidAmount: payment.totalPaid,
//     };
//   });

//   // ✅ Step 4: Calculate totals
//   const overallTotal = mergedProducts.reduce((sum, i) => sum + (i.amount || 0), 0);
//   const overallPaid = mergedProducts.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
//   const overallPercent = overallTotal > 0 ? Math.round((overallPaid / overallTotal) * 100) : 0;

//   // ✅ Step 5: Render
//   return (
//     <div className="p-6">
//       <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//           <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//             Product Payment Progress
//           </h2>
//           <span
//             className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
//               overallPercent === 100
//                 ? "bg-green-100 text-green-700"
//                 : "bg-blue-100 text-blue-700"
//             }`}
//           >
//             Overall Completion: {overallPercent}%
//           </span>
//         </div>

//         {/* Summary */}
//         <div className="mb-8 bg-indigo-50 border border-indigo-200 p-4 rounded-xl">
//           <div className="flex justify-between items-center mb-2">
//             <span className="text-base font-semibold text-indigo-700">
//               Total Payments Collected
//             </span>
//             <span className="text-lg font-bold text-indigo-800">{overallPercent}%</span>
//           </div>
//           <ProgressChartBar value={overallPaid} max={overallTotal} />
//           <p className="text-xs text-right text-gray-600 mt-2">
//             ₹{formatCurrency(overallPaid)} collected / ₹{formatCurrency(overallTotal)} total
//           </p>
//         </div>

//         {/* Product-wise list */}
//         <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
//           <h3 className="text-gray-700 font-semibold border-b pb-2 text-sm uppercase tracking-wide">
//             Product-wise Breakdown
//           </h3>

//           {mergedProducts.length === 0 && (
//             <p className="text-gray-500 text-sm italic">
//               No product payment data available.
//             </p>
//           )}

//           {mergedProducts.map((item) => {
//             const paidPercent =
//               item.amount > 0 ? Math.round((item.paidAmount / item.amount) * 100) : 0;
//             const remaining = item.amount - item.paidAmount;

//             const statusColor =
//               paidPercent === 100
//                 ? "text-green-600"
//                 : paidPercent > 0
//                 ? "text-blue-600"
//                 : "text-gray-500";

//             return (
//               <div
//                 key={item._id}
//                 className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"
//               >
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-800">{item.title}</p>
//                   <p className={`text-xs font-semibold ${statusColor}`}>
//                     {paidPercent === 100
//                       ? "Paid in Full"
//                       : paidPercent > 0
//                       ? "Partial Payment"
//                       : "Pending"}
//                   </p>
//                 </div>

//                 <div className="flex-1 w-full">
//                   <ProgressChartBar value={item.paidAmount} max={item.amount} />
//                 </div>

//                 <div className="text-right">
//                   <p className="font-semibold text-gray-700 text-sm">{paidPercent}%</p>
//                   <p className="text-xs text-gray-500">
//                     ₹{formatCurrency(remaining)} due
//                   </p>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductSetting } from "../../services/settingservices/productSettingRouter";
import { getpaymentDetailsed } from "../../services/paymentstatusRouter";

// ✅ Helper to format currency into Cr, L, K
const formatCurrency = (value) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)} K`;
  return value?.toFixed(0) || 0;
};

// ✅ Reusable progress bar
function ProgressChartBar({ value, max }) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const color =
    percentage === 100
      ? "bg-green-500"
      : percentage > 0
      ? "bg-gradient-to-r from-blue-500 to-cyan-400"
      : "bg-gray-300";

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className={`${color} h-3 rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}

export default function ProductProgressChart({ startDate, endDate }) {
  // 🧩 Fetch Products
  const {
    data: productData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProductSetting,
  });

  // 🧩 Fetch Payments
  const { data: paymentData } = useQuery({
    queryKey: ["payments", startDate, endDate],
    queryFn: () => getpaymentDetailsed({ startDate, endDate }),
  });

  if (isLoading)
    return (
      <div className="p-4 text-gray-500 text-center font-medium">
        Loading product data...
      </div>
    );
  if (isError)
    return (
      <div className="p-4 text-red-500 text-center font-medium">
        Error fetching product data.
      </div>
    );

  // ✅ Extract and group
  const products = productData?.Products || [];
  const payments = paymentData?.allPayment || [];

  const paymentMap = payments.reduce((acc, p) => {
    const pid = p.product;
    if (!acc[pid]) acc[pid] = { totalAmount: 0, totalPaid: 0 };
    acc[pid].totalAmount += p.totalAmount || 0;
    acc[pid].totalPaid += p.totalPaid || 0;
    return acc;
  }, {});

  const mergedProducts = products.map((prod) => {
    const payment = paymentMap[prod._id] || { totalAmount: 0, totalPaid: 0 };
    return {
      ...prod,
      amount: payment.totalAmount,
      paidAmount: payment.totalPaid,
    };
  });

  const overallTotal = mergedProducts.reduce((sum, i) => sum + (i.amount || 0), 0);
  const overallPaid = mergedProducts.reduce((sum, i) => sum + (i.paidAmount || 0), 0);
  const overallPercent = overallTotal > 0 ? Math.round((overallPaid / overallTotal) * 100) : 0;

  // ✅ Render
  return (
    <div className="p-5 sm:p-6">
      <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
            📦 Product Payment Progress
          </h2>
          <span
            className={`mt-2 sm:mt-0 px-4 py-1.5 text-sm font-semibold rounded-full ${
              overallPercent === 100
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            Overall Completion: {overallPercent}%
          </span>
        </div>

        {/* Summary Bar */}
        <div className="px-5 sm:px-6 py-4 bg-indigo-50 border-b border-indigo-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-base sm:text-lg font-semibold text-indigo-700">
              Total Payments Collected
            </span>
            <span className="text-base sm:text-lg font-bold text-indigo-800">
              {overallPercent}%
            </span>
          </div>
          <ProgressChartBar value={overallPaid} max={overallTotal} />
          <p className="text-xs text-right text-gray-600 mt-2">
            ₹{formatCurrency(overallPaid)} collected / ₹{formatCurrency(overallTotal)} total
          </p>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wide border-b pb-2">
            Product-wise Breakdown
          </h3>

          {mergedProducts.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              No product payment data available.
            </p>
          ) : (
            mergedProducts.map((item) => {
              const paidPercent =
                item.amount > 0 ? Math.round((item.paidAmount / item.amount) * 100) : 0;
              const remaining = item.amount - item.paidAmount;
              const statusColor =
                paidPercent === 100
                  ? "text-green-600"
                  : paidPercent > 0
                  ? "text-blue-600"
                  : "text-gray-500";

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all p-3 rounded-xl border border-gray-100"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className={`text-xs font-semibold ${statusColor}`}>
                      {paidPercent === 100
                        ? "Paid in Full"
                        : paidPercent > 0
                        ? "Partial Payment"
                        : "Pending"}
                    </p>
                  </div>

                  <div className="flex-1 w-full sm:max-w-[250px]">
                    <ProgressChartBar value={item.paidAmount} max={item.amount} />
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-700 text-sm">{paidPercent}%</p>
                    <p className="text-xs text-gray-500">
                      ₹{formatCurrency(remaining)} due
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 text-gray-500 text-xs sm:text-sm py-2 text-center border-t border-gray-200">
          Updated with latest product payment records
        </div>
      </div>
    </div>
  );
}
