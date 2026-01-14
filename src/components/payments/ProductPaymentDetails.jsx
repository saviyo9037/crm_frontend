// import React, { useMemo, useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { getProductPaymentDetails } from "../../services/paymentstatusRouter";
// import PaymentDetails from "./PaymentDetails";
// import PaymentAddModel from "./PaymentAddModel";
// import AllTransactions from "./AllTransactions";

// const formatCurrency = (amount) =>
//   new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency: "INR",
//     minimumFractionDigits: 2,
//   }).format(amount || 0);

// const ProductPaymentDetails = ({ startDate, endDate }) => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["productPaymentDetails", startDate, endDate],
//     queryFn: () => getProductPaymentDetails({ startDate, endDate }),
//   });

//   const [expandedProduct, setExpandedProduct] = useState(null);

//   const rawPayments = data?.data ?? data?.getProductPayment ?? [];

//   const { productSummary, productCustomers, grandTotals } = useMemo(() => {
//     const summary = {};
//     const processedPairs = new Set();
//     const customersByProduct = {};
//     const globalPaidCustomers = new Set();
//     let totalPayment = 0;
//     let totalPaid = 0;

//     (rawPayments || []).forEach((tx) => {
//       const payment = tx?.payment || tx;
//       const product = payment?.product;
//       const customer = tx?.customer || payment?.customer;
//       if (!product || !customer) return;

//       const productId = product?._id ?? "unknown";
//       const customerId = customer?._id ?? "unknown";
//       const pairKey = `${productId}_${customerId}`;
//       if (processedPairs.has(pairKey)) return;
//       processedPairs.add(pairKey);

//       const productTitle = product?.title ?? product?.name ?? "Unknown Product";
//       const total_amount = Number(payment.totalAmount ?? 0);
//       const total_paid = Number(payment.totalPaid ?? 0);

//       if (!summary[productId]) {
//         summary[productId] = {
//           productId,
//           title: productTitle,
//           total_payment: 0,
//           payment_paid: 0,
//           paidCustomerIds: new Set(),
//         };
//         customersByProduct[productId] = [];
//       }

//       summary[productId].total_payment += total_amount;
//       summary[productId].payment_paid += total_paid;
//       if (total_paid > 0) {
//         summary[productId].paidCustomerIds.add(customerId);
//         globalPaidCustomers.add(customerId); // ✅ count globally
//       }

//       customersByProduct[productId].push({
//         customerName: customer?.name ?? "Unknown",
//         totalAmount: total_amount,
//         totalPaid: total_paid,
//         due: total_amount - total_paid,
//       });

//       totalPayment += total_amount;
//       totalPaid += total_paid;
//     });

//     const finalSummary = Object.values(summary).map((p) => ({
//       ...p,
//       customersPaid: p.paidCustomerIds.size,
//     }));

//     return {
//       productSummary: finalSummary,
//       productCustomers: customersByProduct,
//       grandTotals: {
//         totalPayment,
//         totalPaid,
//         totalCustomersPaid: globalPaidCustomers.size, // ✅ added
//       },
//     };
//   }, [rawPayments]);

//   const toggleExpand = (productId) => {
//     setExpandedProduct((prev) => (prev === productId ? null : productId));
//   };

//   if (isLoading)
//     return (
//       <div className="flex justify-center items-center h-60 bg-gray-50 rounded-2xl">
//         <p className="text-lg font-medium text-gray-500 animate-pulse">
//           Loading Product Payments...
//         </p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex justify-center items-center h-60 bg-red-50 rounded-2xl border border-red-200">
//         <div className="text-center">
//           <p className="text-lg font-semibold text-red-600">
//             Error Loading Details
//           </p>
//           <p className="text-sm text-gray-600 mt-1">
//             Could not fetch product payment data.
//           </p>
//         </div>
//       </div>
//     );

//   if (!productSummary?.length) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-sm text-gray-500">
//           No product payment records available.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white shadow-xl rounded-2xl p-6 mt-8 border border-gray-200/80">
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">
//             Product Payment Summary
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Click a product name to view its customer details.
//           </p>
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded-lg border border-gray-200">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Product
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Amount
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Paid
//               </th>
//               <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Due Amount
//               </th>
//               <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Customers Paid
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {productSummary.map((p) => {
//               const due = p.total_payment - p.payment_paid;
//               const dueColor = due <= 0 ? "text-green-600" : "text-red-600";

//               return (
//                 <React.Fragment key={p.productId}>
//                   <tr
//                     className="hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer"
//                     onClick={() => toggleExpand(p.productId)}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600 underline">
//                       {p.title}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
//                       {formatCurrency(p.total_payment)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold text-right">
//                       {formatCurrency(p.payment_paid)}
//                     </td>
//                     <td
//                       className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${dueColor}`}
//                     >
//                       {formatCurrency(due)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
//                       {p.customersPaid}
//                     </td>
//                   </tr>

//                   {expandedProduct === p.productId && (
//                     <tr>
//                       <td colSpan={5} className="bg-gray-50">
//                         <div className="p-4">
//                           <h3 className="text-sm font-semibold text-gray-700 mb-2">
//                             Customers for {p.title}:
//                           </h3>
//                           <table className="min-w-full text-sm border">
//                             <thead className="bg-gray-100">
//                               <tr>
//                                 <th className="px-4 py-2 border text-left">
//                                   Customer Name
//                                 </th>
//                                 <th className="px-4 py-2 border text-right">
//                                   Total
//                                 </th>
//                                 <th className="px-4 py-2 border text-right">
//                                   Paid
//                                 </th>
//                                 <th className="px-4 py-2 border text-right">
//                                   Due
//                                 </th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {productCustomers[p.productId]?.map((c, i) => (
//                                 <tr key={i} className="hover:bg-white/80">
//                                   <td className="px-4 py-2 border">
//                                     {c.customerName}
//                                   </td>
//                                   <td className="px-4 py-2 border text-right">
//                                     {formatCurrency(c.totalAmount)}
//                                   </td>
//                                   <td className="px-4 py-2 border text-right text-green-600">
//                                     {formatCurrency(c.totalPaid)}
//                                   </td>
//                                   <td
//                                     className={`px-4 py-2 border text-right ${
//                                       c.due > 0
//                                         ? "text-red-600"
//                                         : "text-green-600"
//                                     }`}
//                                   >
//                                     {formatCurrency(c.due)}
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>

//           <tfoot className="bg-gray-100">
//             <tr className="font-semibold text-gray-700">
//               <td className="px-6 py-4 text-left text-sm">Grand Total</td>
//               <td className="px-6 py-4 text-right text-sm">
//                 {formatCurrency(grandTotals.totalPayment)}
//               </td>
//               <td className="px-6 py-4 text-right text-sm">
//                 {formatCurrency(grandTotals.totalPaid)}
//               </td>
//               <td
//                 className={`px-6 py-4 text-right text-sm ${
//                   grandTotals.totalPayment - grandTotals.totalPaid > 0
//                     ? "text-red-600"
//                     : "text-green-600"
//                 }`}
//               >
//                 {formatCurrency(
//                   grandTotals.totalPayment - grandTotals.totalPaid
//                 )}
//               </td>
//               <td className="px-6 py-4 text-center text-sm text-blue-600">
//                 {grandTotals.totalCustomersPaid}
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductPaymentDetails;


import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getProductPaymentDetails } from "../../services/paymentstatusRouter";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount || 0);

const ProductPaymentDetails = ({ startDate, endDate }) => {
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.auth.user?.id);

  const { data, isLoading, error } = useQuery({
    queryKey: ["productPaymentDetails", startDate, endDate, role, userId],
    queryFn: () => getProductPaymentDetails({ 
        startDate, 
        endDate,
        agentId: role === 'Agent' ? userId : undefined 
    }),
  });

  const [expandedProduct, setExpandedProduct] = useState(null);

  const rawPayments = data?.data ?? data?.getProductPayment ?? [];

  // ----------------------------------------------------------------
  // 🔥 Ultra-Optimized Processing with Maps + Single-Pass Reduction
  // ----------------------------------------------------------------
  const { productSummary, productCustomers, grandTotals } = useMemo(() => {
    const productMap = new Map();
    const customersByProduct = new Map();
    const globalPaidCustomers = new Set();

    let totalPayment = 0;
    let totalPaid = 0;

    rawPayments.forEach((tx) => {
      const payment = tx.payment || tx;
      const product = payment.product;
      const customer = tx.customer || payment.customer;

      if (!product || !customer) return;

      const productId = product._id;
      const customerId = customer._id;
      const title = product.title || product.name || "Unknown Product";

      const total_amount = Number(payment.totalAmount || 0);
      const total_paid = Number(payment.totalPaid || 0);

      // Initialize product entry
      if (!productMap.has(productId)) {
        productMap.set(productId, {
          productId,
          title,
          total_payment: 0,
          payment_paid: 0,
          paidCustomerIds: new Set(),
        });
        customersByProduct.set(productId, []);
      }

      const p = productMap.get(productId);
      p.total_payment += total_amount;
      p.payment_paid += total_paid;

      if (total_paid > 0) {
        p.paidCustomerIds.add(customerId);
        globalPaidCustomers.add(customerId);
      }

      customersByProduct.get(productId).push({
        customerName: customer.name || "Unknown",
        totalAmount: total_amount,
        totalPaid: total_paid,
        due: total_amount - total_paid,
      });

      totalPayment += total_amount;
      totalPaid += total_paid;
    });

    // Convert Maps → Arrays
    const summaryArr = Array.from(productMap.values()).map((p) => ({
      ...p,
      customersPaid: p.paidCustomerIds.size,
    }));

    return {
      productSummary: summaryArr,
      productCustomers: Object.fromEntries(customersByProduct),
      grandTotals: {
        totalPayment,
        totalPaid,
        totalCustomersPaid: globalPaidCustomers.size,
      },
    };
  }, [rawPayments]);

  const toggleExpand = (id) =>
    setExpandedProduct((prev) => (prev === id ? null : id));

  // ----------------------------------------------------------------
  // 🔥 UI States
  // ----------------------------------------------------------------
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-60 text-gray-500">
        Loading Product Payments…
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-60 text-red-600">
        Error loading product details.
      </div>
    );

  if (!productSummary.length)
    return (
      <div className="text-center py-10 text-gray-500">
        No product payment records available.
      </div>
    );

  // ----------------------------------------------------------------
  // 🔥 Render
  // ----------------------------------------------------------------
  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mt-8 border border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Product Payment Summary
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Click on a product to view its customer-wise breakdown.
      </p>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Product", "Total Amount", "Total Paid", "Due Amount", "Paid Customers"]
                .map((t, i) => (
                  <th
                    key={i}
                    className={`px-6 py-3 text-xs font-medium uppercase ${
                      i === 0 ? "text-left" : "text-right"
                    } text-gray-500`}
                  >
                    {t}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {productSummary.map((p) => {
              const due = p.total_payment - p.payment_paid;

              return (
                <React.Fragment key={p.productId}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(p.productId)}
                  >
                    <td className="px-6 py-4 text-blue-600 underline font-semibold">
                      {p.title}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {formatCurrency(p.total_payment)}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600 font-semibold">
                      {formatCurrency(p.payment_paid)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        due > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {formatCurrency(due)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      {p.customersPaid}
                    </td>
                  </tr>

                  {expandedProduct === p.productId && (
                    <tr>
                      <td colSpan={5} className="bg-gray-50 px-4 py-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Customers for {p.title}
                        </h3>

                        <table className="w-full text-sm border">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-2 border text-left">
                                Customer
                              </th>
                              <th className="px-4 py-2 border text-right">
                                Total
                              </th>
                              <th className="px-4 py-2 border text-right">
                                Paid
                              </th>
                              <th className="px-4 py-2 border text-right">
                                Due
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {productCustomers[p.productId].map((c, i) => (
                              <tr key={i} className="hover:bg-white">
                                <td className="px-4 py-2 border">
                                  {c.customerName}
                                </td>
                                <td className="px-4 py-2 border text-right">
                                  {formatCurrency(c.totalAmount)}
                                </td>
                                <td className="px-4 py-2 border text-green-600 text-right">
                                  {formatCurrency(c.totalPaid)}
                                </td>
                                <td
                                  className={`px-4 py-2 border text-right ${
                                    c.due > 0 ? "text-red-600" : "text-green-600"
                                  }`}
                                >
                                  {formatCurrency(c.due)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>

          <tfoot className="bg-gray-100">
            <tr className="font-semibold text-gray-700">
              <td className="px-6 py-4">Grand Total</td>
              <td className="px-6 py-4 text-right">
                {formatCurrency(grandTotals.totalPayment)}
              </td>
              <td className="px-6 py-4 text-right">
                {formatCurrency(grandTotals.totalPaid)}
              </td>
              <td
                className={`px-6 py-4 text-right ${
                  grandTotals.totalPayment - grandTotals.totalPaid > 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {formatCurrency(
                  grandTotals.totalPayment - grandTotals.totalPaid
                )}
              </td>
              <td className="px-6 py-4 text-right text-blue-600">
                {grandTotals.totalCustomersPaid}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ProductPaymentDetails;
