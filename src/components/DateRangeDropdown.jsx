// import React, { useState, useEffect, useRef } from "react";
// import { FaCalendarAlt } from "react-icons/fa";
// import moment from "moment";

// const DateRangeDropdown = ({ onDateRangeChange }) => {
//   const [selectedRange, setSelectedRange] = useState("all");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [customStart, setCustomStart] = useState("");
//   const [customEnd, setCustomEnd] = useState("");
//   const dropdownRef = useRef(null);

//   // Default “All Time” on mount
//   useEffect(() => {
//     applyDateRange("all");
//   }, []);

//   // ✅ Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Function to apply range
//   const applyDateRange = (range, start = null, end = null) => {
//     let startDate = null;
//     let endDate = null;

//     switch (range) {
//       case "today":
//         startDate = moment().startOf("day");
//         endDate = moment().endOf("day");
//         break;
//       case "yesterday":
//         startDate = moment().subtract(1, "days").startOf("day");
//         endDate = moment().subtract(1, "days").endOf("day");
//         break;
//       case "last7days":
//         startDate = moment().subtract(6, "days").startOf("day");
//         endDate = moment().endOf("day");
//         break;
//       case "last30days":
//         startDate = moment().subtract(29, "days").startOf("day");
//         endDate = moment().endOf("day");
//         break;
//       case "last90days":
//         startDate = moment().subtract(89, "days").startOf("day");
//         endDate = moment().endOf("day");
//         break;
//       case "thismonth":
//         startDate = moment().startOf("month");
//         endDate = moment().endOf("month");
//         break;
//       case "lastmonth":
//         startDate = moment().subtract(1, "month").startOf("month");
//         endDate = moment().subtract(1, "month").endOf("month");
//         break;
//       case "thisyear":
//         startDate = moment().startOf("year");
//         endDate = moment().endOf("year");
//         break;
//       case "lastyear":
//         startDate = moment().subtract(1, "year").startOf("year");
//         endDate = moment().subtract(1, "year").endOf("year");
//         break;
//       case "custom":
//         startDate = start ? moment(start).startOf("day") : null;
//         endDate = end ? moment(end).endOf("day") : null;
//         break;
//       case "all":
//       default:
//         startDate = null;
//         endDate = null;
//         break;
//     }

//     setSelectedRange(range);
//     onDateRangeChange(
//       startDate ? startDate.toDate() : null,
//       endDate ? endDate.toDate() : null
//     );
//     setIsDropdownOpen(false);
//   };

//   const getRangeText = () => {
//     switch (selectedRange) {
//       case "today": return "Today";
//       case "yesterday": return "Yesterday";
//       case "last7days": return "Last 7 Days";
//       case "last30days": return "Last 30 Days";
//       case "last90days": return "Last 90 Days";
//       case "thismonth": return "This Month";
//       case "lastmonth": return "Last Month";
//       case "thisyear": return "This Year";
//       case "lastyear": return "Last Year";
//       case "custom": return "Custom Range";
//       default: return "All Time";
//     }
//   };

//   const handleCustomSearch = () => {
//     if (!customStart || !customEnd) {
//       alert("Please select both start and end dates");
//       return;
//     }
//     applyDateRange("custom", customStart, customEnd);
//   };

//   return (
//     <div ref={dropdownRef} className="relative inline-block text-left z-[9999]">
//       {/* Button */}
//       <button
//         type="button"
//         onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//       >
//         <FaCalendarAlt className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
//         {getRangeText()}
//         <svg
//           className="-mr-1 ml-2 h-5 w-5"
//           xmlns="http://www.w3.org/2000/svg"
//           fill="currentColor"
//           viewBox="0 0 20 20"
//         >
//           <path
//             fillRule="evenodd"
//             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//             clipRule="evenodd"
//           />
//         </svg>
//       </button>

//       {/* Dropdown */}
//       {isDropdownOpen && (
//         <div className="absolute right-0 mt-2 w-60 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//           <div className="py-1 max-h-64 overflow-y-auto">
//             {[
//               { key: "all", label: "All Time" },
//               { key: "today", label: "Today" },
//               { key: "yesterday", label: "Yesterday" },
//               { key: "last7days", label: "Last 7 Days" },
//               { key: "last30days", label: "Last 30 Days" },
//               { key: "last90days", label: "Last 90 Days" },
//               { key: "thismonth", label: "This Month" },
//               { key: "lastmonth", label: "Last Month" },
//               { key: "thisyear", label: "This Year" },
//               { key: "lastyear", label: "Last Year" },
//             ].map((item) => (
//               <button
//                 key={item.key}
//                 onClick={() => applyDateRange(item.key)}
//                 className={`block w-full text-left px-4 py-2 text-sm ${
//                   selectedRange === item.key
//                     ? "bg-indigo-100 text-indigo-700 font-semibold"
//                     : "text-gray-700 hover:bg-gray-100"
//                 }`}
//               >
//                 {item.label}
//               </button>
//             ))}

//             {/* Divider */}
//             <div className="border-t my-2"></div>

//             {/* Custom Range Section */}
//             <div className="px-4 pb-3">
//               <p className="text-sm font-medium text-gray-600 mb-2">Custom Range</p>
//               <div className="flex flex-col gap-2">
//                 <input
//                   type="date"
//                   value={customStart}
//                   onChange={(e) => setCustomStart(e.target.value)}
//                   className="border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400"
//                 />
//                 <input
//                   type="date"
//                   value={customEnd}
//                   onChange={(e) => setCustomEnd(e.target.value)}
//                   className="border rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400"
//                 />
//                 <button
//                   onClick={handleCustomSearch}
//                   className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1.5 rounded-md shadow-md transition"
//                 >
//                   Search
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DateRangeDropdown;
import React, { useState, useEffect, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import moment from "moment";

const DateRangeDropdown = ({ onDateRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [yearError, setYearError] = useState(""); // NEW
  const dropdownRef = useRef(null);

  useEffect(() => {
    applyDateRange("all");
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const validateYear = (dateValue) => {
    const year = dateValue.split("-")[0];
    if (year && year.length !== 4) {
      setYearError("Year must be a 4-digit value");
      return false;
    }
    setYearError("");
    return true;
  };

  const applyDateRange = (range, start = null, end = null) => {
    let s = null,
      e = null;

    switch (range) {
      case "today":
        s = moment().startOf("day");
        e = moment().endOf("day");
        break;

      case "yesterday":
        s = moment().subtract(1, "day").startOf("day");
        e = moment().subtract(1, "day").endOf("day");
        break;

      case "last7days":
        s = moment().subtract(6, "days").startOf("day");
        e = moment().endOf("day");
        break;

      case "last30days":
        s = moment().subtract(29, "days").startOf("day");
        e = moment().endOf("day");
        break;

      case "thismonth":
        s = moment().startOf("month");
        e = moment().endOf("month");
        break;

      case "lastmonth":
        s = moment().subtract(1, "month").startOf("month");
        e = moment().subtract(1, "month").endOf("month");
        break;

      case "custom":
        s = start ? moment(start).startOf("day") : null;
        e = end ? moment(end).endOf("day") : null;
        break;

      default:
        s = null;
        e = null;
        break;
    }

    setSelectedRange(range);
    onDateRangeChange(s ? s.toDate() : null, e ? e.toDate() : null);
    setIsDropdownOpen(false);
  };

  const handleCustomSubmit = () => {
    if (!customStart || !customEnd)
      return alert("Please select both dates");

    if (!validateYear(customStart) || !validateYear(customEnd)) return;

    applyDateRange("custom", customStart, customEnd);
  };

  const getLabel = () =>
    ({
      today: "Today",
      yesterday: "Yesterday",
      last7days: "Last 7 Days",
      last30days: "Last 30 Days",
      thismonth: "This Month",
      lastmonth: "Last Month",
      custom: "Custom Range",
      all: "All Time",
    }[selectedRange]);

  return (
    <div ref={dropdownRef} className="relative w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 border border-gray-300 px-4 py-2 bg-white rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-50"
      >
        <FaCalendarAlt className="text-gray-500" />
        {getLabel()}
        <span className="ml-2">▼</span>
      </button>

      {isDropdownOpen && (
        <div className="mt-2 w-72 bg-white shadow-lg border rounded-md p-3 absolute left-0 sm:right-0 z-50">
          <div className="max-h-64 overflow-y-auto text-sm">

            {/* Predefined Ranges */}
            {[
              { key: "all", label: "All Time" },
              { key: "today", label: "Today" },
              { key: "yesterday", label: "Yesterday" },
              { key: "last7days", label: "Last 7 Days" },
              { key: "last30days", label: "Last 30 Days" },
              { key: "thismonth", label: "This Month" },
              { key: "lastmonth", label: "Last Month" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => applyDateRange(item.key)}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  selectedRange === item.key
                    ? "bg-indigo-100 text-indigo-700 font-semibold"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="border-t my-2" />

            {/* Custom Range */}
            <p className="font-medium text-gray-700 mb-1">Custom Range</p>

            <input
              type="date"
              value={customStart}
              onChange={(e) => {
                setCustomStart(e.target.value);
                validateYear(e.target.value);
              }}
              className="border px-3 py-2 rounded w-full mb-2"
            />

            <input
              type="date"
              value={customEnd}
              onChange={(e) => {
                setCustomEnd(e.target.value);
                validateYear(e.target.value);
              }}
              className="border px-3 py-2 rounded w-full mb-2"
            />

            {yearError && (
              <p className="text-red-600 text-xs mb-2">{yearError}</p>
            )}

            <button
              onClick={handleCustomSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Apply Custom Range
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeDropdown;
