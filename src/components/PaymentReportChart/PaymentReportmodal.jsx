// // frontend/src/components/PaymentReportmodal.tsx
// import React, { useState, useEffect } from "react";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import moment from 'moment';
// import MonthlyPaymentChart from "./MonthlyPaymentChart";
// import YearlyReportChart from "./YearlyReportChart";
// import PaymentDonutCHart from "./PaymentDonutCHart";
// import ProductProgressChart from "./ProductAmountChart";
//  // Corrected capitalization

// const PaymentReportmodal= () => {
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [selectedRange, setSelectedRange] = useState('');

//   useEffect(() => {
//     handleDateRangeChange(selectedRange);
//   }, [selectedRange]);
//   const handleDateRangeChange = (range) => {
//     const today = moment();
//     let start = null;
//     let end = null;

//     switch (range) {
//       case 'today':
//         start = today.startOf('day');
//         end = today.endOf('day');
//         break;
//       case 'last7days':
//         start = moment().subtract(6, 'days').startOf('day');
//         end = today.endOf('day');
//         break;
//       case 'thisMonth':
//         start = moment().startOf('month');
//         end = today.endOf('day');
//         break;
//       case 'thisYear':
//         start = moment().startOf('year');
//         end = today.endOf('day');
//         break;
//       default:
//         // No specific range selected, keep current dates or set to null
//         break;
//     }
//     setStartDate(start ? start.toDate() : null);
//     setEndDate(end ? end.toDate() : null);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-2 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="flex justify-center my-4 space-x-4">
//         <select
//           value={selectedRange}
//           onChange={(e) => {
//             setSelectedRange(e.target.value);
//             if (e.target.value === '') {
//               setStartDate(null);
//               setEndDate(null);
//             }
//           }}
//           className="p-2 border rounded"
//         >
//           <option value="">Custom Range</option>
//           <option value="today">Today</option>
//           <option value="last7days">Last 7 Days</option>
//           {/* <option value="last30days">Last 30 Days</option> */}
//           <option value="thisMonth">This Month</option>
//           {/* <option value="lastMonth">Last Month</option> */}
//           <option value="thisYear">This Year</option>
//           {/* <option value="lastYear">Last Year</option> */}
//           {/* <option value="allTime">All Time</option> */}
//         </select>
//         <DatePicker
//           selected={startDate}
//           onChange={(dates) => {
//             const [start, end] = dates;
//             setStartDate(start);
//             setEndDate(end);
//             setSelectedRange(''); // Reset dropdown when custom date is picked
//           }}
//           startDate={startDate}
//           endDate={endDate}
//           selectsRange
//           placeholderText="Select a date range"
//           className="p-2 border rounded"
//           isClearable={true}
//         />
//       </div>
//       {/* Charts Section */}
//       <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
//         {/* Monthly Report */}
//         <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-4">
       
//           </h3>
//           <div className="overflow-x-auto">
//             <MonthlyPaymentChart startDate={startDate} endDate={endDate} />
//           </div>
//         </div>

//         {/* Yearly Report */}
//         <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-4">
          
//           </h3>
//           <div className="overflow-x-auto">
//             <YearlyReportChart startDate={startDate} endDate={endDate} />
//           </div>
//         </div>

//         {/* Project Progress */}
//         <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-4">
        
//           </h3>
//           <div className="overflow-x-auto">
//             <ProductProgressChart startDate={startDate} endDate={endDate} />
//           </div>
//         </div>

//         {/* Payment Donut */}
//         <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition duration-300">
//           <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-4">
     
//           </h3>
//           <div className="overflow-x-auto">
//             <PaymentDonutCHart startDate={startDate} endDate={endDate} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentReportmodal;