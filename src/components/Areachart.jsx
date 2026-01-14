// // src/components/AreaChart.jsx
// import React, { useMemo } from "react";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Filler,
//     Tooltip,
//     Legend
// } from "chart.js";
// import { Line } from "react-chartjs-2";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import moment from "moment";
// import { useSelector } from "react-redux";
// import { listleads } from "../services/leadsRouter";

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Filler,
//     Tooltip,
//     Legend
// );

// const AreaChart = ({ startDate, endDate }) => {
//     const user = useSelector((state) => state.auth.user);
//     const queryClient = useQueryClient();

//     const { data: leads, isLoading } = useQuery({
//         queryKey: ["List leads", startDate, endDate, user.role],
//         queryFn: () =>
//             listleads({
//                 noLimit: true, // Always fetch all
//                 startDate: startDate ? startDate.toISOString() : undefined,
//                 endDate: endDate ? endDate.toISOString() : undefined,
//             }),
//         refetchInterval: 60000,
//     });

//     // Dynamic days based on date range
//     const daysOfWeek = useMemo(() => {
//         const days = [];
//         const start = startDate ? moment(startDate) : moment().subtract(6, "days");
//         const end = endDate ? moment(endDate) : moment();
//         let currentDay = start.clone();
//         while (currentDay.isSameOrBefore(end, "day")) {
//             days.push(currentDay.format("MMM DD"));
//             currentDay.add(1, "day");
//         }
//         return days;
//     }, [startDate, endDate]);

//     const totalLeadsCreated = useMemo(() => {
//         const map = { open: {}, closed: {} };
//         daysOfWeek.forEach(day => {
//             map.open[day] = 0;
//             map.closed[day] = 0;
//         });

//         let total = 0;

//         leads?.leads?.forEach(lead => {
//             const leadDate = moment(lead.createdAt);
//             const leadDay = leadDate.format("MMM DD");

//             // Skip if day not in the selected range
//             if (!daysOfWeek.includes(leadDay)) return;

//             const status = lead.status?.trim().toLowerCase();
//             const updatedById =
//                 typeof lead.updatedBy === "object" ? lead.updatedBy?._id : lead.updatedBy;
//             const createdById =
//                 typeof lead.createdBy === "object" ? lead.createdBy?._id : lead.createdBy;
//             const assignedToId =
//                 typeof lead.assignedTo === "object" ? lead.assignedTo?._id : lead.assignedTo;

//             const isLeadByUser =
//                 user?.id === updatedById ||
//                 user?.id === createdById ||
//                 user?.id === assignedToId;

//             if (isLeadByUser) {
//                 if (status === "open") {
//                     map.open[leadDay]++;
//                 } else if (["closed", "converted", "rejected", "unavailable"].includes(status)) {
//                     map.closed[leadDay]++;
//                 }
//                 total++;
//             }
//         });

//     return { map, total };
//     }, [leads, daysOfWeek, user, startDate, endDate]);

//     const chartData = useMemo(() => ({
//         labels: daysOfWeek,
//         datasets: [
//             {
//                 label: "Opened",
//                 data: daysOfWeek.map(day => totalLeadsCreated.map.open[day]),
//                 fill: true,
//                 backgroundColor: "rgba(234, 179, 8, 0.2)",
//                 borderColor: "rgba(234, 179, 8, 1)",
//                 tension: 0.4,
//                 pointRadius: 3,
//                 pointHoverRadius: 5
//             },
//             {
//                 label: "Closed",
//                 data: daysOfWeek.map(day => totalLeadsCreated.map.closed[day]),
//                 fill: true,
//                 backgroundColor: "rgba(239, 68, 68, 0.2)",
//                 borderColor: "rgba(239, 68, 68, 1)",
//                 tension: 0.4,
//                 pointRadius: 3,
//                 pointHoverRadius: 5
//             }
//         ]
//     }), [totalLeadsCreated, daysOfWeek]);

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: "top",
//                 labels: {
//                     font: {
//                         size: 12,
//                         family: "'Inter', sans-serif"
//                     }
//                 }
//             },
//             tooltip: {
//                 mode: "index",
//                 intersect: false,
//                 bodyFont: {
//                     size: 12,
//                     family: "'Inter', sans-serif"
//                 },
//                 titleFont: {
//                     size: 14,
//                     family: "'Inter', sans-serif"
//                 }
//             }
//         },
//         scales: {
//             x: {
//                 grid: { display: false },
//                 ticks: {
//                     font: {
//                         size: 12,
//                         family: "'Inter', sans-serif"
//                     }
//                 }
//             },
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     stepSize: 1,
//                     font: {
//                         size: 12,
//                         family: "'Inter', sans-serif"
//                     }
//                 }
//             }
//         }
//     };

//     if (isLoading) {
//         return <div className="text-center text-sm sm:text-base text-gray-600">Loading...</div>;
//     }

//     return (
//         <div className="p-2 sm:p-3 bg-white rounded-xl w-full h-full shadow-md">
//             <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">
//                 Leads Overview
//             </h2>
//             <div className="relative w-full h-[300px] sm:h-[400px]">
//                 <Line data={chartData} options={options} />
//             </div>
//             <div className="mt-2 sm:mt-3">
//                 <p className="text-base sm:text-lg font-medium text-gray-700">
//                     {`Total Leads: ${totalLeadsCreated.total}`}
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default AreaChart;
import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useSelector } from "react-redux";
import { listleads } from "../services/leadsRouter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const AreaChart = ({ startDate, endDate }) => {
  const user = useSelector((state) => state.auth.user);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["List leads", startDate, endDate, user.role],
    queryFn: () =>
      listleads({
        noLimit: true,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      }),
    refetchInterval: 60000,
  });

  // 🗓️ Generate dynamic day range
  const daysOfWeek = useMemo(() => {
    const days = [];
    const start = startDate ? moment(startDate) : moment().subtract(6, "days");
    const end = endDate ? moment(endDate) : moment();
    let currentDay = start.clone();
    while (currentDay.isSameOrBefore(end, "day")) {
      days.push(currentDay.format("MMM DD"));
      currentDay.add(1, "day");
    }
    return days;
  }, [startDate, endDate]);

  // 🧮 Compute open/closed counts per day
  const totalLeadsCreated = useMemo(() => {
    const map = { open: {}, closed: {} };
    daysOfWeek.forEach((d) => {
      map.open[d] = 0;
      map.closed[d] = 0;
    });

    let openTotal = 0;
    let closedTotal = 0;

    leads?.leads?.forEach((lead) => {
      const day = moment(lead.createdAt).format("MMM DD");
      if (!daysOfWeek.includes(day)) return;

      const status = lead.status?.trim().toLowerCase();
      if (status === "open") {
        map.open[day]++;
        openTotal++;
      } else if (["closed", "converted", "rejected", "unavailable"].includes(status)) {
        map.closed[day]++;
        closedTotal++;
      }
    });

    return { map, openTotal, closedTotal, total: openTotal + closedTotal };
  }, [leads, daysOfWeek]);

  // 🧠 Chart Data
  const chartData = useMemo(() => {
    const gradientFill = (ctx, color1, color2) => {
      const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      return gradient;
    };

    return {
      labels: daysOfWeek,
      datasets: [
        {
          label: "Opened Leads",
          data: daysOfWeek.map((d) => totalLeadsCreated.map.open[d]),
          borderColor: "#2563eb",
          backgroundColor: (ctx) =>
            gradientFill(ctx, "rgba(37, 99, 235, 0.3)", "rgba(37, 99, 235, 0.05)"),
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
        {
          label: "Closed Leads",
          data: daysOfWeek.map((d) => totalLeadsCreated.map.closed[d]),
          borderColor: "#ef4444",
          backgroundColor: (ctx) =>
            gradientFill(ctx, "rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.05)"),
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [totalLeadsCreated, daysOfWeek]);

  // ⚙️ Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 15,
          padding: 15,
          color: "#374151",
          font: { size: 13, family: "'Inter', sans-serif" },
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        cornerRadius: 8,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6b7280",
          font: { size: 12 },
        },
      },
      y: {
        beginAtZero: true,
        grid: { color: "#e5e7eb" },
        ticks: {
          color: "#6b7280",
          stepSize: 1,
          font: { size: 12 },
        },
      },
    },
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[320px] text-gray-500 text-sm">
        Loading Chart...
      </div>
    );

  return (
    <div className="p-5 sm:p-6 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 flex items-center gap-2">
          📈 Leads Overview
        </h2>
        <p className="text-xs text-gray-500">Daily Open vs Closed Trends</p>
      </div>

      {/* Chart */}
      <div className="relative w-full h-[340px] sm:h-[400px] md:h-[420px]">
        <Line data={chartData} options={options} />
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 hover:bg-blue-100 transition-all p-3 rounded-xl text-center shadow-sm border border-blue-100">
          <p className="text-xs sm:text-sm font-medium text-blue-700">Open Leads</p>
          <p className="text-lg sm:text-xl font-bold text-blue-800">
            {totalLeadsCreated.openTotal}
          </p>
        </div>
        <div className="bg-red-50 hover:bg-red-100 transition-all p-3 rounded-xl text-center shadow-sm border border-red-100">
          <p className="text-xs sm:text-sm font-medium text-red-700">Closed Leads</p>
          <p className="text-lg sm:text-xl font-bold text-red-800">
            {totalLeadsCreated.closedTotal}
          </p>
        </div>
        <div className="bg-gray-50 hover:bg-gray-100 transition-all p-3 rounded-xl text-center shadow-sm border border-gray-200">
          <p className="text-xs sm:text-sm font-medium text-gray-700">Total Leads</p>
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            {totalLeadsCreated.total}
          </p>
        </div>
      </div>
    </div>
  );
};
export default AreaChart;