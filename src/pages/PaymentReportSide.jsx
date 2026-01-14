import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Icons from "./Icons";
import DateRangeDropdown from "../components/DateRangeDropdown";

import PaymentDonutCHart from "../components/PaymentReportChart/PaymentDonutCHart";
import MonthlyPaymentChart from "../components/PaymentReportChart/MonthlyPaymentChart";
import YearlyReportChart from "../components/PaymentReportChart/YearlyReportChart";
import ProductProgressChart from "../components/PaymentReportChart/ProductAmountChart";

function Paymentreports() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // ⭐ Fullscreen chart state
  const [fullscreenChart, setFullscreenChart] = useState(null);

  const handleDateRangeChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Close fullscreen on ESC key
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setFullscreenChart(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Render fullscreen content
  const renderFullscreen = () => {
    if (!fullscreenChart) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setFullscreenChart(null)}
      >
        <motion.div
          className="bg-white p-6 rounded-xl w-[95%] h-[95%] shadow-xl"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          {fullscreenChart}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <motion.div
        animate={{ x: sidebarVisible ? 0 : -256 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 z-40 bg-white shadow-md"
      >
        <Sidebar />
      </motion.div>

      {/* Main Section */}
      <motion.div
        animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="relative flex justify-between items-start bg-white border-b border-gray-200">
          <div className="p-4 sm:p-6 lg:p-8 flex-1 flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
              <button
                className="mr-3 text-blue-600 hover:text-blue-800 transition p-2 rounded-lg hover:bg-blue-50"
                onClick={() => setSidebarVisible(!sidebarVisible)}
              >
                <FaBars className="text-xl" />
              </button>
              Payment Reports Overview
            </h3>

            {/* Date Range Dropdown */}
            <div className="ml-4">
              <DateRangeDropdown onDateRangeChange={handleDateRangeChange} />
            </div>
          </div>

          {/* Top Right Icons */}
          <div className="p-4">
            <Icons />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Grid layout for 4 charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Monthly Payment Chart */}
              <motion.div
                onDoubleClick={() =>
                  setFullscreenChart(
                    <MonthlyPaymentChart startDate={startDate} endDate={endDate} />
                  )
                }
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
              >
                <MonthlyPaymentChart startDate={startDate} endDate={endDate} />
              </motion.div>

              {/* Yearly Payment Chart */}
              <motion.div
                onDoubleClick={() =>
                  setFullscreenChart(
                    <YearlyReportChart startDate={startDate} endDate={endDate} />
                  )
                }
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
              >
                <YearlyReportChart startDate={startDate} endDate={endDate} />
              </motion.div>

              {/* Payment Donut Chart */}
              <motion.div
                onDoubleClick={() =>
                  setFullscreenChart(
                    <PaymentDonutCHart startDate={startDate} endDate={endDate} />
                  )
                }
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
              >
                <PaymentDonutCHart startDate={startDate} endDate={endDate} />
              </motion.div>

              {/* Product Progress Chart */}
              <motion.div
                onDoubleClick={() =>
                  setFullscreenChart(
                    <ProductProgressChart startDate={startDate} endDate={endDate} />
                  )
                }
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer"
              >
                <ProductProgressChart startDate={startDate} endDate={endDate} />
              </motion.div>

            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ⭐ Render fullscreen overlay */}
      {renderFullscreen()}
    </div>
  );
}

export default Paymentreports;
