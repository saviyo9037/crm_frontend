// import React, { useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from "react-redux";
// import moment from "moment";
// import { listleads } from "../services/leadsRouter";
// import Spinner from "./Spinner";

// const LeadStatusPieChart = ({ leads, isLoading }) => {
//   const user = useSelector((state) => state.auth.user);

//   /* ---------- FILTER BY ROLE ---------- */
//   const filteredLeads = useMemo(() => {
//     if (!leads?.length) return [];

//     // Admin / Sub-Admin → all leads
//     if (user?.role === "Admin" || user?.role === "Sub-Admin") {
//       return leads;
//     }

//     // Agent → only leads created OR assigned to them
//     return leads.filter((lead) => {
//       const createdById =
//         typeof lead.createdBy === "object" ? lead.createdBy?._id : lead.createdBy;
//       const assignedToId =
//         typeof lead.assignedTo === "object"
//           ? lead.assignedTo?._id
//           : lead.assignedTo;

//       return user?.id === createdById || user?.id === assignedToId;
//     });
//   }, [leads, user]);

//   /* ---------- STATUS CONFIG ---------- */
//   const statuses = [
//     "new",
//     "open",
//     "converted",
//     "walkin",
//     "paused",
//     "rejected",
//     "unavailable",
//   ];

//   const statusColors = {
//     new: "#3B82F6",
//     open: "#EAB308",
//     converted: "#10B981",
//     walkin: "#A855F7",
//     paused: "#F97316",
//     rejected: "#EF4444",
//     unavailable: "#6B7280",
//   };

//   /* ---------- COUNT STATUSES ---------- */
//   const statusCounts = useMemo(() => {
//     const counts = Object.fromEntries(statuses.map((s) => [s, 0]));
//     filteredLeads.forEach((lead) => {
//       const s = lead.status?.trim().toLowerCase();
//       if (statuses.includes(s)) counts[s]++;
//     });
//     return counts;
//   }, [filteredLeads]);

//   const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
//   const hasData = total > 0;

//   /* ---------- PROGRESS BAR COMPONENT ---------- */
//   const ProgressBar = ({ label, count, color }) => {
//     const percentage = total ? ((count / total) * 100).toFixed(1) : 0;

//     return (
//       <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200">
//         {/* Color bullet */}
//         <div
//           className="w-3 h-12 rounded-sm flex-shrink-0"
//           style={{ backgroundColor: color }}
//         />
//         <div className="flex-1">
//           <div className="flex justify-between mb-1">
//             <span className="capitalize text-sm font-medium text-gray-700">
//               {label}
//             </span>
//             <span className="text-sm font-bold text-gray-900">
//               {count} ({percentage}%)
//             </span>
//           </div>
//           {/* Animated bar */}
//           <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out"
//               style={{
//                 backgroundColor: color,
//                 width: `${percentage}%`,
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     );
//   };

//   /* ---------- RENDER ---------- */
//   if (isLoading) {
//     return (
//       <div className="p-6 bg-white shadow rounded-xl max-w-xl mx-auto flex items-center justify-center h-64">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-white shadow rounded-xl max-w-xl mx-auto">
//       <div className="text-center mb-6">
//         <h2 className="text-xl font-bold text-gray-800">
//           Lead Status Overview
//         </h2>

//         {/* TOTAL LEADS COUNT */}
//         <p className="mt-1 text-2xl font-bold text-indigo-600">
//           {total} {total === 1 ? "Lead" : "Leads"}
//         </p>
//       </div>

//       {hasData ? (
//         <div className="space-y-3">
//           {statuses.map((status) => (
//             <ProgressBar
//               key={status}
//               label={status}
//               count={statusCounts[status]}
//               color={statusColors[status]}
//             />
//           ))}
//         </div>
//       ) : (
//         <p className="text-center text-gray-500">
//           No leads data available for the selected period.
//         </p>
//       )}
//     </div>
//   );
// };

// export default LeadStatusPieChart;

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import moment from "moment";
import { listleads } from "../services/leadsRouter";
import Spinner from "./Spinner";

const LeadStatusPieChart = ({ leads, isLoading }) => {
  const user = useSelector((state) => state.auth.user);

  // ✅ Filter by role (same logic)
  const filteredLeads = useMemo(() => {
    if (!leads?.length) return [];

    if (user?.role === "Admin" || user?.role === "Sub-Admin") return leads;

    return leads.filter((lead) => {
      const createdById =
        typeof lead.createdBy === "object" ? lead.createdBy?._id : lead.createdBy;
      const assignedToId =
        typeof lead.assignedTo === "object"
          ? lead.assignedTo?._id
          : lead.assignedTo;

      return user?.id === createdById || user?.id === assignedToId;
    });
  }, [leads, user]);

  // ✅ Status setup
  const statuses = [
    "new",
    "open",
    "converted",
    "walkin",
    "paused",
    "rejected",
    "unavailable",
  ];

  const statusColors = {
    new: "#3B82F6",
    open: "#EAB308",
    converted: "#10B981",
    walkin: "#A855F7",
    paused: "#F97316",
    rejected: "#EF4444",
    unavailable: "#6B7280",
  };

  // ✅ Count each status
  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(statuses.map((s) => [s, 0]));
    filteredLeads.forEach((lead) => {
      const s = lead.status?.trim().toLowerCase();
      if (statuses.includes(s)) counts[s]++;
    });
    return counts;
  }, [filteredLeads]);

  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const hasData = total > 0;

  // ✅ Progress Bar Component
  const ProgressBar = ({ label, count, color }) => {
    const percentage = total ? ((count / total) * 100).toFixed(1) : 0;

    return (
      <div className="flex items-center gap-4 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300">
        {/* Color Pill */}
        <div
          className="w-2 h-14 rounded-full flex-shrink-0"
          style={{
            background: `linear-gradient(180deg, ${color}, ${color}CC)`,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />

        {/* Label & Bar */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <span className="capitalize text-sm font-semibold text-gray-700 tracking-wide">
              {label}
            </span>
            <span className="text-sm font-bold text-gray-900">
              {count}
              <span className="text-xs text-gray-500 font-medium ml-1">
                ({percentage}%)
              </span>
            </span>
          </div>

          <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}66`,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="p-6 bg-white shadow-md rounded-3xl flex items-center justify-center h-64 border border-gray-100">
        <Spinner />
      </div>
    );
  }

  // ✅ Main Render
  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-lg hover:shadow-2xl border border-gray-100 rounded-3xl max-w-3xl mx-auto transition-all duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 tracking-wide">
          📊 Lead Status Overview
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Summary of all leads grouped by status
        </p>

        <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300">
          {total} {total === 1 ? "Lead" : "Leads"}
        </div>
      </div>

      {/* Bars */}
      {hasData ? (
        <div className="space-y-4">
          {statuses.map((status) => (
            <ProgressBar
              key={status}
              label={status}
              count={statusCounts[status]}
              color={statusColors[status]}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm py-10">
          No lead data available for this range.
        </p>
      )}
    </div>
  );
};

export default LeadStatusPieChart;

