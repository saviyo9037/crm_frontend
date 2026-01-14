// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import { Bar } from "react-chartjs-2";
// import { Chart as ChartJS, defaults } from "chart.js/auto";
// import ChartDataLabels from "chartjs-plugin-datalabels";
// import { getpaymentDetailsed } from "../../services/paymentstatusRouter";

// ChartJS.register(ChartDataLabels);

// defaults.responsive = true;
// defaults.maintainAspectRatio = false;

// // ✅ Utility for Indian currency formatting
// const formatCurrency = (value) => {
//   if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
//   if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
//   if (value >= 1000) return `${(value / 1000).toFixed(1)} K`;
//   return value.toFixed(0);
// };

// export default function YearlyReportChart({ startDate, endDate }) {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["paymentDetails", startDate, endDate],
//     queryFn: () => getpaymentDetailsed({ startDate, endDate }),
//   });

//   if (isLoading) return <p>Loading Chart...</p>;
//   if (isError) return <p>Error loading chart data...</p>;

//   const payments = data?.allPayment || [];

//   // ✅ Filter payments within selected range
//   const filteredPayments = payments.filter((item) => {
//     if (!item.createdAt) return false;
//     const paymentDate = new Date(item.createdAt);
//     if (startDate && endDate) {
//       return paymentDate >= startDate && paymentDate <= endDate;
//     }
//     return true;
//   });

//   // ✅ Prepare year labels (2020 → current)
//   const startYear = 2020;
//   const currentYear = new Date().getFullYear();
//   const years = [];
//   for (let y = startYear; y <= currentYear; y++) years.push(y);

//   // ✅ Group totals per year
//   const yearlyTotals = years.map((year) => {
//     const filtered = filteredPayments.filter(
//       (item) => new Date(item.createdAt).getFullYear() === year
//     );
//     return {
//       year,
//       totalPaid: filtered.reduce((sum, i) => sum + (i.totalPaid || 0), 0),
//       totalAmount: filtered.reduce((sum, i) => sum + (i.totalAmount || 0), 0),
//     };
//   });

//   // ✅ Chart data (Left = Total Paid, Right = Total Amount)
//   const chartData = {
//     labels: years,
//     datasets: [
//       {
//         label: "Total Paid (₹)",
//         data: yearlyTotals.map((y) => y.totalPaid),
//         borderColor: "#3b82f6",
//         backgroundColor: "rgba(59, 130, 246, 0.5)",
//         borderWidth: 3,
//         tension: 0.4,
//         fill: false,
//         yAxisID: "y1", // ← Left Axis
//         pointRadius: 5,
//         pointHoverRadius: 7,
//       },
//       {
//         label: "Total Amount (₹)",
//         data: yearlyTotals.map((y) => y.totalAmount),
//         borderColor: "#f59e0b",
//         backgroundColor: "rgba(245, 158, 11, 0.5)",
//         borderWidth: 3,
//         tension: 0.4,
//         fill: false,
//         yAxisID: "y2", // ← Right Axis
//         pointRadius: 5,
//         pointHoverRadius: 7,
//       },
//     ],
//   };

//   // ✅ Chart options
//   const chartOptions = {
//     plugins: {
//       title: {
//         display: true,
//         text: "Yearly Payment Performance (₹ in Crores)",
//         font: { size: 18, weight: "bold" },
//         color: "#111827",
//       },
//       legend: {
//         position: "top",
//         labels: { color: "#374151", font: { size: 14 } },
//       },
//       datalabels: {
//         color: "#111",
//         anchor: "end",
//         align: "top",
//         font: { size: 12, weight: "bold" },
//         formatter: (value) => (value ? `₹${formatCurrency(value)}` : ""),
//       },
//       tooltip: {
//         mode: "index",
//         intersect: false,
//         callbacks: {
//           label: (context) => {
//             const label = context.dataset.label || "";
//             const value = context.raw;
//             return `${label}: ₹${formatCurrency(value)}`;
//           },
//         },
//       },
//     },
//     interaction: { mode: "index", intersect: false },
//     scales: {
//       x: {
//         title: {
//           display: true,
//           text: "Year",
//           color: "#374151",
//           font: { size: 14, weight: "bold" },
//         },
//         ticks: { color: "#4b5563" },
//         grid: { display: false },
//       },
//       y1: {
//         position: "left",
//         title: {
//           display: true,
//           text: "Total Paid (₹ in Cr)",
//           color: "#3b82f6",
//           font: { size: 14, weight: "bold" },
//         },
//         beginAtZero: true,
//         ticks: {
//           color: "#3b82f6",
//           callback: (value) => `₹${formatCurrency(value)}`,
//         },
//         grid: { color: "#e5e7eb" },
//       },
//       y2: {
//         position: "right",
//         title: {
//           display: true,
//           text: "Total Amount (₹ in Cr)",
//           color: "#f59e0b",
//           font: { size: 14, weight: "bold" },
//         },
//         beginAtZero: true,
//         ticks: {
//           color: "#f59e0b",
//           callback: (value) => `₹${formatCurrency(value)}`,
//         },
//         grid: { drawOnChartArea: false }, // avoids overlap
//       },
//     },
//   };

//   return (
//     <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
//       <h2 className="text-xl font-semibold text-gray-800 mb-4">
//         Yearly Payment Report (Dual Axis)
//       </h2>
//       <div className="h-[400px]">
//         <Bar data={chartData} options={chartOptions} />
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getpaymentDetailsed } from "../../services/paymentstatusRouter";

ChartJS.register(ChartDataLabels);

defaults.responsive = true;
defaults.maintainAspectRatio = false;

// ✅ Utility for Indian currency formatting
const formatCurrency = (value) => {
  if (value >= 10000000) return `${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(2)} L`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)} K`;
  return value.toFixed(0);
};

export default function YearlyReportChart({ startDate, endDate }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["paymentDetails", startDate, endDate],
    queryFn: () => getpaymentDetailsed({ startDate, endDate }),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[300px] text-gray-500 font-medium">
        Loading Chart...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-[300px] text-red-500 font-medium">
        Error loading chart data...
      </div>
    );

  const payments = data?.allPayment || [];

  // ✅ Filter payments within selected range
  const filteredPayments = payments.filter((item) => {
    if (!item.createdAt) return false;
    const paymentDate = new Date(item.createdAt);
    if (startDate && endDate) {
      return paymentDate >= startDate && paymentDate <= endDate;
    }
    return true;
  });

  // ✅ Prepare year labels (2020 → current)
  const startYear = 2020;
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = startYear; y <= currentYear; y++) years.push(y);

  // ✅ Group totals per year
  const yearlyTotals = years.map((year) => {
    const filtered = filteredPayments.filter(
      (item) => new Date(item.createdAt).getFullYear() === year
    );
    return {
      year,
      totalPaid: filtered.reduce((sum, i) => sum + (i.totalPaid || 0), 0),
      totalAmount: filtered.reduce((sum, i) => sum + (i.totalAmount || 0), 0),
    };
  });

  // ✅ Chart data
  const chartData = {
    labels: years,
    datasets: [
      {
        label: "Total Paid (₹)",
        data: yearlyTotals.map((y) => y.totalPaid),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.5)",
        borderWidth: 2,
        yAxisID: "y1",
        borderRadius: 8,
      },
      {
        label: "Total Amount (₹)",
        data: yearlyTotals.map((y) => y.totalAmount),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.5)",
        borderWidth: 2,
        yAxisID: "y2",
        borderRadius: 8,
      },
    ],
  };

  // ✅ Chart options
  const chartOptions = {
    layout: { padding: { top: 10, bottom: 10 } },
    plugins: {
      title: {
        display: true,
        text: "Yearly Payment Performance (₹ in Crores)",
        font: { size: 18, weight: "bold", family: "'Inter', sans-serif" },
        color: "#1e293b",
        padding: { bottom: 15 },
      },
      legend: {
        position: "bottom",
        labels: { color: "#334155", font: { size: 13 } },
      },
      datalabels: {
        color: "#111",
        anchor: "end",
        align: "top",
        font: { size: 11, weight: "bold" },
        formatter: (value) => (value ? `₹${formatCurrency(value)}` : ""),
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ₹${formatCurrency(value)}`;
          },
        },
      },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year",
          color: "#475569",
          font: { size: 14, weight: "bold" },
        },
        ticks: { color: "#475569" },
        grid: { display: false },
      },
      y1: {
        position: "left",
        title: {
          display: true,
          text: "Total Paid (₹ in Cr)",
          color: "#2563eb",
          font: { size: 13, weight: "bold" },
        },
        beginAtZero: true,
        ticks: {
          color: "#2563eb",
          callback: (value) => `₹${formatCurrency(value)}`,
        },
        grid: { color: "#e5e7eb" },
      },
      y2: {
        position: "right",
        title: {
          display: true,
          text: "Total Amount (₹ in Cr)",
          color: "#f59e0b",
          font: { size: 13, weight: "bold" },
        },
        beginAtZero: true,
        ticks: {
          color: "#f59e0b",
          callback: (value) => `₹${formatCurrency(value)}`,
        },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white/70 backdrop-blur-sm flex justify-between items-center">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          📈 Yearly Payment Insights
        </h3>
        <span className="text-sm text-gray-500">
          {startDate && endDate
            ? `${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()}`
            : "All Time"}
        </span>
      </div>

      {/* Chart */}
      <div className="px-4 sm:px-6 py-4 h-[320px] sm:h-[360px] md:h-[400px] lg:h-[420px]">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 text-gray-500 text-xs sm:text-sm py-2 text-center border-t border-gray-200">
        Updated with latest transaction data
      </div>
    </div>
  );
}
