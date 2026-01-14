// import React, { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { listconvertedcustomers } from "../../services/customersRouter";

// ChartJS.register(ArcElement, Tooltip, Legend);

// export default function PaymentDonutChart({ startDate, endDate }) {
//   // ✅ Fetch all converted customers (all pages)
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["convertedCustomers", startDate, endDate],
//     queryFn: async () => {
//       let allData = [];
//       let currentPage = 1;
//       let totalPages = 1;

//       while (currentPage <= totalPages) {
//         const response = await listconvertedcustomers({ page: currentPage, startDate, endDate });
//         allData = [...allData, ...(response.customers || [])];
//         totalPages = response.totalPages || 1;
//         currentPage += 1;
//       }

//       return {
//         customers: allData,
//         totalCustomers: allData.length,
//       };
//     },
//     staleTime: 5 * 60 * 1000,
//   });

//   const customers = data?.customers || [];

//   // ✅ Payment Status Count
//   const paymentStatusCount = useMemo(() => {
//     const counts = {};
//     customers.forEach((c) => {
//       const status = c.payment || "Unknown";
//       counts[status] = (counts[status] || 0) + 1;
//     });
//     return counts;
//   }, [customers]);

//   const totalCustomers = data?.totalCustomers || 0;

//   // ✅ Chart Data
//   const chartData = useMemo(() => ({
//     labels: Object.keys(paymentStatusCount),
//     datasets: [
//       {
//         data: Object.values(paymentStatusCount),
//         backgroundColor: [
//           "#2563EB", // Blue
//           "#F59E0B", // Amber
//           "#10B981", // Green
//           "#EF4444", // Red
//           "#8B5CF6", // Purple
//         ],
//         borderColor: "#fff",
//         borderWidth: 2,
//         hoverOffset: 15,
//       },
//     ],
//   }), [paymentStatusCount]);

//   // ✅ Chart Options
//   const options = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "35%", // donut size
//     plugins: {
//       legend: {
//         position: "bottom",
//         labels: {
//           color: "#374151",
//           font: { size: 14, family: "'Inter', sans-serif" },
//           usePointStyle: true,
//           pointStyle: "circle",
//           padding: 16,
//         },
//       },
//       tooltip: {
//         callbacks: {
//           label: (context) => {
//             const label = context.label || "";
//             const value = context.raw || 0;
//             const total = context.dataset.data.reduce((a, b) => a + b, 0);
//             const percent = ((value / total) * 100).toFixed(1);
//             return `${label}: ${value} (${percent}%)`;
//           },
//         },
//       },
//     },
//   }), []);

//   if (isLoading)
//     return <p className="text-center text-gray-500 text-sm sm:text-base">Loading chart...</p>;
//   if (error)
//     return <p className="text-center text-red-500 text-sm sm:text-base">Error: {error.message}</p>;

//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300">
//       {/* Header */}
//       <div className="flex flex-col items-center mb-6">
//         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
//           Payment Status Distribution
//         </h2>
//         <p className="text-gray-500 text-sm">
//           Total Customers:{" "}
//           <span className="font-semibold text-gray-700">{totalCustomers}</span>
//         </p>
//       </div>

//       {/* Chart + Status Summary */}
//       <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
//         {/* Chart Section */}
//         <div className="col-span-3 w-full h-[380px] sm:h-[420px] flex items-center justify-center">
//           {Object.keys(paymentStatusCount).length > 0 ? (
//             <Pie data={chartData} options={options} />
//           ) : (
//             <p className="text-gray-400 text-sm text-center">No payment data available</p>
//           )}
//         </div>

//         {/* Status Summary Boxes */}
//         <div className="col-span-2 flex flex-col gap-3">
//           {Object.entries(paymentStatusCount).map(([status, count], index) => {
//             const colors = ["#2563EB", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];
//             return (
//               <div
//                 key={status}
//                 className="flex justify-between items-center text-white font-medium px-4 py-3 rounded-lg shadow-sm transition-transform duration-200 hover:scale-[1.03]"
//                 style={{ backgroundColor: colors[index % colors.length] }}
//               >
//                 <span>{status}</span>
//                 <span>{count}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { listconvertedcustomers } from "../../services/customersRouter";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaCircle } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PaymentDonutChart({ startDate, endDate }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["convertedCustomers", startDate, endDate],
    queryFn: async () => {
      let allData = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await listconvertedcustomers({ page: currentPage, startDate, endDate });
        allData = [...allData, ...(response.customers || [])];
        totalPages = response.totalPages || 1;
        currentPage += 1;
      }

      return { customers: allData, totalCustomers: allData.length };
    },
    staleTime: 5 * 60 * 1000,
  });

  const customers = data?.customers || [];

  // ✅ Filter customers by date range
  const filteredCustomers = useMemo(() => {
    if (!startDate || !endDate) return customers;
    return customers.filter((customer) => {
      if (!customer.createdAt) return false;
      const customerDate = new Date(customer.createdAt);
      return customerDate >= startDate && customerDate <= endDate;
    });
  }, [customers, startDate, endDate]);

  // ✅ Payment Status Count
  const paymentStatusCount = useMemo(() => {
    const counts = {};
    filteredCustomers.forEach((c) => {
      const status = c.payment || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }, [filteredCustomers]);

  const totalCustomers = data?.totalCustomers || 0;

  // ✅ Chart Data
  const chartData = useMemo(
    () => ({
      labels: Object.keys(paymentStatusCount),
      datasets: [
        {
          data: Object.values(paymentStatusCount),
          backgroundColor: [
            "#2563EB", // Blue
            "#F59E0B", // Amber
            "#10B981", // Green
            "#EF4444", // Red
            "#8B5CF6", // Purple
          ],
          borderColor: "#fff",
          borderWidth: 3,
          hoverOffset: 20,
        },
      ],
    }),
    [paymentStatusCount]
  );

  // ✅ Chart Options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "55%", // modern balanced donut
      plugins: {
        legend: {
          display: false, // Hide default legend for custom summary
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percent = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percent}%)`;
            },
          },
        },
      },
    }),
    []
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[300px] text-gray-500">
        Loading chart...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[300px] text-red-500">
        Error loading chart
      </div>
    );
  const statusIcons = {
    paid: <FaCheckCircle className="text-green-300" />,
    "partially paid": <FaHourglassHalf className="text-yellow-300" />,
    pending: <FaTimesCircle className="text-red-300" />,
    Unknown: <FaCircle className="text-gray-300" />,
  };
  const colors = ["#2563EB", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6"];
  return (
    <div className="bg-gradient-to-br  from-white via-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white/60 backdrop-blur-sm flex flex-col items-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          💰 Payment Status Distribution
        </h2>
        <p className="text-gray-500 text-sm">
          Total Customers:{" "}
          <span className="font-semibold text-gray-800">{totalCustomers}</span>
        </p>
      </div>

      {/* Chart + Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 px-6 py-6">
        {/* Chart Section */}
        <div className="col-span-3 flex items-center justify-center h-[320px] sm:h-[380px] md:h-[400px]">
          {Object.keys(paymentStatusCount).length > 0 ? (
            <Pie data={chartData} options={options} />
          ) : (
            <p className="text-gray-400 text-sm">No payment data available</p>
          )}
        </div>

        {/* Status Summary */}
        <div className="col-span-2 flex flex-col gap-4">
          {Object.entries(paymentStatusCount).map(([status, count], index) => {
            const color = colors[index % colors.length];
            const icon =
              statusIcons[status.toLowerCase()] || (
                <FaCircle className="text-gray-300" />
              );

            return (
              <div
                key={status}
                className="flex justify-between items-center bg-white/80 shadow-sm hover:shadow-md border border-gray-100 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-2 text-gray-800 font-semibold">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  ></span>
                  {icon}
                  <span className="capitalize">{status}</span>
                </div>
                <span className="text-gray-700 font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 text-center py-2 text-xs text-gray-500">
        Updated based on current payment records
      </div>
    </div>
  );
}
