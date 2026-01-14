import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "./Sidebar";
import AreaChart from "../components/Areachart";
import MonthlyLeadsChart from "../components/BarChart";
import LeadSourceProgressChart from "../components/LeadSourceChart";
import LeadStatusPieChart from "../components/PieChart";
import Spinner from "../components/Spinner";
import Icons from "./Icons";
import { motion } from "framer-motion";
import { FaBars, FaChartBar, FaPhoneAlt, FaTasks, FaUser } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { listleads } from "../services/leadsRouter";
import DateRangeDropdown from "../components/DateRangeDropdown";
import { listtask } from "../services/tasksRouter";

function Admindashboard() {
  const queryClient = useQueryClient();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const userlogged = useSelector((state) => state.auth.user);
  const metadata = useSelector((state) => state.auth.metadataUser);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);

  // Invalidate cached queries on mount
  useEffect(() => {
    queryClient.invalidateQueries(["List leads"]);
    queryClient.invalidateQueries(["List tasks"]);
  }, [queryClient]);

  // Fetch Leads
  const {
    data: leads,
    isLoading: leadsLoading,
    error: leadsError,
  } = useQuery({
    queryKey: ["List leads", userlogged.role, startDateFilter, endDateFilter],
    queryFn: () =>
      listleads({
        noLimit: userlogged.role === "Admin",
        startDate: startDateFilter ? startDateFilter.toISOString() : undefined,
        endDate: endDateFilter ? endDateFilter.toISOString() : undefined,
      }),
    retry: 3,
  });

  // Fetch Tasks
  const {
    data: tasks,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["List tasks"],
    queryFn: listtask,
    retry: 3,
  });

  if (leadsError || tasksError) {
    console.error("Query error:", leadsError || tasksError);
    return (
      <div className="p-4 text-red-600">
        Error loading data. Please try again.
      </div>
    );
  }

  // ==============================
  // Derived Values
  // ==============================
  const totalFollowups = useMemo(
    () =>
      leads?.leads?.length
        ? leads.leads.filter((lead) => lead.status === "open")
        : [],
    [leads]
  );

  const closedLeads = useMemo(
    () =>
      leads?.leads?.length
        ? leads.leads.filter(
            (lead) =>
              ["closed", "converted", "rejected"].includes(lead.status) &&
              (lead.updatedBy?._id === userlogged?.id ||
                lead.updatedBy === userlogged?.id)
          )
        : [],
    [leads, userlogged]
  );

  const completedTask = useMemo(
    () =>
      tasks?.task?.length
        ? tasks.task.filter((task) => task.status === "completed")
        : [],
    [tasks]
  );

  const assignedTask = useMemo(
    () =>
      tasks?.task?.length
        ? tasks.task.filter((task) => task.assignedTo === userlogged?.id)
        : [],
    [tasks, userlogged]
  );

  const completedAssignedtask = useMemo(
    () =>
      tasks?.task?.length
        ? tasks.task.filter(
            (task) =>
              task.status === "completed" &&
              task.assignedTo === userlogged?.id &&
              task.updatedBy === userlogged?.id
          )
        : [],
    [tasks, userlogged]
  );

  const isDataLoading = leadsLoading || tasksLoading;

  // ==============================
  // Render
  // ==============================
  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40">
        <motion.div
          animate={{ x: sidebarVisible ? 0 : -260 }}
          transition={{ duration: 0.3 }}
          className="w-64 h-full fixed top-0 left-0 z-50"
        >
          <Sidebar />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col h-screen"
      >
        {isDataLoading && <Spinner />}

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8 bg-gray-100 border-b border-gray-300">
          <div className="flex items-center">
            <button
              className="mr-2 sm:mr-4 text-blue-600 hover:text-blue-800 transition"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <FaBars className="text-lg sm:text-xl lg:text-2xl" />
            </button>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Dashboard
            </h3>
          </div>
          <Icons />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Lead Summary */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaChartBar className="text-blue-500 text-base sm:text-xl" />
                </div>
                <h4 className="text-sm sm:text-md font-medium text-gray-600">
                  Lead
                </h4>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                  {closedLeads.length}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  Closed
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Total{" "}
                <span className="text-blue-500">
                  {leads?.leads?.length || 0}
                </span>{" "}
                Leads
              </p>
            </motion.div>

            {/* FollowUp Summary */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaUser className="text-blue-500 text-base sm:text-xl" />
                </div>
                <h4 className="text-sm sm:text-md font-medium text-gray-600">
                  FollowUps
                </h4>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                  {totalFollowups.length}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  Open
                </p>
              </div>
            </motion.div>

            {/* Tasks Summary */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaTasks className="text-blue-500 text-base sm:text-xl" />
                </div>
                <h4 className="text-sm sm:text-md font-medium text-gray-600">
                  Tasks
                </h4>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                  {completedTask.length}
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  Completed
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Total{" "}
                <span className="text-blue-500">
                  {tasks?.task?.length || 0}
                </span>{" "}
                Tasks
              </p>
            </motion.div>

            {/* Calls Summary (Placeholder) */}
            <motion.div
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-2 flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FaPhoneAlt className="text-blue-500 text-base sm:text-xl" />
                </div>
                <h4 className="text-sm sm:text-md font-medium text-gray-600">
                  Calls
                </h4>
              </div>
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black">
                  0
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-gray-500">
                  Closed
                </p>
              </div>
            </motion.div>
          </div>

          {/* Charts Wrapper with Date Range on Top */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            {/* Top bar inside charts section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800">
                Leads & Tasks Overview
              </h4>
              <DateRangeDropdown
                onDateRangeChange={(start, end) => {
                  setStartDateFilter(start);
                  setEndDateFilter(end);
                }}
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
              {/* Weekly Leads */}
              <motion.div
                className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden min-h-[220px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Weekly Leads
                </h4>
                <AreaChart
                  startDate={startDateFilter}
                  endDate={endDateFilter}
                />
              </motion.div>

              {/* Monthly Leads */}
              <motion.div
                className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden min-h-[220px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Monthly Leads
                </h4>
                <MonthlyLeadsChart
                  type="monthly"
                  startDate={startDateFilter}
                  endDate={endDateFilter}
                />
              </motion.div>

              {/* Lead Source Chart */}
              <motion.div
                className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden min-h-[220px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Lead Source Chart
                </h4>
                <LeadSourceProgressChart
                  leads={leads?.leads}
                  startDate={startDateFilter}
                  endDate={endDateFilter}
                />
              </motion.div>

              {/* Lead Status Chart */}
              <motion.div
                className="bg-gray-50 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden min-h-[220px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                  Lead Status Chart
                </h4>
                <LeadStatusPieChart
                  leads={leads?.leads}
                  isLoading={leadsLoading}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Admindashboard;
