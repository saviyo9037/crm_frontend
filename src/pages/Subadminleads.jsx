import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { FaBars, FaPlusCircle, FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCustomerdetailmodal,
  toggleCustomermodal,
  toggleUploadcsvmodal,
} from "../redux/modalSlice";
import Customermodal from "../components/Customermodal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Customerdetailmodal from "../components/Customerdetailmodal";
import { AnimatePresence, motion } from "framer-motion";
import {
  deletemultipleleads,
  listleads,
  updateleadstatus,
  updatepriority,
  deleteAllLeads,
} from "../services/leadsRouter";
import Icons from "./Icons";
import { liststaffs } from "../services/staffRouter";
import Spinner from "../components/Spinner";
import Uploadcsvmodal from "../components/Uploadcsvmodal";
import { CloudUpload, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DateRangeDropdown from "../components/DateRangeDropdown";

import * as XLSX from "xlsx";

function Subadminleads() {
  const queryclient = useQueryClient();
  const dispatch = useDispatch();
  const [downloadFormat, setDownloadFormat] = useState("csv");

  const statusColors = {
    new: "bg-blue-100 text-blue-700 font-semibold",
    open: "bg-yellow-100 text-yellow-700 font-semibold",
    converted: "bg-green-100 text-green-700 font-semibold",
    walkin: "bg-purple-100 text-purple-700 font-semibold",
    paused: "bg-orange-100 text-orange-700 font-semibold",
    rejected: "bg-red-100 text-red-700 font-semibold",
    unavailable: "bg-gray-200 text-gray-600 font-semibold",
  };

  const priorityColor = {
    hot: "bg-red-100 text-red-700 font-semibold",
    warm: "bg-yellow-100 text-yellow-700 font-semibold",
    cold: "bg-purple-100 text-purple-700 font-semibold",
  };

  // Status ordering
  const statusOrder = {
    new: 1,
    open: 2,
    converted: 3,
    walkin: 4,
    paused: 5,
    rejected:7 ,
    unavailable: 6,
  };
  

  // Sorting leads by statusOrder

  const isCustomermodal = useSelector((state) => state.modal.customerModal);
  const iscustomerdetailmodal = useSelector(
    (state) => state.modal.customerdetailModal
  );
  const isUploadcsvmodal = useSelector((state) => state.modal.uploadcsvModal);
  const role = useSelector((state) => state.auth.role);
  const metadata = useSelector((state) => state.auth.metadataUser);

  const [sidebarVisible, setsidebarVisible] = useState(true);
  const [statussuccessmodal, setstatussuccessmodal] = useState(false);
  const [deletesuccessmodal, setdeletesuccessmodal] = useState(false);
  const [showsearch, setshowsearch] = useState(false);

  // priority  controller
  const [priorityfilter, setpriorityfilter] = useState("Priority");

  const [statusfilter, setstatusfilter] = useState([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [assignedfilter, setassignedfilter] = useState("AssignedTo");
  const [leadvaluefilter, setleadvaluefilter] = useState("Sort By");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [searchText, setsearchText] = useState("");
  const [currentpage, setcurrentpage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showSecondDeleteAllConfirm, setShowSecondDeleteAllConfirm] = useState(false);
  const leadsperpage = 10;

  // Reset page to 1 when filters change
  useEffect(() => {
    setcurrentpage(1);
  }, [
    priorityfilter,
    statusfilter,
    assignedfilter,
    searchText,
    dateRange,
    leadvaluefilter,
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.status-dropdown')) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: fetchleads, isLoading } = useQuery({
    queryKey: [
      "Listleads",
      currentpage,
      priorityfilter,
      statusfilter,
      assignedfilter,
      searchText,
      dateRange,
      leadvaluefilter,
      role,
      metadata,
    ],
    queryFn: () =>
      listleads({
        page: assignedfilter !== "AssignedTo" ? 1 : currentpage,
        limit: assignedfilter !== "AssignedTo" ? 100000 : leadsperpage,
        priority: priorityfilter !== "Priority" ? priorityfilter : undefined,
        status: statusfilter.length > 0 ? statusfilter : undefined,
        assignedTo: assignedfilter !== "AssignedTo" ? assignedfilter : undefined,
        searchText,
        startDate: dateRange.start ? dateRange.start.toISOString() : undefined,
        endDate: dateRange.end ? dateRange.end.toISOString() : undefined,
        sortBy: leadvaluefilter !== "Sort By" ? leadvaluefilter : undefined,
        role: role,
        metadataUser: metadata,
      }),
    keepPreviousData: true,
  });
  console.log("tset",fetchleads)

  const fetchstaffs = useQuery({
    queryKey: ["Liststaffs"],
    queryFn: liststaffs,
  });

  // Get unique assigned staff IDs from current leads
  const { data: allLeadsForStaff, isLoading: isLoadingAllLeads } = useQuery({
    queryKey: ["allLeadsForStaff", role, metadata],
    queryFn: () => listleads({ limit: 100000, role: role, metadataUser: metadata }),
    select: (data) => [...new Set(data?.leads?.map(lead => lead.assignedTo?._id).filter(Boolean))]
  });

  const assignedStaff = fetchstaffs.data?.filter(staff => allLeadsForStaff?.includes(staff._id));

  const updatestatusmutation = useMutation({
    mutationKey: ["Update lead status"],
    mutationFn: updateleadstatus,
    onSuccess: () => {
      queryclient.invalidateQueries(["Listleads"]);
    },
  });

  const deleteLeadsMutation = useMutation({
    mutationKey: ["Delete leads"],
    mutationFn: deletemultipleleads,
    onSuccess: () => {
      queryclient.invalidateQueries(["Listleads"]);
      setSelectedLeads([]);
      setdeletesuccessmodal(true);
      setTimeout(() => {
        setdeletesuccessmodal(false
          
        );
      }, 2000);
    },
    onError: (error) => {
      console.error("Delete leads error:", error);
      alert(
        "Failed to delete leads: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const deleteAllLeadsMutation = useMutation({
    mutationKey: ["Delete all leads"],
    mutationFn: deleteAllLeads,
    onSuccess: () => {
      queryclient.invalidateQueries(["Listleads"]);
      setdeletesuccessmodal(true);
      setTimeout(() => {
        setdeletesuccessmodal(false);
      }, 2000);
      setShowDeleteAllConfirm(false);
    },
    onError: (error) => {
      console.error("Delete all leads error:", error);
      alert(
        "Failed to delete all leads: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  const handleleadchange = async (leadId, status) => {
    await updatestatusmutation.mutateAsync({ leadId, status });
    setstatussuccessmodal(true);
    setTimeout(() => {
      setstatussuccessmodal(false);
    }, 2000);
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };
  //  update priority .............................................
  const updatingpriority = useMutation({
    mutationKey: ["Updatepriority"],
    mutationFn: updatepriority,
    onSuccess: () => {
      queryclient.invalidateQueries(["Opencustomers"]);
    },
  });

  // handle Priority  ........................................
  const handlepriority = async (customerId, priority) => {
    await updatingpriority.mutateAsync({ customerId, priority });
    setstatussuccessmodal(true);
    setTimeout(() => {
      setstatussuccessmodal(false);
    }, 2000);
  };
  // ................................................................................
  const handleDeleteSelected = () => {
    if (selectedLeads.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = async () => {
    await deleteLeadsMutation.mutateAsync({ leadIds: selectedLeads });
    setShowDeleteConfirm(false);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
  };

  const confirmDeleteAllLeads = async () => {
    await deleteAllLeadsMutation.mutateAsync();
  };

  const handleDownloadLeads = async () => {
    const leadsToDownload = await listleads({
      priority: priorityfilter !== "Priority" ? priorityfilter : undefined,
      status: statusfilter.length > 0 ? statusfilter : undefined,
      assignedTo:
        assignedfilter !== "AssignedTo" ? assignedfilter : undefined,
      role,
      metadataUser: metadata,
      searchText,
      startDate: dateRange.start ? dateRange.start.toISOString() : undefined,
      endDate: dateRange.end ? dateRange.end.toISOString() : undefined,
        sortBy: leadvaluefilter !== "Sort By" ? leadvaluefilter : undefined,
        limit: totalLeads, // Fetch all leads
        role,
    });

    if (leadsToDownload?.leads?.length > 0) {
      const headers = [
        "Name",
        "Mobile",
        "Email",
        "Source",
        "Location",
        "Interested Product",
        "Lead Value",
        "Created By",
        "Assigned To",
        "Status",
        "Priority",
        "Created At",
      ];
      const data = leadsToDownload.leads.map((lead) => [
        lead.name || "",
        lead.mobile || "",
        lead.email || "",
        lead.source?.title || "",
        lead.location || "",
        lead.interestedproduct || "",
        lead.leadvalue || "",
        lead.createdBy?.name || "",
        lead.assignedTo?.name || "",
        lead.status || "",
        lead.priority || "",
        new Date(lead.createdAt).toLocaleDateString() || "",
      ]);

      if (downloadFormat === "csv") {
        const csvContent = [
          headers.join(","),
          ...data.map((row) => row.map((cell) => `"${cell}"`).join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        if (link.href) {
          URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "leads.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (downloadFormat === "xlsx") {
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");
        XLSX.writeFile(wb, "leads.xlsx");
      }
    }
  };

  const totalLeads = fetchleads?.totalLeads || 0;
  const totalPages = fetchleads?.totalPages || 1;
  const allAgentsSubAdminsLeadCounts = fetchleads?.allAgentsSubAdminsLeadCounts || [];
  const totalAssignedLeads = fetchleads?.totalAssignedLeads || 0;
  const totalCreatedLeads = fetchleads?.totalCreatedLeads || 0;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setcurrentpage(page);
      setSelectedLeads([]); // Clear selections when changing pages
    }
  };
  const sortedLeads = [...(fetchleads?.leads || [])].sort((a, b) => {
    const orderA = statusOrder[a.status] || 99;
    const orderB = statusOrder[b.status] || 99;
    return orderA - orderB;
  });
  return (
    <div className="fixed inset-0 z-40 flex overflow-x-hidden bg-gray-50">
      {/* Sidebar */}
      <motion.div
        animate={{ x: sidebarVisible ? 0 : -260 }}
        transition={{ duration: 0.3 }}
        className="w-64 h-full fixed top-0 left-0 z-50"
      >
        <Sidebar />
      </motion.div>

      {/* Main Content */}
      <motion.div
        animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 h-screen overflow-y-auto"
      >
        {fetchstaffs.isLoading && <Spinner />}
        {updatestatusmutation.isPending && <Spinner />}
        {deleteLeadsMutation.isPending && <Spinner />}
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-white shadow sticky top-0 z-30 border-b">
            <div className="flex items-center mb-4 sm:mb-0">
              <button
                className="mr-2 sm:mr-4 text-blue-600 hover:text-blue-800 transition"
                onClick={() => setsidebarVisible(!sidebarVisible)}
              >
                <FaBars className="text-lg sm:text-xl md:text-2xl" />
              </button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Leads
              </h3>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Icons />
            </div>
{/* changed saviyo ........................................................................................ */}
            {role  && !metadata && (
              // ..............................................................
              <button
                className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 md:p-5 rounded-full shadow-lg transform hover:-translate-y-2 transition-all duration-300 z-40"
                onClick={() => dispatch(toggleCustomermodal())}
              >
                <FaPlusCircle className="text-base sm:text-lg md:text-xl text-white" />
              </button>
            )}
          </div>
          
          <div className="flex justify-between items-center  p-2 flex-wrap gap-y-3">
            {/* Left side: Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="relative status-dropdown">
                <button
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  className="min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:border-blue-400 flex items-center justify-between"
                >
                  <span>
                    {statusfilter.length > 0
                      ? `${statusfilter.length} selected`
                      : "Status"
                    }
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {["new", "open", "converted", "walkin", "paused", "rejected", "unavailable"].map((status) => (
                      <label key={status} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={statusfilter.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setstatusfilter([...statusfilter, status]);
                            } else {
                              setstatusfilter(statusfilter.filter(s => s !== status));
                            }
                          }}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                )}
                
              </div>
              {/* ✅ FIXED: Date Range Dropdown correctly overlays table */}
<div className="z-[20] min-w-[140px] relative status-dropdown">

  <DateRangeDropdown
    onDateRangeChange={(start, end) => {
      setDateRange({ start, end });
    }}
  />
</div>


              {/* Priority Filter */}
              <select
                value={priorityfilter}
                onChange={(e) => setpriorityfilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition duration-200 hover:border-blue-400"
              >
                <option>Priority</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
                <option value="Not Assigned">Not Assigned</option>
              </select>

              {/* Assigned To Filter */}
              <select
                value={assignedfilter}
                onChange={(e) => setassignedfilter(e.target.value)}
                className="min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:border-blue-400"
              >
                <option value="AssignedTo">Assigned To</option>
                {assignedStaff?.map((staff) => (
                  <option key={staff._id} value={staff._id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Right side: Search */}
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {showsearch && (
                  <motion.input
                    key="search-input"
                    type="text"
                    value={searchText}
                    onChange={(e) => setsearchText(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all w-40 sm:w-56"
                    placeholder="Search..."
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              <button
                className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
                onClick={() => setshowsearch(!showsearch)}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* New section for lead counts (Admin only) */}
          {role === "Admin" && allAgentsSubAdminsLeadCounts.length > 0 && (
            <div className="p-4  sm:p-6 bg-gray-100">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Agent/Sub-Admin Lead Summary</h4>
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Leads</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Leads</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allAgentsSubAdminsLeadCounts.map((staff) => (
                      <tr key={staff.userId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{staff.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.assignedCount || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.createdCount || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Table Content */}
          <div className="flex-grow p-4 sm:p-1 bg-gray-100">
            <div className="flex justify-end mb-1 gap-2">
              { (
                <button
                  onClick={() => dispatch(toggleUploadcsvmodal())}
                  className="flex items-center gap-2 bg-blue-600 text-white px-1 py-2 rounded-lg hover:bg-blue-700 transition-shadow shadow-md"
                >
                  <CloudUpload size={18} />
                  Upload
                </button>
              )}
              <div className="flex items-center gap-2">
                <select
                  value={downloadFormat}
                  onChange={(e) => setDownloadFormat(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition duration-200 hover:border-blue-400"
                >
                  <option value="csv">CSV</option>
                  <option value="xlsx">Excel</option>
                </select>
                <button
                  onClick={handleDownloadLeads}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-shadow shadow-md"
                >
                  Download
                </button>
              </div>
              {selectedLeads.length > 0 && role  && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-shadow shadow-md"
                >
                  <Trash2 size={18} />
                  Delete Selected
                </motion.button>
              )}
              {role === "Admin" && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowDeleteAllConfirm(true)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-shadow shadow-md"
                >
                  <Trash2 size={18} />
                  Delete All Leads
                </motion.button>
              )}
            </div>
            {isLoading ? (
              <Spinner />
            ) : fetchleads?.leads?.length > 0 ? (
              <>
                <div className="overflow-x-auto w-full bg-white p-3 sm:p-4 rounded-xl shadow-lg">
                  <div className="max-h-[70vh] sm:max-h-[75vh] overflow-y-auto">
                    <table className="w-full table-auto border-collapse text-xs sm:text-sm min-w-[800px]">
                      <thead className="sticky top-0 bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white text-xs sm:text-sm uppercase z-10">
                        <tr>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            {role && (
                              <input
                                type="checkbox"
                                checked={
                                  selectedLeads.length ===
                                    fetchleads?.leads?.length &&
                                  fetchleads?.leads?.length > 0
                                }
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLeads(
                                      sortedLeads.map((lead) => lead._id)
                                    );
                                  } else {
                                    setSelectedLeads([]);
                                  }
                                }}
                                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              />
                            )}
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Sl No
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Name
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Phone Number
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Created By
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Assigned To
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Created
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Source
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            priority
                          </th>

                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Location
                          </th>
                          <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
                            Status
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {sortedLeads.map((lead, index) => (
                          <motion.tr
                            key={lead._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="bg-white even:bg-gray-50 hover:bg-blue-50 text-xs sm:text-sm"
                          >
                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              {role && (
                                <input
                                  type="checkbox"
                                  checked={selectedLeads.includes(lead._id)}
                                  onChange={() => handleSelectLead(lead._id)}
                                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                              )}
                            </td>
                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              {(currentpage - 1) * leadsperpage + index + 1}
                            </td>
                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              <button
                                className="text-blue-700 font-semibold hover:underline"
                                onClick={() =>
                                  dispatch(toggleCustomerdetailmodal(lead))
                                }
                              >
                                {lead.name}
                              </button>
                            </td>

                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              {lead.mobile}
                            </td>
                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              {lead.createdBy?.name}
                            </td>
                            <td className="py-2 sm:py-4 px-2 sm:px-4 text-gray-600 align-middle">
                              {lead.assignedTo?.name || (
                                <span className="italic text-gray-400">
                                  Not yet assigned
                                </span>
                              )}
                            </td>
                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              {lead.createdAt
                                ? new Date(lead.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </td>

                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              {lead.source?.title || "N/A"}
                            </td>
                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              <select
                                className={`border p-1 sm:p-2 rounded-md bg-gray-100 hover:bg-white focus:ring-2 focus:ring-blue-400 transition text-xs sm:text-sm w-full
                                 ${priorityColor[lead.priority] || ""} `}
                                value={lead.priority}
                                disabled={!!metadata}
                                onChange={(e) =>
                                  handlepriority(lead._id, e.target.value)
                                }
                              >
                                <option value="hot" className="">
                                  Hot
                                </option>
                                <option value="warm">Warm</option>
                                <option value="cold">Cold</option>
                                <option value="Not Assigned">
                                  Not Assigned
                                </option>
                              </select>
                            </td>
                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              {lead.location || "N/A"}
                            </td>

                            <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
                              <select
                                className={`border p-1 sm:p-2 rounded-md hover:bg-white focus:ring-2 focus:ring-blue-400 transition text-xs sm:text-sm w-full 
      ${statusColors[lead.status] || ""}`}
                                value={lead.status}
                                disabled={!!metadata}
                                onChange={(e) =>
                                  handleleadchange(lead._id, e.target.value)
                                }
                              >
                                <option
                                  value="new"
                                  className={statusColors.new}
                                >
                                  New
                                </option>
                                <option
                                  value="open"
                                  className={statusColors.open}
                                >
                                  Open
                                </option>
                                <option
                                  value="converted"
                                  className={statusColors.converted}
                                >
                                  Converted
                                </option>
                                <option
                                  value="walkin"
                                  className={statusColors.walkin}
                                >
                                  Walk In
                                </option>
                                <option
                                  value="paused"
                                  className={statusColors.paused}
                                >
                                  Paused
                                </option>
                                <option
                                  value="rejected"
                                  className={statusColors.rejected}
                                >
                                  Rejected
                                </option>
                                <option
                                  value="unavailable"
                                  className={statusColors.unavailable}
                                >
                                  Unavailable
                                </option>
                              </select>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {assignedfilter === "AssignedTo" && <div className="flex justify-center gap-2 mt-4">
<div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 p-3 sm:p-4 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
  {/* ⬅️ Prev */}
  <button
    disabled={currentpage === 1}
    onClick={() => handlePageChange(currentpage - 1)}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      currentpage === 1
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow"
    }`}
  >
    ← Prev
  </button>

  {/* 🔢 Dynamic Page Numbers (smart window) */}
  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 ||
        page === totalPages ||
        (page >= currentpage - 2 && page <= currentpage + 2)
    )
    .map((page, index, arr) => {
      const showEllipsis =
        index > 0 && page - arr[index - 1] > 1;
      return (
        <React.Fragment key={page}>
          {showEllipsis && (
            <span className="px-2 text-gray-400 select-none">…</span>
          )}
          <button
            onClick={() => handlePageChange(page)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentpage === page
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        </React.Fragment>
      );
    })}

  {/* ➡️ Next */}
  <button
    disabled={currentpage === totalPages}
    onClick={() => handlePageChange(currentpage + 1)}
    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      currentpage === totalPages
        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:scale-105 hover:shadow"
    }`}
  >
    Next →
  </button>

  {/* 🔍 Page Jump */}
  <div className="flex items-center gap-2 ml-4">
    <input
      type="number"
      min="1"
      max={totalPages}
      placeholder="Page #"
      className="w-16 sm:w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const page = Number(e.target.value);
          if (page >= 1 && page <= totalPages) {
            handlePageChange(page);
          } else {
            alert(`Enter a number between 1 and ${totalPages}`);
          }
        }
      }}
    />
    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
      Page <strong>{currentpage}</strong> of {totalPages}
    </span>
  </div>
</div>

 </div>}
              </>
            ) : (
              <p className="text-gray-500 text-center text-sm sm:text-lg py-4 sm:py-6">
                {totalLeads > 0
                  ? `No leads available on page ${currentpage}. Try adjusting filters or navigating to another page.`
                  : "No Leads Available"}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {isCustomermodal && (
          <motion.div
            key="leads"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <motion.div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 w-full max-w-md sm:max-w-lg">
              <Customermodal />
            </div>
          </motion.div>
        )}
        {isUploadcsvmodal  && (
          <motion.div
            key="upload-csv"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <motion.div className="absolute inset-0 backdrop-blur-md bg-black opacity-50" />
            <div className="relative z-10 w-full max-w-md sm:max-w-lg">
              <Uploadcsvmodal />
            </div>
          </motion.div>
        )}
        {statussuccessmodal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <motion.div className="absolute inset-0 bg-black opacity-30" />
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 bg-green-100 text-green-700 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-2xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm md:max-w-md h-[100px] sm:h-[120px] flex items-center justify-center text-center"
            >
              Status Updated Successfully!
            </motion.div>
          </motion.div>
        )}
        {deletesuccessmodal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <motion.div className="absolute inset-0 bg-black opacity-30" />
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 bg-green-100 text-green-700 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-2xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm md:max-w-md h-[100px] sm:h-[120px] flex items-center justify-center text-center"
            >
              Leads Deleted Successfully!
            </motion.div>
          </motion.div>
        )}
        {showDeleteConfirm && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center w-full max-w-xs sm:max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
                Are you sure you want to delete {selectedLeads.length} lead(s)?
              </h3>
              <div className="flex gap-2 sm:gap-4 justify-center">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
                >
                  Yes
                </button>
                <button
                  onClick={closeDeleteConfirm}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
                >
                  No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {iscustomerdetailmodal && (
          <motion.div
            key="customer-detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <motion.div className="absolute inset-0 bg-black opacity-50" />
            <div className="relative z-10 w-full max-w-md sm:max-w-lg">
              <Customerdetailmodal />
            </div>
          </motion.div>
        )}
        {showDeleteAllConfirm && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center w-full max-w-xs sm:max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
                Are you absolutely sure you want to delete ALL leads?
              </h3>
              <div className="flex gap-2 sm:gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteAllConfirm(false);
                    setShowSecondDeleteAllConfirm(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
                >
                  Yes, I'm Sure
                </button>
                <button
                  onClick={() => setShowDeleteAllConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSecondDeleteAllConfirm && (
          <motion.div
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center w-full max-w-xs sm:max-w-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
                This action is irreversible. Confirm deletion of ALL leads?
              </h3>
              <div className="flex gap-2 sm:gap-4 justify-center">
                <button
                  onClick={confirmDeleteAllLeads}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
                >
                  Confirm Delete All
                </button>
                <button
                  onClick={() => setShowSecondDeleteAllConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Subadminleads;






// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import { FaBars, FaPlusCircle, FaSearch } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   toggleCustomerdetailmodal,
//   toggleCustomermodal,
//   toggleUploadcsvmodal,
// } from "../redux/modalSlice";
// import Customermodal from "../components/Customermodal";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Customerdetailmodal from "../components/Customerdetailmodal";
// import { AnimatePresence, motion } from "framer-motion";
// import {
//   deletemultipleleads,
//   listleads,
//   updateleadstatus,
//   updatepriority,
//   deleteAllLeads,
// } from "../services/leadsRouter";
// import Icons from "./Icons";
// import { liststaffs } from "../services/staffRouter";
// import Spinner from "../components/Spinner";
// import Uploadcsvmodal from "../components/Uploadcsvmodal";
// import { CloudUpload, Trash2 } from "lucide-react";
// import DateRangeDropdown from "../components/DateRangeDropdown";
// import * as XLSX from "xlsx";

// function Subadminleads() {
//   const queryclient = useQueryClient();
//   const dispatch = useDispatch();
//   const [downloadFormat, setDownloadFormat] = useState("csv");

//   const statusColors = {
//     new: "bg-blue-100 text-blue-700 font-semibold",
//     open: "bg-yellow-100 text-yellow-700 font-semibold",
//     converted: "bg-green-100 text-green-700 font-semibold",
//     walkin: "bg-purple-100 text-purple-700 font-semibold",
//     paused: "bg-orange-100 text-orange-700 font-semibold",
//     rejected: "bg-red-100 text-red-700 font-semibold",
//     unavailable: "bg-gray-200 text-gray-600 font-semibold",
//   };

//   const priorityColor = {
//     hot: "bg-red-100 text-red-700 font-semibold",
//     warm: "bg-yellow-100 text-yellow-700 font-semibold",
//     cold: "bg-purple-100 text-purple-700 font-semibold",
//   };

//   const statusOrder = {
//     new: 1,
//     open: 2,
//     converted: 3,
//     walkin: 4,
//     paused: 5,
//     rejected: 6,
//     unavailable: 7,
//   };

//   const isCustomermodal = useSelector((state) => state.modal.customerModal);
//   const iscustomerdetailmodal = useSelector(
//     (state) => state.modal.customerdetailModal
//   );
//   const isUploadcsvmodal = useSelector((state) => state.modal.uploadcsvModal);
//   const role = useSelector((state) => state.auth.role);
//   const metadata = useSelector((state) => state.auth.metadataUser);

//   const [sidebarVisible, setsidebarVisible] = useState(true);
//   const [statussuccessmodal, setstatussuccessmodal] = useState(false);
//   const [deletesuccessmodal, setdeletesuccessmodal] = useState(false);
//   const [showsearch, setshowsearch] = useState(false);

//   const [priorityfilter, setpriorityfilter] = useState("Priority");
//   const [statusfilter, setstatusfilter] = useState(["new"]);
//   const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
//   const [assignedfilter, setassignedfilter] = useState("AssignedTo");
//   const [leadvaluefilter, setleadvaluefilter] = useState("Sort By");
//   const [dateRange, setDateRange] = useState({ start: null, end: null });
//   const [searchText, setsearchText] = useState("");
//   const [currentpage, setcurrentpage] = useState(1);
//   const [selectedLeads, setSelectedLeads] = useState([]);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
//   const [showSecondDeleteAllConfirm, setShowSecondDeleteAllConfirm] =
//     useState(false);
//   const leadsperpage = 10;

//   useEffect(() => {
//     setcurrentpage(1);
//   }, [
//     priorityfilter,
//     statusfilter,
//     assignedfilter,
//     searchText,
//     dateRange,
//     leadvaluefilter,
//   ]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".status-dropdown")) {
//         setIsStatusDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const { data: fetchleads, isLoading } = useQuery({
//     queryKey: [
//       "Listleads",
//       currentpage,
//       priorityfilter,
//       statusfilter,
//       assignedfilter,
//       searchText,
//       dateRange,
//       leadvaluefilter,
//       role,
//       metadata,
//     ],
//     queryFn: () =>
//       listleads({
//         page: currentpage,
//         limit: leadsperpage,
//         priority: priorityfilter !== "Priority" ? priorityfilter : undefined,
//         status: statusfilter.length > 0 ? statusfilter : undefined,
//         assignedTo: assignedfilter !== "AssignedTo" ? assignedfilter : undefined,
//         searchText,
//         startDate: dateRange.start ? dateRange.start.toISOString() : undefined,
//         endDate: dateRange.end ? dateRange.end.toISOString() : undefined,
//         sortBy: leadvaluefilter !== "Sort By" ? leadvaluefilter : undefined,
//         role,
//         metadataUser: metadata,
//       }),
//     keepPreviousData: true,
//   });

//   const fetchstaffs = useQuery({
//     queryKey: ["Liststaffs"],
//     queryFn: liststaffs,
//   });

//   const staffs =
//     (fetchstaffs.data && (fetchstaffs.data.data ?? fetchstaffs.data)) || [];
//   const assignedStaffIds = [
//     ...new Set(
//       (fetchleads?.leads || [])
//         .map((lead) => lead.assignedTo?._id)
//         .filter(Boolean)
//     ),
//   ];
//   const assignedStaff = staffs.filter((s) => assignedStaffIds.includes(s._id));

//   const updatestatusmutation = useMutation({
//     mutationKey: ["Update lead status"],
//     mutationFn: updateleadstatus,
//     onSuccess: () => {
//       queryclient.invalidateQueries(["Listleads"]);
//     },
//   });

//   const deleteLeadsMutation = useMutation({
//     mutationKey: ["Delete leads"],
//     mutationFn: deletemultipleleads,
//     onSuccess: () => {
//       queryclient.invalidateQueries(["Listleads"]);
//       setSelectedLeads([]);
//       setdeletesuccessmodal(true);
//       setTimeout(() => {
//         setdeletesuccessmodal(false);
//       }, 2000);
//     },
//     onError: (error) => {
//       console.error("Delete leads error:", error);
//       alert(
//         "Failed to delete leads: " +
//           (error.response?.data?.message || error.message)
//       );
//     },
//   });

//   const deleteAllLeadsMutation = useMutation({
//     mutationKey: ["Delete all leads"],
//     mutationFn: deleteAllLeads,
//     onSuccess: () => {
//       queryclient.invalidateQueries(["Listleads"]);
//       setdeletesuccessmodal(true);
//       setTimeout(() => {
//         setdeletesuccessmodal(false);
//       }, 2000);
//       setShowDeleteAllConfirm(false);
//     },
//     onError: (error) => {
//       console.error("Delete all leads error:", error);
//       alert(
//         "Failed to delete all leads: " +
//           (error.response?.data?.message || error.message)
//       );
//     },
//   });

//   const handleleadchange = async (leadId, status) => {
//     await updatestatusmutation.mutateAsync({ leadId, status });
//     setstatussuccessmodal(true);
//     setTimeout(() => {
//       setstatussuccessmodal(false);
//     }, 2000);
//   };

//   const handleSelectLead = (leadId) => {
//     setSelectedLeads((prev) =>
//       prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
//     );
//   };

//   const updatingpriority = useMutation({
//     mutationKey: ["Updatepriority"],
//     mutationFn: updatepriority,
//     onSuccess: () => {
//       queryclient.invalidateQueries(["Opencustomers"]);
//     },
//   });

//   const handlepriority = async (customerId, priority) => {
//     await updatingpriority.mutateAsync({ customerId, priority });
//     setstatussuccessmodal(true);
//     setTimeout(() => {
//       setstatussuccessmodal(false);
//     }, 2000);
//   };

//   const handleDeleteSelected = () => {
//     if (selectedLeads.length > 0) {
//       setShowDeleteConfirm(true);
//     }
//   };

//   const confirmDelete = async () => {
//     await deleteLeadsMutation.mutateAsync({ leadIds: selectedLeads });
//     setShowDeleteConfirm(false);
//   };

//   const closeDeleteConfirm = () => {
//     setShowDeleteConfirm(false);
//   };

//   const confirmDeleteAllLeads = async () => {
//     await deleteAllLeadsMutation.mutateAsync();
//     setShowSecondDeleteAllConfirm(false);
//   };

//   const totalLeads = fetchleads?.totalLeads || 0;
//   const totalPages = fetchleads?.totalPages || 1;
//   const allAgentsSubAdminsLeadCounts = fetchleads?.allAgentsSubAdminsLeadCounts || [];
//   const sortedLeads = [...(fetchleads?.leads || [])].sort((a, b) => {
//     const orderA = statusOrder[a.status] || 99;
//     const orderB = statusOrder[b.status] || 99;
//     return orderA - orderB;
//   });

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setcurrentpage(page);
//       setSelectedLeads([]);
//     }
//   };

//   const escapeCsvCell = (cell) => {
//     if (cell === null || cell === undefined) return "";
//     const str = String(cell);
//     if (str.includes('"')) {
//       return `${str.replace(/"/g, '""')}`;
//     }
//     if (str.includes(",") || str.includes("\n")) {
//       return "${str}";
//     }
//     return str;
//   };

//   const handleDownloadLeads = async () => {
//     const leadsToDownload = await listleads({
//       priority: priorityfilter !== "Priority" ? priorityfilter : undefined,
//       status: statusfilter.length > 0 ? statusfilter : undefined,
//       assignedTo: assignedfilter !== "AssignedTo" ? assignedfilter : undefined,
//       role,
//       metadataUser: metadata,
//       searchText,
//       startDate: dateRange.start ? dateRange.start.toISOString() : undefined,
//       endDate: dateRange.end ? dateRange.end.toISOString() : undefined,
//       sortBy: leadvaluefilter !== "Sort By" ? leadvaluefilter : undefined,
//       limit: totalLeads || 10000,
//     });

//     if (leadsToDownload?.leads?.length > 0) {
//       const headers = [
//         "Name",
//         "Mobile",
//         "Email",
//         "Source",
//         "Location",
//         "Interested Product",
//         "Lead Value",
//         "Created By",
//         "Assigned To",
//         "Status",
//         "Priority",
//         "Created At",
//       ];
//       const data = leadsToDownload.leads.map((lead) => [
//         lead.name || "",
//         lead.mobile || "",
//         lead.email || "",
//         lead.source?.title || "",
//         lead.location || "",
//         lead.interestedproduct || "",
//         lead.leadvalue || "",
//         lead.createdBy?.name || "",
//         lead.assignedTo?.name || "",
//         lead.status || "",
//         lead.priority || "",
//         lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "",
//       ]);

//       if (downloadFormat === "csv") {
//         const csvRows = [headers.join(",")];
//         data.forEach((row) => {
//           csvRows.push(row.map(escapeCsvCell).join(","));
//         });
//         const csvContent = csvRows.join("\n");
//         const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//         const link = document.createElement("a");
//         if (link.href) {
//           URL.revokeObjectURL(link.href);
//         }
//         link.href = URL.createObjectURL(blob);
//         link.setAttribute("download", "leads.csv");
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       } else if (downloadFormat === "xlsx") {
//         const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, "Leads");
//         XLSX.writeFile(wb, "leads.xlsx");
//       }
//     } else {
//       alert("No leads to download.");
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-40 flex overflow-x-hidden bg-gray-50">
//       <motion.div
//         animate={{ x: sidebarVisible ? 0 : -260 }}
//         transition={{ duration: 0.3 }}
//         className="w-64 h-full fixed top-0 left-0 z-50"
//       >
//         <Sidebar />
//       </motion.div>

//       <motion.div
//         animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
//         transition={{ duration: 0.3 }}
//         className="flex-1 h-screen overflow-y-auto"
//       >
//         {fetchstaffs.isLoading && <Spinner />}
//         {updatestatusmutation.isLoading && <Spinner />}
//         {deleteLeadsMutation.isLoading && <Spinner />}
//         <div className="flex flex-col min-h-screen">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 bg-white shadow sticky top-0 z-30 border-b">
//             <div className="flex items-center mb-4 sm:mb-0">
//               <button
//                 className="mr-2 sm:mr-4 text-blue-600 hover:text-blue-800 transition"
//                 onClick={() => setsidebarVisible(!sidebarVisible)}
//               >
//                 <FaBars className="text-lg sm:text-xl md:text-2xl" />
//               </button>
//               <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
//                 Leads
//               </h3>
//             </div>
//             <div className="flex items-center space-x-2 sm:space-x-4">
//               <Icons />
//             </div>
//             {role !== "Agent" && !metadata && (
//               <button
//                 className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 md:p-5 rounded-full shadow-lg transform hover:-translate-y-2 transition-all duration-300 z-40"
//                 onClick={() => dispatch(toggleCustomermodal())}
//               >
//                 <FaPlusCircle className="text-base sm:text-lg md:text-xl text-white" />
//               </button>
//             )}
//           </div>

//           <div className="flex justify-between items-center p-2 flex-wrap gap-y-3">
//             <div className="flex flex-wrap gap-3">
//               <div className="relative status-dropdown">
//                 <button
//                   onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
//                   className="min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:border-blue-400 flex items-center justify-between"
//                 >
//                   <span>
//                     {statusfilter.length > 0
//                       ? `${statusfilter.length} selected`
//                       : "Status"}
//                   </span>
//                   <svg
//                     className={`w-4 h-4 transition-transform ${
//                       isStatusDropdownOpen ? "rotate-180" : ""
//                     }`}
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M19 9l-7 7-7-7"
//                     />
//                   </svg>
//                 </button>
//                 {isStatusDropdownOpen && (
//                   <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                     {[
//                       "new",
//                       "open",
//                       "converted",
//                       "walkin",
//                       "paused",
//                       "rejected",
//                       "unavailable",
//                     ].map((status) => (
//                       <label
//                         key={status}
//                         className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
//                       >
//                         <input
//                           type="checkbox"
//                           checked={statusfilter.includes(status)}
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               setstatusfilter([...statusfilter, status]);
//                             } else {
//                               setstatusfilter(statusfilter.filter((s) => s !== status));
//                             }
//                           }}
//                           className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                         />
//                         <span className="text-sm text-gray-700 capitalize">
//                           {status}
//                         </span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="z-[20] min-w-[160px] relative">
//                 <DateRangeDropdown
//                   onDateRangeChange={(start, end) => {
//                     setDateRange({ start, end });
//                   }}
//                 />
//               </div>

//               <select
//                 value={priorityfilter}
//                 onChange={(e) => setpriorityfilter(e.target.value)}
//                 className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition duration-200 hover:border-blue-400"
//               >
//                 <option>Priority</option>
//                 <option value="hot">Hot</option>
//                 <option value="warm">Warm</option>
//                 <option value="cold">Cold</option>
//                 <option value="Not Assigned">Not Assigned</option>
//               </select>

//               <select
//                 value={assignedfilter}
//                 onChange={(e) => setassignedfilter(e.target.value)}
//                 className="min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:border-blue-400"
//               >
//                 <option value="AssignedTo">Assigned To</option>
//                 {assignedStaff?.map((staff) => (
//                   <option key={staff._id} value={staff._id}>
//                     {staff.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex items-center gap-2">
//               <AnimatePresence>
//                 {showsearch && (
//                   <motion.input
//                     key="search-input"
//                     type="text"
//                     value={searchText}
//                     onChange={(e) => setsearchText(e.target.value)}
//                     className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all w-40 sm:w-56"
//                     placeholder="Search..."
//                     initial={{ opacity: 0, width: 0 }}
//                     animate={{ opacity: 1, width: "auto" }}
//                     exit={{ opacity: 0, width: 0 }}
//                     transition={{ duration: 0.3 }}
//                   />
//                 )}
//               </AnimatePresence>
//               <button
//                 className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition"
//                 onClick={() => setshowsearch(!showsearch)}
//               >
//                 <FaSearch />
//               </button>
//             </div>
//           </div>

//           {role === "Admin" && allAgentsSubAdminsLeadCounts.length > 0 && (
//             <div className="p-4 sm:p-6 bg-gray-100">
//               <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
//                 Agent/Sub-Admin Lead Summary
//               </h4>
//               <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Role
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Assigned Leads
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created Leads
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {allAgentsSubAdminsLeadCounts.map((staff) => (
//                       <tr key={staff.userId}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {staff.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {staff.role}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {staff.assignedCount || 0}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {staff.createdCount || 0}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           <div className="flex-grow p-4 sm:p-1 bg-gray-100">
//             <div className="flex justify-end mb-1 gap-2">
//               <button
//                 onClick={() => dispatch(toggleUploadcsvmodal())}
//                 className="flex items-center gap-2 bg-blue-600 text-white px-1 py-2 rounded-lg hover:bg-blue-700 transition-shadow shadow-md"
//               >
//                 <CloudUpload size={18} />
//                 Upload
//               </button>
//               <div className="flex items-center gap-2">
//                 <select
//                   value={downloadFormat}
//                   onChange={(e) => setDownloadFormat(e.target.value)}
//                   className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition duration-200 hover:border-blue-400"
//                 >
//                   <option value="csv">CSV</option>
//                   <option value="xlsx">Excel</option>
//                 </select>
//                 <button
//                   onClick={handleDownloadLeads}
//                   className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-shadow shadow-md"
//                 >
//                   Download
//                 </button>
//               </div>
//               {selectedLeads.length > 0 && role !== "Agent" && (
//                 <motion.button
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ duration: 0.3 }}
//                   onClick={handleDeleteSelected}
//                   className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-shadow shadow-md"
//                 >
//                   <Trash2 size={18} />
//                   Delete Selected
//                 </motion.button>
//               )}
//               {role === "Admin" && (
//                 <motion.button
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: 20 }}
//                   transition={{ duration: 0.3 }}
//                   onClick={() => setShowDeleteAllConfirm(true)}
//                   className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-shadow shadow-md"
//                 >
//                   <Trash2 size={18} />
//                   Delete All Leads
//                 </motion.button>
//               )}
//             </div>

//             {isLoading ? (
//               <Spinner />
//             ) : fetchleads?.leads?.length > 0 ? (
//               <>
//                 <div className="overflow-x-auto w-full bg-white p-3 sm:p-4 rounded-xl shadow-lg">
//                   <div className="max-h-[70vh] sm:max-h-[75vh] overflow-y-auto">
//                     <table className="w-full table-auto border-collapse text-xs sm:text-sm min-w-[800px]">
//                       <thead className="sticky top-0 bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white text-xs sm:text-sm uppercase z-10">
//                         <tr>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">
//                             {role !== "Agent" && (
//                               <input
//                                 type="checkbox"
//                                 checked={
//                                   selectedLeads.length === sortedLeads.length &&
//                                   sortedLeads.length > 0
//                                 }
//                                 onChange={(e) => {
//                                   if (e.target.checked) {
//                                     setSelectedLeads(sortedLeads.map((lead) => lead._id));
//                                   } else {
//                                     setSelectedLeads([]);
//                                   }
//                                 }}
//                                 className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                               />
//                             )}
//                           </th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Sl No</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Name</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Phone Number</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Created By</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Assigned To</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Created</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Source</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">priority</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Location</th>
//                           <th className="py-2 sm:py-3 px-2 sm:px-4 text-left">Status</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {sortedLeads.map((lead, index) => (
//                           <motion.tr
//                             key={lead._id}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.4, delay: index * 0.05 }}
//                             className="bg-white even:bg-gray-50 hover:bg-blue-50 text-xs sm:text-sm"
//                           >
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
//                               {role !== "Agent" && (
//                                 <input
//                                   type="checkbox"
//                                   checked={selectedLeads.includes(lead._id)}
//                                   onChange={() => handleSelectLead(lead._id)}
//                                   className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                                 />
//                               )}
//                             </td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
//                               {(currentpage - 1) * leadsperpage + index + 1}
//                             </td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
//                               <button
//                                 className="text-blue-700 font-semibold hover:underline"
//                                 onClick={() => dispatch(toggleCustomerdetailmodal(lead))}
//                               >
//                                 {lead.name}
//                               </button>
//                             </td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">{lead.mobile}</td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">{lead.createdBy?.name}</td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 text-gray-600 align-middle">
//                               {lead.assignedTo?.name || <span className="italic text-gray-400">Not yet assigned</span>}
//                             </td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
//                               {lead.createdAt
//                                 ? new Date(lead.createdAt).toLocaleDateString("en-US", {
//                                     year: "numeric",
//                                     month: "short",
//                                     day: "numeric",
//                                   })
//                                 : "N/A"}
//                             </td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">{lead.source?.title || "N/A"}</td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
//                               <select
//                                 className={`border p-1 sm:p-2 rounded-md bg-gray-100 hover:bg-white focus:ring-2 focus:ring-blue-400 transition text-xs sm:text-sm w-full ${priorityColor[lead.priority] || ""}`}
//                                 value={lead.priority}
//                                 disabled={!!metadata}
//                                 onChange={(e) => handlepriority(lead._id, e.target.value)}
//                               >
//                                 <option value="hot">Hot</option>
//                                 <option value="warm">Warm</option>
//                                 <option value="cold">Cold</option>
//                                 <option value="Not Assigned">Not Assigned</option>
//                               </select>
//                             </td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">{lead.location || "N/A"}</td>
//                             <td className="py-2 sm:py-4 px-2 sm:px-4 align-middle">
//                               <select
//                                 className={`border p-1 sm:p-2 rounded-md hover:bg-white focus:ring-2 focus:ring-blue-400 transition text-xs sm:text-sm w-full ${statusColors[lead.status] || ""}`}
//                                 value={lead.status}
//                                 disabled={!!metadata}
//                                 onChange={(e) => handleleadchange(lead._id, e.target.value)}
//                               >
//                                 <option value="new" className={statusColors.new}>New</option>
//                                 <option value="open" className={statusColors.open}>Open</option>
//                                 <option value="converted" className={statusColors.converted}>Converted</option>
//                                 <option value="walkin" className={statusColors.walkin}>Walk In</option>
//                                 <option value="paused" className={statusColors.paused}>Paused</option>
//                                 <option value="rejected" className={statusColors.rejected}>Rejected</option>
//                                 <option value="unavailable" className={statusColors.unavailable}>Unavailable</option>
//                               </select>
//                             </td>
//                           </motion.tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="flex justify-center gap-2 mt-4">
//                   <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 p-3 sm:p-4 bg-white border border-gray-200 shadow-sm rounded-2xl transition-all duration-300 hover:shadow-md">
//                     <button
//                       disabled={currentpage === 1}
//                       onClick={() => handlePageChange(currentpage - 1)}
//                       className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
//                         currentpage === 1
//                           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                           : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-105 hover:shadow"
//                       }`}
//                     >
//                       ← Prev
//                     </button>

//                     {Array.from({ length: totalPages }, (_, i) => i + 1)
//                       .filter(
//                         (page) =>
//                           page === 1 ||
//                           page === totalPages ||
//                           (page >= currentpage - 2 && page <= currentpage + 2)
//                       )
//                       .map((page, index, arr) => {
//                         const showEllipsis = index > 0 && page - arr[index - 1] > 1;
//                         return (
//                           <React.Fragment key={page}>
//                             {showEllipsis && <span className="px-2 text-gray-400 select-none">…</span>}
//                             <button
//                               onClick={() => handlePageChange(page)}
//                               className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
//                                 currentpage === page
//                                   ? "bg-blue-600 text-white shadow-md scale-105"
//                                   : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           </React.Fragment>
//                         );
//                       })}

//                     <button
//                       disabled={currentpage === totalPages}
//                       onClick={() => handlePageChange(currentpage + 1)}
//                       className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
//                         currentpage === totalPages
//                           ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                           : "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:scale-105 hover:shadow"
//                       }`}
//                     >
//                       Next →
//                     </button>

//                     <div className="flex items-center gap-2 ml-4">
//                       <input
//                         type="number"
//                         min="1"
//                         max={totalPages}
//                         placeholder="Page #"
//                         className="w-16 sm:w-20 px-2 py-1.5 border border-gray-300 rounded-md text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
//                         onKeyDown={(e) => {
//                           if (e.key === "Enter") {
//                             const page = Number(e.target.value);
//                             if (page >= 1 && page <= totalPages) {
//                               handlePageChange(page);
//                             } else {
//                               alert('Enter a number between 1 and ' + totalPages);
//                             }
//                           }
//                         }}
//                       />
//                       <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
//                         Page <strong>{currentpage}</strong> of {totalPages}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <p className="text-gray-500 text-center text-sm sm:text-lg py-4 sm:py-6">
//                 {totalLeads > 0
//                   ? `No leads available on page ${currentpage}. Try adjusting filters or navigating to another page.`
//                   : "No Leads Available"}
//               </p>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       <AnimatePresence>
//         {isCustomermodal && (
//           <motion.div
//             key="leads"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
//           >
//             <motion.div className="absolute inset-0 bg-black opacity-50" />
//             <div className="relative z-10 w-full max-w-md sm:max-w-lg">
//               <Customermodal />
//             </div>
//           </motion.div>
//         )}

//         {isUploadcsvmodal && (
//           <motion.div
//             key="upload-csv"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
//           >
//             <motion.div className="absolute inset-0 backdrop-blur-md bg-black opacity-50" />
//             <div className="relative z-10 w-full max-w-md sm:max-w-lg">
//               <Uploadcsvmodal />
//             </div>
//           </motion.div>
//         )}

//         {statussuccessmodal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
//           >
//             <motion.div className="absolute inset-0 bg-black opacity-30" />
//             <motion.div
//               initial={{ scale: 0.5 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.5 }}
//               transition={{ type: "spring", stiffness: 300, damping: 20 }}
//               className="relative z-10 bg-green-100 text-green-700 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-2xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm md:max-w-md h-[100px] sm:h-[120px] flex items-center justify-center text-center"
//             >
//               Status Updated Successfully!
//             </motion.div>
//           </motion.div>
//         )}

//         {deletesuccessmodal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
//           >
//             <motion.div className="absolute inset-0 bg-black opacity-30" />
//             <motion.div
//               initial={{ scale: 0.5 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.5 }}
//               transition={{ type: "spring", stiffness: 300, damping: 20 }}
//               className="relative z-10 bg-green-100 text-green-700 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-2xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm md:max-w-md h-[100px] sm:h-[120px] flex items-center justify-center text-center"
//             >
//               Leads Deleted Successfully!
//             </motion.div>
//           </motion.div>
//         )}

//         {showDeleteConfirm && (
//           <motion.div
//             className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center w-full max-w-xs sm:max-w-sm"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
//                 Are you sure you want to delete {selectedLeads.length} lead(s)?
//               </h3>
//               <div className="flex gap-2 sm:gap-4 justify-center">
//                 <button
//                   onClick={confirmDelete}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
//                 >
//                   Yes
//                 </button>
//                 <button
//                   onClick={closeDeleteConfirm}
//                   className="bg-gray-300 hover:bg-gray-400 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
//                 >
//                   No
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         {iscustomerdetailmodal && (
//           <motion.div
//             key="customer-detail"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
//           >
//             <motion.div className="absolute inset-0 bg-black opacity-50" />
//             <div className="relative z-10 w-full max-w-md sm:max-w-lg">
//               <Customerdetailmodal />
//             </div>
//           </motion.div>
//         )}

//         {showDeleteAllConfirm && (
//           <motion.div
//             className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center w-full max-w-xs sm:max-w-sm"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
//                 Are you absolutely sure you want to delete ALL leads?
//               </h3>
//               <div className="flex gap-2 sm:gap-4 justify-center">
//                 <button
//                   onClick={() => {
//                     setShowDeleteAllConfirm(false);
//                     setShowSecondDeleteAllConfirm(true);
//                   }}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
//                 >
//                   Yes, I'm Sure
//                 </button>
//                 <button
//                   onClick={() => setShowDeleteAllConfirm(false)}
//                   className="bg-gray-300 hover:bg-gray-400 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}

//         {showSecondDeleteAllConfirm && (
//           <motion.div
//             className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <motion.div
//               className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-lg text-center w-full max-w-xs sm:max-w-sm"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ duration: 0.3 }}
//             >
//               <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
//                 This action is irreversible. Confirm deletion of ALL leads?
//               </h3>
//               <div className="flex gap-2 sm:gap-4 justify-center">
//                 <button
//                   onClick={confirmDeleteAllLeads}
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
//                 >
//                   Confirm Delete All
//                 </button>
//                 <button
//                   onClick={() => setShowSecondDeleteAllConfirm(false)}
//                   className="bg-gray-300 hover:bg-gray-400 text-black px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg transition text-xs sm:text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Subadminleads;