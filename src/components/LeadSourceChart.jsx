// import { useState } from "react";
// import moment from "moment";
// import { useQuery } from "@tanstack/react-query";
// import { useSelector } from 'react-redux';
// import { listleads } from "../services/leadsRouter";
// import Spinner from "./Spinner";
// import LeadDetailModal from "./LeadDetailModal";

// const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"];

// const LeadSourceProgressChart = ({ startDate, endDate }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedSource, setSelectedSource] = useState(null);
//   const userlogged = useSelector((state) => state.auth.user); // Get user from Redux

//   const fetchLeads = async () => {
//     const res = await listleads({
//       noLimit: true, // Fetch all leads relevant to the user's role
//       startDate: startDate ? startDate.toISOString() : undefined,
//       endDate: endDate ? endDate.toISOString() : undefined,
//     });
//     const leads = res.leads || [];

//     // GET UNIQUE SOURCES, mapping null/undefined sources to 'Unknown Source'
//     const sources = [...new Set(
//       leads
//         .map(l => l.source?.title || 'Unknown Source')
//         .filter(Boolean) // Still filter out any empty strings if they somehow appear
//     )];

//     return { leads, sources };
//   };

//   const { data, isLoading, error } = useQuery({
//     queryKey: ["lead-sources", userlogged.role, startDate, endDate], // queryKey now depends on user role and dates
//     queryFn: fetchLeads,
//     staleTime: 1000 * 60 * 5, // 5 min
//   });

//   const leads = data?.leads || [];
//   const sources = data?.sources || [];
//   const totalLeads = leads.length; // ← REAL TOTAL IN DATE RANGE

//   // Count per source
//   const counts = sources.reduce((acc, src) => ({ ...acc, [src]: 0 }), {});
//   leads.forEach(lead => {
//     const title = lead.source?.title;
//     if (title && counts[title] !== undefined) counts[title]++;
//   });

//   const chartData = sources
//     .map((src, i) => ({
//       name: src,
//       count: counts[src],
//       percent: totalLeads ? (counts[src] / totalLeads * 100).toFixed(1) : 0,
//       color: COLORS[i % COLORS.length],
//     }))
//     .sort((a, b) => b.count - a.count);

//   return (
//     <div className="p-5 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto">
//       <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
//         Lead Source Distribution
//       </h2>

//       {/* TOTAL LEADS BADGE */}
//       <div className="text-center mb-6">
//         <div 
//           className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-blue-600 text-white text-2xl font-bold rounded-full shadow-md cursor-pointer"
//           onClick={() => {
//             setSelectedSource(null); // null indicates all leads
//             setIsModalOpen(true);
//           }}
//         >
//           {totalLeads.toLocaleString()} Leads
//         </div>
//         <p className="text-sm text-gray-500 mt-2">
//           {userlogged.role === 'Admin' ? 'All Leads (Admin View)' : 'All Leads (Your Scope)'}
//         </p>
//       </div>

//       {isLoading && (
//         <div className="flex justify-center py-10">
//           <Spinner />
//         </div>
//       )}

//       {error && (
//         <p className="text-red-500 text-center">Failed to load leads</p>
//       )}

//       {!isLoading && !error && totalLeads === 0 && (
//         <p className="text-center text-gray-500 py-10">
//           No leads found in this date range
//         </p>
//       )}

//       {!isLoading && !error && totalLeads > 0 && (
//         <div className="space-y-4 max-h-96 overflow-y-auto">
//           {chartData.map(item => (
//             <div 
//               key={item.name} 
//               className="cursor-pointer" 
//               onClick={() => {
//                 setSelectedSource(item.name);
//                 setIsModalOpen(true);
//               }}
//             >
//               <div className="flex justify-between text-sm mb-1">
//                 <span className="font-medium text-gray-700 truncate max-w-[200px]">
//                   {item.name}
//                 </span>
//                 <span className="text-gray-600">
//                   {item.count} <small className="text-xs">({item.percent}%)</small>
//                 </span>
//               </div>

//               <div className="w-full bg-gray-200 rounded-full h-10 overflow-hidden">
//                 <div
//                   className="h-full flex items-center justify-end pr-3 text-white font-bold text-sm transition-all duration-1000"
//                   style={{
//                     width: `${item.percent}%`,
//                     backgroundColor: item.color,
//                   }}
//                 >
//                   {item.percent}%
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {isModalOpen && (
//         <LeadDetailModal 
//           leads={selectedSource ? leads.filter(lead => lead.source?.title === selectedSource) : leads}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedSource(null);
//           }} 
//         />
//       )}
//     </div>
//   );
// };

// export default LeadSourceProgressChart;
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { listleads } from "../services/leadsRouter";
import LeadDetailModal from "./LeadDetailModal";
import Spinner from "./Spinner";

// 🎨 Bar colors (rotating palette)
const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#ef4444"];

export default function LeadSourceProgressChart({ startDate, endDate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const user = useSelector((state) => state.auth.user);

  const fetchLeads = async () => {
    const response = await listleads({
      noLimit: true,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    });

    const leads = response.leads || [];
    const uniqueSources = [
      ...new Set(leads.map((lead) => lead.source?.title || "Unknown Source")),
    ];
    return { leads, uniqueSources };
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["lead-sources", user.role, startDate, endDate],
    queryFn: fetchLeads,
    staleTime: 5 * 60 * 1000,
  });

  const leads = data?.leads || [];
  const sources = data?.uniqueSources || [];
  const totalLeads = leads.length;

  // 🧮 Count per source
  const sourceCounts = sources.reduce((acc, src) => ({ ...acc, [src]: 0 }), {});
  leads.forEach((lead) => {
    const src = lead.source?.title || "Unknown Source";
    if (sourceCounts[src] !== undefined) sourceCounts[src]++;
  });

  const chartData = sources
    .map((src, i) => ({
      name: src,
      count: sourceCounts[src],
      percent: totalLeads
        ? ((sourceCounts[src] / totalLeads) * 100).toFixed(1)
        : 0,
      color: COLORS[i % COLORS.length],
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-6 sm:p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-3">
        🎯 Lead Source Distribution
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        {user.role === "Admin" ? "Admin view of all leads" : "Your assigned leads"}
      </p>

      {/* Total box */}
      <div className="text-center mb-6">
        <div
          onClick={() => {
            setSelectedSource(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-green-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <span className="text-lg">{totalLeads.toLocaleString()}</span>
          <span className="text-sm opacity-90">Total Leads</span>
        </div>
      </div>

      {/* Loading / Error / Empty states */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center text-sm">
          Failed to load lead data.
        </p>
      )}

      {!isLoading && !error && totalLeads === 0 && (
        <p className="text-gray-500 text-center text-sm py-10">
          No leads found for this date range.
        </p>
      )}

      {/* Chart section */}
      {!isLoading && !error && totalLeads > 0 && (
        <div className="space-y-5 max-h-[450px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {chartData.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedSource(item.name);
                setIsModalOpen(true);
              }}
              className="group cursor-pointer transition-all duration-200"
            >
              {/* Title and count */}
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-gray-800 truncate max-w-[220px]">
                  {item.name}
                </span>
                <span className="text-gray-600 text-sm">
                  {item.count}{" "}
                  <small className="text-xs text-gray-400">
                    ({item.percent}%)
                  </small>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-semibold transition-all duration-700 group-hover:scale-[1.01]"
                  style={{
                    width: `${item.percent}%`,
                    background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`,
                  }}
                >
                  {item.percent > 8 ? `${item.percent}%` : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <LeadDetailModal
          leads={
            selectedSource
              ? leads.filter((lead) => lead.source?.title === selectedSource)
              : leads
          }
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSource(null);
          }}
        />
      )}
    </div>
  );
}
