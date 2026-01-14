import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FaBars, FaSearch } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import Customerdetailmodal from "../components/Customerdetailmodal";
import {
  deletemultipleleads,
  listopencustomers,
  updateleadstatus,
  updatepriority,
} from "../services/leadsRouter";
import Icons from "./Icons";
import { liststaffs } from "../services/staffRouter";
import Spinner from "../components/Spinner";
import { Trash2 } from "lucide-react";
import { toggleCustomerdetailmodal } from "../redux/modalSlice";

function Subadminfollowups() {
  const queryclient = useQueryClient();
  const dispatch = useDispatch();
  const iscustomerdetailmodal = useSelector(
    (state) => state.modal.customerdetailModal
  );
  const role = useSelector((state) => state.auth.role);
  const metadata = useSelector((state) => state.auth.metadataUser);

  const statusColors = {
    new: "bg-blue-100 text-blue-700 font-semibold",
    open: "bg-yellow-100 text-yellow-700 font-semibold",
    converted: "bg-green-100 text-green-700 font-semibold",
    walkin: "bg-purple-100 text-purple-700 font-semibold",
    paused: "bg-orange-100 text-orange-700 font-semibold",
    rejected: "bg-red-100 text-red-700 font-semibold",
    unavailable: "bg-gray-200 text-gray-600 font-semibold",
    closed: "bg-gray-100 text-gray-800 font-semibold",
  };

  const [sidebarVisible, setsidebarVisible] = useState(true);
  const [statussuccessmodal, setstatussuccessmodal] = useState(false);
  const [showsearch, setshowsearch] = useState(false);
  const [priorityfilter, setpriorityfilter] = useState("Priority");
  const [assignedfilter, setassignedfilter] = useState("AssignedTo");
  const [leadvaluefilter, setleadvaluefilter] = useState("Sort By");
  const [datefilter, setdatefilter] = useState("Date");

  // Custom date input value (dd-mm-yyyy as string)
  const [customDateInput, setCustomDateInput] = useState("");
  const [dateRangeStartInput, setDateRangeStartInput] = useState("");
  const [dateRangeEndInput, setDateRangeEndInput] = useState("");

  // Actual Date objects for API
  const [selectdatefilter, setselectdatefilter] = useState(null);
  const [daterangefilter, setdaterangefilter] = useState({
    start: null,
    end: null,
  });

  const [searchText, setsearchText] = useState("");
  const [currentpage, setcurrentpage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const leadsperpage = 10;

  // Auto-format dd-mm-yyyy
  const formatDateInput = (value) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length >= 3) formatted += "-" + digits.slice(2, 4);
    if (digits.length >= 5) formatted += "-" + digits.slice(4, 8);
    return formatted.slice(0, 10);
  };

  // Validate and convert dd-mm-yyyy to Date
  const parseDateString = (str) => {
    if (!str || str.length !== 10) return null;
    const [dd, mm, yyyy] = str.split("-").map(Number);
    const date = new Date(yyyy, mm - 1, dd);
    return date.getDate() === dd && date.getMonth() === mm - 1 && date.getFullYear() === yyyy
      ? date
      : null;
  };

  const { data: fetchopencustomers, isLoading } = useQuery({
    queryKey: [
      "Opencustomers",
      currentpage,
      priorityfilter,
      assignedfilter,
      searchText,
      datefilter,
      selectdatefilter,
      daterangefilter,
      leadvaluefilter,
    ],
    queryFn: () =>
      listopencustomers({
        page: currentpage,
        limit: leadsperpage,
        priority: priorityfilter !== "Priority" ? priorityfilter : undefined,
        assignedTo:
          assignedfilter !== "AssignedTo" ? assignedfilter : undefined,
        searchText,
        date: datefilter !== "Date" ? datefilter : undefined,
        startDate:
          datefilter === "custom" && selectdatefilter
            ? selectdatefilter.toISOString()
            : datefilter === "range" && daterangefilter.start
            ? daterangefilter.start.toISOString()
            : undefined,
        endDate:
          datefilter === "range" && daterangefilter.end
            ? daterangefilter.end.toISOString()
            : undefined,
        sortBy: leadvaluefilter !== "Sort By" ? leadvaluefilter : undefined,
      }),
    keepPreviousData: true,
  });

  const fetchstaffs = useQuery({
    queryKey: ["List staffs"],
    queryFn: liststaffs,
  });

  const updatingpriority = useMutation({
    mutationKey: ["Updatepriority"],
    mutationFn: updatepriority,
    onSuccess: () => {
      queryclient.invalidateQueries(["Opencustomers"]);
    },
  });

  const updatingleadstatus = useMutation({
    mutationKey: ["Updateleadstatus"],
    mutationFn: updateleadstatus,
    onSuccess: () => {
      queryclient.invalidateQueries(["Opencustomers"]);
    },
  });

  const deleteLeadsMutation = useMutation({
    mutationKey: ["Delete leads"],
    mutationFn: deletemultipleleads,
    onSuccess: () => {
      queryclient.invalidateQueries(["Opencustomers"]);
      setSelectedLeads([]);
      setstatussuccessmodal(true);
      setTimeout(() => setstatussuccessmodal(false), 2000);
    },
    onError: (error) => {
      alert("Failed to delete leads: " + (error.response?.data?.message || error.message));
    },
  });

  const handleleadchange = async (leadId, status) => {
    await updatingleadstatus.mutateAsync({ leadId, status });
    setstatussuccessmodal(true);
    setTimeout(() => setstatussuccessmodal(false), 2000);
  };

  const handlepriority = async (customerId, priority) => {
    await updatingpriority.mutateAsync({ customerId, priority });
    setstatussuccessmodal(true);
    setTimeout(() => setstatussuccessmodal(false), 2000);
  };

  const handleSelectLead = (leadId) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedLeads.length > 0) setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    await deleteLeadsMutation.mutateAsync({ leadIds: selectedLeads });
    setShowDeleteConfirm(false);
  };

  const totalLeads = fetchopencustomers?.totalLeads || 0;
  const totalPages = fetchopencustomers?.totalPages || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setcurrentpage(page);
      setSelectedLeads([]);
    }
  };

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
        {updatingleadstatus.isPending && <Spinner />}
        {updatingpriority.isPending && <Spinner />}
        {deleteLeadsMutation.isPending && <Spinner />}

        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 sm:p-3 bg-white shadow sticky top-0 z-30 border-b">
            <div className="flex items-center mb-4 sm:mb-0">
              <button
                className="mr-2 sm:mr-4 text-blue-600 hover:text-blue-800 transition"
                onClick={() => setsidebarVisible(!sidebarVisible)}
              >
                <FaBars className="text-lg sm:text-xl md:text-2xl" />
              </button>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Follow-ups
              </h3>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Icons />
            </div>
          </div>

          <div className="flex justify-between items-center p-3">
            {/* Left side: Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={priorityfilter}
                onChange={(e) => setpriorityfilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option>Priority</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
                <option value="Not Assigned">Not Assigned</option>
              </select>

              {role === "Admin" && (
                <select
                  value={assignedfilter}
                  onChange={(e) => setassignedfilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="AssignedTo">Assigned To</option>
                  {fetchstaffs?.data?.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={leadvaluefilter}
                onChange={(e) => setleadvaluefilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="Sort By">Lead Value</option>
                <option value="ascleadvalue">Lead Value ↑</option>
                <option value="descleadvalue">Lead Value ↓</option>
              </select>

              <select
                value={datefilter}
                onChange={(e) => {
                  setdatefilter(e.target.value);
                  setCustomDateInput("");
                  setDateRangeStartInput("");
                  setDateRangeEndInput("");
                  setselectdatefilter(null);
                  setdaterangefilter({ start: null, end: null });
                }}
                className="min-w-[140px] px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Date">Date</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="custom">Search from date</option>
                <option value="range">Search from range of date</option>
              </select>

              {/* Custom Single Date */}
              {datefilter === "custom" && (
                <input
                  type="text"
                  value={customDateInput}
                  placeholder="dd-mm-yyyy"
                  maxLength="10"
                  onChange={(e) => {
                    const formatted = formatDateInput(e.target.value);
                    setCustomDateInput(formatted);
                    setselectdatefilter(parseDateString(formatted));
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none w-40 text-sm"
                />
              )}

              {/* Date Range */}
              {datefilter === "range" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={dateRangeStartInput}
                    placeholder="Start: dd-mm-yyyy"
                    maxLength="10"
                    onChange={(e) => {
                      const formatted = formatDateInput(e.target.value);
                      setDateRangeStartInput(formatted);
                      const date = parseDateString(formatted);
                      setdaterangefilter((prev) => ({ ...prev, start: date }));
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm w-40"
                  />
                  <input
                    type="text"
                    value={dateRangeEndInput}
                    placeholder="End: dd-mm-yyyy"
                    maxLength="10"
                    onChange={(e) => {
                      const formatted = formatDateInput(e.target.value);
                      setDateRangeEndInput(formatted);
                      const date = parseDateString(formatted);
                      setdaterangefilter((prev) => ({ ...prev, end: date }));
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm w-40"
                  />
                </div>
              )}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {showsearch && (
                  <motion.input
                    key="search-input"
                    type="text"
                    value={searchText}
                    onChange={(e) => setsearchText(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium bg-white focus:ring-2 focus:ring-blue-500 text-sm w-56"
                    placeholder="Search..."
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                  />
                )}
              </AnimatePresence>
              <button
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                onClick={() => setshowsearch(!showsearch)}
              >
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Table & Pagination */}
          <div className="flex-grow p-2 bg-gray-100">
            <div className="flex justify-end mb-4">
              {selectedLeads.length > 0 && role !== "Agent" && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleDeleteSelected}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md"
                >
                  <Trash2 size={18} />
                  Delete Selected ({selectedLeads.length})
                </motion.button>
              )}
            </div>

            {/* Table content remains same */}
            {isLoading ? (
              <Spinner />
            ) : fetchopencustomers?.leads?.length > 0 ? (
              <>
                <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-lg">
                  <div className="max-h-[75vh] overflow-y-auto">
                    <table className="w-full table-auto text-xs sm:text-sm min-w-[800px]">
                      <thead className="sticky top-0 bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white uppercase">
                        <tr>
                          <th className="py-3 px-4 text-left">
                            {role !== "Agent" && (
                              <input
                                type="checkbox"
                                checked={
                                  selectedLeads.length === fetchopencustomers.leads.length &&
                                  fetchopencustomers.leads.length > 0
                                }
                                onChange={(e) =>
                                  setSelectedLeads(
                                    e.target.checked
                                      ? fetchopencustomers.leads.map((l) => l._id)
                                      : []
                                  )
                                }
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            )}
                          </th>
                          <th className="py-3 px-4">Sl No</th>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Created By</th>
                          <th className="py-3 px-4">Assigned To</th>
                          <th className="py-3 px-4">Location</th>
                          <th className="py-3 px-4">Priority</th>
                          <th className="py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fetchopencustomers.leads.map((lead, index) => (
                          <motion.tr
                            key={lead._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="even:bg-gray-50 hover:bg-blue-50"
                          >
                            <td className="py-4 px-4">
                              {role !== "Agent" && (
                                <input
                                  type="checkbox"
                                  checked={selectedLeads.includes(lead._id)}
                                  onChange={() => handleSelectLead(lead._id)}
                                  className="h-4 w-4 rounded"
                                />
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {(currentpage - 1) * leadsperpage + index + 1}
                            </td>
                            <td className="py-4 px-4">
                              <button
                                className="text-blue-700 font-semibold hover:underline"
                                onClick={() => dispatch(toggleCustomerdetailmodal(lead))}
                              >
                                {lead.name}
                              </button>
                            </td>
                            <td className="py-4 px-4">{lead.mobile}</td>
                            <td className="py-4 px-4">{lead.createdBy?.name}</td>
                            <td className="py-4 px-4">{lead.assignedTo?.name || "N/A"}</td>
                            <td className="py-4 px-4">{lead.location || "N/A"}</td>
                            <td className="py-4 px-4">
                              <select
                                className="border p-2 rounded-md bg-gray-100 text-xs w-full"
                                value={lead.status === "new" ? "Not Assigned" : (lead.priority || "Not Assigned")}
                                disabled={!!metadata || lead.status === "new"}
                                onChange={(e) => handlepriority(lead._id, e.target.value)}
                              >
                                <option value="hot">Hot</option>
                                <option value="warm">Warm</option>
                                <option value="cold">Cold</option>
                                <option value="Not Assigned">Not Assigned</option>
                              </select>
                            </td>
                            <td className="py-4 px-4">
                              <select
                                className={`border p-2 rounded-md text-xs w-full ${statusColors[lead.status]}`}
                                value={lead.status}
                                disabled={!!metadata}
                                onChange={(e) => handleleadchange(lead._id, e.target.value)}
                              >
                                <option value="new">New</option>
                                <option value="open">Open</option>
                                <option value="converted">Converted</option>
                                <option value="closed">Closed</option>
                                <option value="walkin">Walk In</option>
                                <option value="paused">Paused</option>
                                <option value="rejected">Rejected</option>
                                <option value="unavailable">Unavailable</option>
                              </select>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-4 flex-wrap">
                  <button
                    onClick={() => handlePageChange(currentpage - 1)}
                    disabled={currentpage === 1}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded ${
                        currentpage === i + 1
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentpage + 1)}
                    disabled={currentpage === totalPages}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 py-10 text-lg">
                {totalLeads > 0
                  ? `No leads on page ${currentpage}`
                  : "No Follow-ups Available"}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {statussuccessmodal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-black opacity-30" />
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="bg-green-100 text-green-700 px-10 py-6 rounded-xl shadow-2xl font-semibold"
            >
              {deleteLeadsMutation.isSuccess ? "Leads deleted!" : "Updated successfully!"}
            </motion.div>
          </motion.div>
        )}

        {showDeleteConfirm && (
          <motion.div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm"
            >
              <h3 className="text-xl font-bold mb-6">
                Delete {selectedLeads.length} lead(s)?
              </h3>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {iscustomerdetailmodal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="absolute inset-0 bg-black"
            />
            <div className="relative z-10 w-full max-w-4xl">
              <Customerdetailmodal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Subadminfollowups;