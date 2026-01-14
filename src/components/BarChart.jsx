// import React, { useEffect, useState } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { useQuery } from '@tanstack/react-query';
// import { listleads } from '../services/leadsRouter';
// import {
//     Chart as ChartJS,
//     BarElement,
//     CategoryScale,
//     LinearScale,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { listleadsourcesettings } from '../services/settingservices/leadSourceSettingsRouter';
// import { liststaffs } from '../services/staffRouter';
// import moment from 'moment';

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// function MonthlyLeadsChart({ type = 'monthly', allSources = [], startDate, endDate }) {
//     const [allLeads, setAllLeads] = useState([]);
//     const [isFetchingAll, setIsFetchingAll] = useState(true);
//     const [initialLoadComplete, setInitialLoadComplete] = useState(false); // Track initial load

//     // Fetch the first page to get pagination metadata
//     const { data: initialLeadsData, isLoading, isError, refetch } = useQuery({
//         queryKey: ['Monthly leads', 1, startDate, endDate],
//         queryFn: () => listleads({ page: 1, startDate: startDate ? startDate.toISOString() : undefined, endDate: endDate ? endDate.toISOString() : undefined }),
//     });

//     // Fetch all pages of leads
//     useEffect(() => {
//         const fetchAllLeads = async () => {
//             if (!initialLeadsData || !initialLeadsData.leads) {
//                 setIsFetchingAll(false); // Ensure this is set when there are no initial leads
//                 setInitialLoadComplete(true);
//                 return;
//             }

//             setIsFetchingAll(true);
//             let allFetchedLeads = [...initialLeadsData.leads];
//             const totalPages = initialLeadsData.totalPages || 1; // Adjust based on API response

//             // Fetch remaining pages if there are more
//             for (let page = 2; page <= totalPages; page++) {
//                 try {
//                     const response = await listleads({ page, startDate: startDate ? startDate.toISOString() : undefined, endDate: endDate ? endDate.toISOString() : undefined });
//                     if (response.leads && Array.isArray(response.leads)) {
//                         allFetchedLeads = [...allFetchedLeads, ...response.leads];
//                     }
//                 } catch (error) {
//                     console.error(`Error fetching page ${page}:`, error);
//                 }
//             }

//             setAllLeads(allFetchedLeads);
//             setIsFetchingAll(false);
//             setInitialLoadComplete(true);
//         };

//         if (!isLoading && !isError && initialLeadsData) {
//             fetchAllLeads();
//         }
//     }, [initialLeadsData, isLoading, isError, startDate, endDate]);

//     const { data: Listsource } = useQuery({
//         queryKey: ['List source'],
//         queryFn: listleadsourcesettings,
//     });

//     const { data: Liststaff } = useQuery({
//         queryKey: ['List staff'],
//         queryFn: liststaffs,
//     });

//     const months = [];
//     const startMoment = startDate ? moment(startDate) : moment().subtract(5, 'months').startOf('month');
//     const endMoment = endDate ? moment(endDate) : moment().endOf('month');

//     let currentMonth = startMoment.clone();
//     while (currentMonth.isSameOrBefore(endMoment, 'month')) {
//         months.push({
//             label: currentMonth.format('MMM'),
//             key: currentMonth.format('YYYY-MM'),
//         });
//         currentMonth.add(1, 'month');
//     }

//     let data = {};
//     let labels = [];
//     let datasets = [];

//     if (type === 'monthly') {
//         const newLeadsCounts = {};
//         const closedLeadsCounts = {};

//         months.forEach(({ key }) => {
//             newLeadsCounts[key] = 0;
//             closedLeadsCounts[key] = 0;
//         });

//         allLeads.forEach((lead) => {
//             const createdAt = new Date(lead.createdAt);
//             const leadMonth = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
//             if (newLeadsCounts[leadMonth] !== undefined) {
//                 if (lead.status === 'new') {
//                     newLeadsCounts[leadMonth] += 1;
//                 } else if (['closed', 'converted', 'rejected'].includes(lead.status)) {
//                     closedLeadsCounts[leadMonth] += 1;
//                 }
//             }
//         });

//         labels = months.map((m) => m.label);
//         datasets = [
//             {
//                 label: 'New Leads',
//                 data: months.map((m) => newLeadsCounts[m.key]),
//                 backgroundColor: 'rgba(54, 162, 235, 0.6)',
//                 borderColor: 'rgba(54, 162, 235, 1)',
//                 borderWidth: 1,
//                 borderRadius: 6,
//                 barThickness: 20,
//                 maxBarThickness: 25,
//                 categoryPercentage: 0.5,
//             },
//             {
//                 label: 'Closed Leads',
//                 data: months.map((m) => closedLeadsCounts[m.key]),
//                 backgroundColor: 'rgba(255, 205, 86, 0.6)',
//                 borderColor: 'rgba(255, 205, 86, 1)',
//                 borderWidth: 1,
//                 borderRadius: 6,
//                 barThickness: 20,
//                 maxBarThickness: 25,
//                 categoryPercentage: 0.5,
//             },
//         ];
//     } else if (type === 'source') {
//         const sourceCounts = {};

//         const validSources = Array.isArray(Listsource?.getLeadsource) ? Listsource.getLeadsource : [];

//         validSources.forEach((src) => {
//             if (src?.title) {
//                 sourceCounts[src.title] = 0;
//             }
//         });

//         allLeads.forEach((lead) => {
//             const sourceTitle = lead.source?.title;
//             if (!sourceTitle || !sourceCounts.hasOwnProperty(sourceTitle)) return;

//             const createdAt = new Date(lead.createdAt);
//             const leadMonthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`;
//             const isInLastSixMonths = months.find((m) => m.key === leadMonthKey);
//             if (isInLastSixMonths) {
//                 sourceCounts[sourceTitle] += 1;
//             }
//         });

//         labels = Object.keys(sourceCounts);

//         const colorPalette = [
//             '#4dc9f6', '#f67019', '#f53794', '#537bc4',
//             '#acc236', '#166a8f', '#00a950', '#58595b',
//             '#8549ba'
//         ];

//         datasets = [
//             {
//                 label: 'Leads by Source',
//                 data: labels.map((title) => sourceCounts[title] ?? 0),
//                 backgroundColor: labels.map((_, i) => colorPalette[i % colorPalette.length]),
//                 borderRadius: 6,
//                 barThickness: 20,
//                 maxBarThickness: 25,
//                 categoryPercentage: 0.5,
//             }
//         ];
//     } else if (type === 'staffs') {
//         const closedStatuses = ['closed', 'converted', 'rejected'];
//         const staffCounts = {};

// allLeads.forEach((lead) => {
//     // ✅ Handle source as object OR string safely
//     let sourceTitle = "";

//     if (typeof lead.source === "string") {
//         sourceTitle = lead.source.trim();
//     } else if (typeof lead.source === "object" && lead.source?.title) {
//         sourceTitle = lead.source.title.trim();
//     }

//     if (!sourceTitle) return; // skip if no source

//     // ✅ Make sure every source key exists before counting
//     if (!sourceCounts.hasOwnProperty(sourceTitle)) {
//         sourceCounts[sourceTitle] = 0;
//     }

//     const createdAt = new Date(lead.createdAt);
//     const leadMonthKey = `${createdAt.getFullYear()}-${String(
//         createdAt.getMonth() + 1
//     ).padStart(2, "0")}`;
//     const isInLastSixMonths = months.find((m) => m.key === leadMonthKey);

//     if (isInLastSixMonths) {
//         sourceCounts[sourceTitle] += 1;
//     }
// });


//         labels = Object.keys(staffCounts);

//         const colorPalette = [
//             '#4dc9f6', '#f67019', '#f53794', '#537bc4',
//             '#acc236', '#166a8f', '#00a950', '#58595b',
//             '#8549ba', '#ff6384', '#36a2eb', '#cc65fe'
//         ];

//         datasets = [
//             {
//                 label: 'Closed Leads by Staff',
//                 data: labels.map((name) => staffCounts[name] ?? 0),
//                 backgroundColor: labels.map((_, i) => colorPalette[i % colorPalette.length]),
//                 borderRadius: 6,
//                 barThickness: 20,
//                 maxBarThickness: 25,
//                 categoryPercentage: 0.5,
//             }
//         ];
//     }

//     data = { labels, datasets };

//     const options = {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 ticks: {
//                     stepSize: 1,
//                     font: { size: 12, family: "'Inter', sans-serif" },
//                 },
//             },
//             x: {
//                 ticks: { font: { size: 12, family: "'Inter', sans-serif" } },
//             },
//         },
//         plugins: {
//             legend: {
//                 display: type !== 'staffs',
//                 position: 'top',
//                 labels: {
//                     font: { family: "'Inter', sans-serif", size: 13 },
//                 },
//             },
//             tooltip: {
//                 backgroundColor: '#1E6DB0',
//                 titleFont: { size: 14, family: "'Inter', sans-serif" },
//                 bodyFont: { size: 12, family: "'Inter', sans-serif" },
//             },
//         },
//     };

//     return (
//         <div className="p-2 sm:p-3 bg-white rounded-xl w-full shadow-md">
//             <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800">
//                 {type === 'source' ? 'Lead Sources Overview'
//                     : type === 'staffs' ? 'Leads Closed by Staff'
//                         : 'Monthly Leads Overview'}
//             </h2>
//             <div
//                 className={`relative w-full overflow-hidden ${type === 'source' || type === 'staffs'
//                     ? 'h-[420px] sm:h-[590px]'
//                     : 'h-[350px] sm:h-[450px]'
//                     }`}
//             >
//                 <Bar data={data} options={options} />
//             </div>
//         </div>
//     );
// }

// export default MonthlyLeadsChart;


import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { listleads } from "../services/leadsRouter";
import { listleadsourcesettings } from "../services/settingservices/leadSourceSettingsRouter";
import { liststaffs } from "../services/staffRouter";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function MonthlyLeadsChart({ type = "monthly", startDate, endDate }) {
  const [allLeads, setAllLeads] = useState([]);
  const [isFetchingAll, setIsFetchingAll] = useState(true);

  // 🟦 Fetch Leads
  const { data: initialLeadsData, isLoading, isError } = useQuery({
    queryKey: ["Monthly leads", startDate, endDate],
    queryFn: () =>
      listleads({
        page: 1,
        noLimit: true,
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
      }),
  });

  useEffect(() => {
    const fetchAllLeads = async () => {
      if (!initialLeadsData?.leads) {
        setIsFetchingAll(false);
        return;
      }

      setIsFetchingAll(true);
      let leads = [...initialLeadsData.leads];
      const totalPages = initialLeadsData.totalPages || 1;

      for (let page = 2; page <= totalPages; page++) {
        try {
          const response = await listleads({
            page,
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
          });
          if (response?.leads) leads = [...leads, ...response.leads];
        } catch (err) {
          console.error("Error fetching page:", err);
        }
      }

      setAllLeads(leads);
      setIsFetchingAll(false);
    };

    if (!isLoading && !isError) fetchAllLeads();
  }, [initialLeadsData, isLoading, isError, startDate, endDate]);

  // 🧩 Source + Staff
  const { data: Listsource } = useQuery({
    queryKey: ["List source"],
    queryFn: listleadsourcesettings,
  });

  const { data: Liststaff } = useQuery({
    queryKey: ["List staff"],
    queryFn: liststaffs,
  });

  // 🗓 Month Labels
  const months = [];
  const start = startDate
    ? moment(startDate).startOf("month")
    : moment().subtract(5, "months").startOf("month");
  const end = endDate ? moment(endDate).endOf("month") : moment();

  let current = start.clone();
  while (current.isSameOrBefore(end, "month")) {
    months.push({ label: current.format("MMM"), key: current.format("YYYY-MM") });
    current.add(1, "month");
  }

  // 🧮 Chart Data Logic
  let labels = [];
  let datasets = [];

  if (type === "monthly") {
    const newLeads = {};
    const closedLeads = {};

    months.forEach(({ key }) => {
      newLeads[key] = 0;
      closedLeads[key] = 0;
    });

    allLeads.forEach((lead) => {
      const monthKey = moment(lead.createdAt).format("YYYY-MM");
      if (newLeads[monthKey] !== undefined) {
        if (lead.status === "new") newLeads[monthKey]++;
        else if (["closed", "converted", "rejected"].includes(lead.status))
          closedLeads[monthKey]++;
      }
    });

    labels = months.map((m) => m.label);
    datasets = [
      {
        label: "New Leads",
        data: months.map((m) => newLeads[m.key]),
        backgroundColor: "rgba(37, 99, 235, 0.7)",
        borderColor: "#2563EB",
        borderWidth: 1.5,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(37, 99, 235, 0.9)",
      },
      {
        label: "Closed Leads",
        data: months.map((m) => closedLeads[m.key]),
        backgroundColor: "rgba(251, 191, 36, 0.7)",
        borderColor: "#F59E0B",
        borderWidth: 1.5,
        borderRadius: 6,
        hoverBackgroundColor: "rgba(251, 191, 36, 0.9)",
      },
    ];
  } else if (type === "source") {
    const sources = {};
    const validSources = Array.isArray(Listsource?.getLeadsource)
      ? Listsource.getLeadsource
      : [];

    validSources.forEach((src) => {
      if (src?.title) sources[src.title] = 0;
    });

    allLeads.forEach((lead) => {
      const src = lead.source?.title || lead.source;
      if (src && sources.hasOwnProperty(src)) sources[src]++;
    });

    labels = Object.keys(sources);
    datasets = [
      {
        label: "Leads by Source",
        data: Object.values(sources),
        backgroundColor: [
          "#4dc9f6",
          "#f67019",
          "#f53794",
          "#537bc4",
          "#acc236",
          "#166a8f",
          "#00a950",
          "#8549ba",
        ],
        borderRadius: 8,
        hoverBorderWidth: 2,
      },
    ];
  } else if (type === "staffs") {
    const closedStatuses = ["closed", "converted", "rejected"];
    const staffCounts = {};

    Liststaff?.staffs?.forEach((staff) => {
      staffCounts[staff.name] = 0;
    });

    allLeads.forEach((lead) => {
      if (closedStatuses.includes(lead.status)) {
        const assignedName = lead.assignedTo?.name || "Unassigned";
        staffCounts[assignedName] = (staffCounts[assignedName] || 0) + 1;
      }
    });

    labels = Object.keys(staffCounts);
    datasets = [
      {
        label: "Closed Leads by Staff",
        data: Object.values(staffCounts),
        backgroundColor: [
          "#4dc9f6",
          "#f67019",
          "#f53794",
          "#537bc4",
          "#acc236",
          "#166a8f",
          "#00a950",
          "#8549ba",
        ],
        borderRadius: 8,
      },
    ];
  }

  const chartData = { labels, datasets };

  // ⚙️ Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#374151",
          stepSize: 1,
          font: { size: 12, family: "Inter" },
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#4b5563", font: { size: 12, family: "Inter" } },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#111827",
          font: { family: "Inter", size: 13 },
          usePointStyle: true,
          boxWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: "#111827",
        padding: 10,
        cornerRadius: 6,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-gray-200 bg-white/70 backdrop-blur-sm flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          {type === "source"
            ? "📊 Leads by Source"
            : type === "staffs"
            ? "👥 Leads Closed by Staff"
            : "📅 Monthly Leads Overview"}
        </h2>
        <p className="text-xs text-gray-500">
          {moment(startDate || moment().subtract(5, "months")).format("MMM YYYY")} -{" "}
          {moment(endDate || moment()).format("MMM YYYY")}
        </p>
      </div>

      {/* Chart */}
      <div className="relative w-full h-[340px] sm:h-[420px] md:h-[460px] lg:h-[520px] p-6">
        {isLoading || isFetchingAll ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm">
            Loading chart...
          </div>
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  );
}

export default MonthlyLeadsChart;





// import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import { useQuery } from "@tanstack/react-query";
// import moment from "moment";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { listleads } from "../services/leadsRouter";
// import { listleadsourcesettings } from "../services/settingservices/leadSourceSettingsRouter";
// import { liststaffs } from "../services/staffRouter";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// function MonthlyLeadsChart({ type = "monthly", startDate, endDate }) {
//   const [allLeads, setAllLeads] = useState([]);
//   const [isFetchingAll, setIsFetchingAll] = useState(true);

//   // 🟦 Fetch initial page
//   const { data: initialLeadsData, isLoading, isError } = useQuery({
//     queryKey: ["Monthly leads", startDate, endDate],
//     queryFn: () =>
//       listleads({
//         page: 1,
//         noLimit: true,
//         startDate: startDate ? startDate.toISOString() : undefined,
//         endDate: endDate ? endDate.toISOString() : undefined,
//       }),
//   });

//   // 🟨 Fetch all leads (paginated or unlimited)
//   useEffect(() => {
//     const fetchAllLeads = async () => {
//       if (!initialLeadsData?.leads) {
//         setIsFetchingAll(false);
//         return;
//       }

//       setIsFetchingAll(true);
//       let leads = [...initialLeadsData.leads];
//       const totalPages = initialLeadsData.totalPages || 1;

//       for (let page = 2; page <= totalPages; page++) {
//         try {
//           const response = await listleads({
//             page,
//             startDate: startDate ? startDate.toISOString() : undefined,
//             endDate: endDate ? endDate.toISOString() : undefined,
//           });
//           if (response?.leads) leads = [...leads, ...response.leads];
//         } catch (err) {
//           console.error("Error fetching page:", err);
//         }
//       }

//       setAllLeads(leads);
//       setIsFetchingAll(false);
//     };

//     if (!isLoading && !isError) fetchAllLeads();
//   }, [initialLeadsData, isLoading, isError, startDate, endDate]);

//   // 🧩 Fetch Source & Staff Lists
//   const { data: Listsource } = useQuery({
//     queryKey: ["List source"],
//     queryFn: listleadsourcesettings,
//   });

//   const { data: Liststaff } = useQuery({
//     queryKey: ["List staff"],
//     queryFn: liststaffs,
//   });

//   // 🗓 Generate month labels dynamically
//   const months = [];
//   const start = startDate
//     ? moment(startDate).startOf("month")
//     : moment().subtract(5, "months").startOf("month");
//   const end = endDate ? moment(endDate).endOf("month") : moment();

//   let current = start.clone();
//   while (current.isSameOrBefore(end, "month")) {
//     months.push({
//       label: current.format("MMM"),
//       key: current.format("YYYY-MM"),
//     });
//     current.add(1, "month");
//   }

//   // 🧮 Chart data logic
//   let labels = [];
//   let datasets = [];

//   if (type === "monthly") {
//     const newLeads = {};
//     const closedLeads = {};

//     months.forEach(({ key }) => {
//       newLeads[key] = 0;
//       closedLeads[key] = 0;
//     });

//     allLeads.forEach((lead) => {
//       const monthKey = moment(lead.createdAt).format("YYYY-MM");
//       if (newLeads[monthKey] !== undefined) {
//         if (lead.status === "new") newLeads[monthKey]++;
//         else if (["closed", "converted", "rejected"].includes(lead.status))
//           closedLeads[monthKey]++;
//       }
//     });

//     labels = months.map((m) => m.label);
//     datasets = [
//       {
//         label: "New Leads",
//         data: months.map((m) => newLeads[m.key]),
//         backgroundColor: "rgba(37, 99, 235, 0.6)",
//         borderColor: "rgba(37, 99, 235, 1)",
//       },
//       {
//         label: "Closed Leads",
//         data: months.map((m) => closedLeads[m.key]),
//         backgroundColor: "rgba(255, 205, 86, 0.6)",
//         borderColor: "rgba(255, 205, 86, 1)",
//       },
//     ];
//   }

//   else if (type === "source") {
//     const sources = {};
//     const validSources = Array.isArray(Listsource?.getLeadsource)
//       ? Listsource.getLeadsource
//       : [];

//     validSources.forEach((src) => {
//       if (src?.title) sources[src.title] = 0;
//     });

//     allLeads.forEach((lead) => {
//       const src = lead.source?.title || lead.source;
//       if (src && sources.hasOwnProperty(src)) sources[src]++;
//     });

//     labels = Object.keys(sources);
//     datasets = [
//       {
//         label: "Leads by Source",
//         data: Object.values(sources),
//         backgroundColor: labels.map(
//           (_, i) =>
//             [
//               "#4dc9f6",
//               "#f67019",
//               "#f53794",
//               "#537bc4",
//               "#acc236",
//               "#166a8f",
//               "#00a950",
//               "#8549ba",
//             ][i % 8]
//         ),
//       },
//     ];
//   }

//   else if (type === "staffs") {
//     const closedStatuses = ["closed", "converted", "rejected"];
//     const staffCounts = {};

//     Liststaff?.staffs?.forEach((staff) => {
//       staffCounts[staff.name] = 0;
//     });

//     allLeads.forEach((lead) => {
//       if (closedStatuses.includes(lead.status)) {
//         const assignedName = lead.assignedTo?.name || "Unassigned";
//         staffCounts[assignedName] = (staffCounts[assignedName] || 0) + 1;
//       }
//     });

//     labels = Object.keys(staffCounts);
//     datasets = [
//       {
//         label: "Closed Leads by Staff",
//         data: Object.values(staffCounts),
//         backgroundColor: labels.map(
//           (_, i) =>
//             [
//               "#4dc9f6",
//               "#f67019",
//               "#f53794",
//               "#537bc4",
//               "#acc236",
//               "#166a8f",
//               "#00a950",
//               "#8549ba",
//             ][i % 8]
//         ),
//       },
//     ];
//   }

//   const chartData = { labels, datasets };

//   // ⚙️ Chart Options
//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: {
//           stepSize: 1,
//           color: "#374151",
//           font: { size: 12, family: "Inter" },
//         },
//       },
//       x: {
//         ticks: { color: "#4b5563", font: { size: 12, family: "Inter" } },
//         grid: { display: false },
//       },
//     },
//     plugins: {
//       legend: {
//         display: true,
//         position: "top",
//         labels: {
//           font: { family: "Inter", size: 13 },
//           color: "#111827",
//         },
//       },
//       tooltip: {
//         backgroundColor: "#1E40AF",
//         titleFont: { size: 14, family: "Inter" },
//         bodyFont: { size: 12, family: "Inter" },
//       },
//     },
//   };

//   return (
//     <div className="p-4 bg-white rounded-2xl shadow-md">
//       <h2 className="text-lg font-semibold mb-4 text-gray-800">
//         {type === "source"
//           ? "Leads by Source"
//           : type === "staffs"
//           ? "Leads Closed by Staff"
//           : "Monthly Leads Overview"}
//       </h2>

//       <div className="relative w-full h-[380px] sm:h-[420px] md:h-[460px] lg:h-[520px]">
//         <Bar data={chartData} options={options} />
//       </div>
//     </div>
//   );
// }

// export default MonthlyLeadsChart;
