import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { toggleStaffdatamodal } from "../redux/modalSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faEnvelope,
  faPhone,
  faTasks,
  faClipboardList,
  faCheckCircle,
  faHourglassHalf,
  faChartLine,
  faUserTie,
  faUserCog,
} from "@fortawesome/free-solid-svg-icons";
import Spinner from "./Spinner";
import { useQuery } from "@tanstack/react-query";
import { listleads } from "../services/leadsRouter";
import { listtask } from "../services/tasksRouter";
import { liststaffs } from "../services/staffRouter";

const StatCard = ({ icon, label, value, colorClass }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center text-center space-y-3 border border-gray-100 transition-all duration-200"
  >
    <div className={`p-4 rounded-full ${colorClass} bg-opacity-20`}>
      <FontAwesomeIcon icon={icon} className={`${colorClass} text-2xl`} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

function Staffdatamodal() {
  const dispatch = useDispatch();

  const isOpen = useSelector((state) => state.modal.Staffdatamodal);
  const selectedStaffId = useSelector((state) => state.modal.selectedStaffId);

  const { data: staffData, isLoading: isStaffLoading } = useQuery({
    queryKey: ["staffDetails", selectedStaffId],
    queryFn: () =>
      liststaffs().then((data) => data.find((s) => s._id === selectedStaffId)),
    enabled: isOpen && !!selectedStaffId,
  });

  // Fetch leads (this backend already returns ALL relevant leads for Admin/SubAdmin/Agent)
  const { data: leadsData, isLoading: isLeadsLoading } = useQuery({
    queryKey: ["staffLeads", selectedStaffId],
    queryFn: () => listleads({ noLimit: true }),
    enabled: isOpen && !!selectedStaffId,
  });

  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ["allTasks"],
    queryFn: listtask,
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const allLeads = leadsData?.leads || [];

  // Leads where this user is assigned
  const staffLeads = allLeads.filter(
    (l) =>
      l.assignedTo?._id === selectedStaffId ||
      l.createdBy?._id === selectedStaffId
  );

  const staffTasks =
    tasksData?.task?.filter((t) => t.assignedTo === selectedStaffId) || [];

  const totalLeads = staffLeads.length;
  const openLeads = staffLeads.filter((l) => l.status === "open").length;
  const convertedLeads = staffLeads.filter(
    (l) => l.status === "converted"
  ).length;
  const rejectedLeads = staffLeads.filter(
    (l) => l.status === "rejected"
  ).length;

  const totalTasks = staffTasks.length;
  const pendingTasks = staffTasks.filter((t) => t.status === "pending").length;
  const completedTasks = staffTasks.filter(
    (t) => t.status === "completed"
  ).length;

  // ==========================
  // 🔥 SUB-ADMIN METRICS
  // ==========================

  const leadsCreatedByMe = allLeads.filter(
    (l) => l.createdBy?._id === selectedStaffId
  );

  const leadsAssignedToMe = allLeads.filter(
    (l) => l.assignedTo?._id === selectedStaffId
  );

  const teamLeadsCreated = allLeads.filter((l) =>
    staffData?.assignedAgents?.some((a) => a._id === l.createdBy?._id)
  );

  const teamLeadsAssigned = allLeads.filter((l) =>
    staffData?.assignedAgents?.some((a) => a._id === l.assignedTo?._id)
  );

  const totalLeadsUnderMe =
    leadsCreatedByMe.length +
    leadsAssignedToMe.length +
    teamLeadsCreated.length +
    teamLeadsAssigned.length;

  // ==========================

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          onClick={() => dispatch(toggleStaffdatamodal())}
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {(isStaffLoading || isLeadsLoading || isTasksLoading) && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-10">
                <Spinner />
              </div>
            )}

            <button
              onClick={() => dispatch(toggleStaffdatamodal())}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {/* HEADER */}
            <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-gray-200">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl shadow-lg">
                <FontAwesomeIcon
                  icon={staffData?.role === "Agent" ? faUserTie : faUserCog}
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {staffData?.name}
                </h2>
                <p className="text-gray-500 text-lg">{staffData?.role}</p>
              </div>
            </div>

            {!staffData ? (
              <div className="text-center py-10">
                <p className="text-gray-600 text-lg">No staff selected.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* BASIC INFO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border">
                  <p className="text-gray-700 text-lg">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="mr-3 text-blue-500"
                    />
                    <strong>Email:</strong> {staffData.email}
                  </p>
                  <p className="text-gray-700 text-lg">
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="mr-3 text-green-500"
                    />
                    <strong>Mobile:</strong> {staffData.mobile}
                  </p>
                  {staffData.role === "Agent" && (
                    <p className="text-gray-700 text-lg">
                      <FontAwesomeIcon
                        icon={faUserTie}
                        className="mr-3 text-blue-500"
                      />
                      <strong>Sub-Admin:</strong>{" "}
                      {staffData?.assignedTo?.name || "N/A"}
                    </p>
                  )}
                </div>

                {/* ========================================= */}
                {/* 🟨 SUB-ADMIN LEAD OVERVIEW (Added Section) */}
                {/* ========================================= */}
                {staffData.role === "Sub-Admin" && (
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 space-y-4">
                    <h4 className="text-xl font-semibold text-yellow-800 mb-3">
                      Sub-Admin Lead Overview
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <StatCard
                        icon={faClipboardList}
                        label="Leads Created By Me"
                        value={leadsCreatedByMe.length}
                        colorClass="text-blue-600"
                      />

                      <StatCard
                        icon={faUserCog}
                        label="Leads Assigned To Me"
                        value={leadsAssignedToMe.length}
                        colorClass="text-purple-600"
                      />

                      <StatCard
                        icon={faUserTie}
                        label="Team Leads Created By Agents"
                        value={teamLeadsCreated.length}
                        colorClass="text-green-600"
                      />

                      <StatCard
                        icon={faTasks}
                        label="Team Leads Assigned To Agents"
                        value={teamLeadsAssigned.length}
                        colorClass="text-indigo-600"
                      />

                      <StatCard
                        icon={faChartLine}
                        label="Total Leads Under Me"
                        value={totalLeadsUnderMe}
                        colorClass="text-red-600"
                      />

                      <StatCard
                        icon={faUserTie}
                        label="Agents Count"
                        value={staffData.assignedAgents?.length || 0}
                        colorClass="text-orange-600"
                      />
                    </div>
                  </div>
                )}

                {/* ASSIGNED AGENTS */}
                {staffData.role === "Sub-Admin" &&
                  staffData.assignedAgents?.length > 0 && (
                    <div className="bg-gray-50 p-6 rounded-xl border">
                      <h5 className="text-xl font-semibold mb-3">
                        Assigned Agents ({staffData.assignedAgents.length})
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {staffData.assignedAgents.map((a) => (
                          <span
                            key={a._id}
                            className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full"
                          >
                            {a.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* LEADS OVERVIEW */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h4 className="text-xl font-semibold text-blue-800 mb-5 flex items-center">
                    <FontAwesomeIcon icon={faChartLine} className="mr-3" />{" "}
                    Leads Overview
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard
                      icon={faClipboardList}
                      label="Total Leads"
                      value={totalLeads}
                      colorClass="text-blue-600"
                    />
                    <StatCard
                      icon={faHourglassHalf}
                      label="Open Leads"
                      value={openLeads}
                      colorClass="text-yellow-600"
                    />
                    <StatCard
                      icon={faCheckCircle}
                      label="Converted"
                      value={convertedLeads}
                      colorClass="text-green-600"
                    />
                    <StatCard
                      icon={faTimes}
                      label="Rejected"
                      value={rejectedLeads}
                      colorClass="text-red-600"
                    />
                  </div>

                  {staffLeads.length > 0 && (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {staffLeads.map((lead) => (
                        <div
                          key={lead._id}
                          className="bg-white p-4 rounded-lg shadow border flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {lead.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {lead.email} | {lead.mobile}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              lead.status === "converted"
                                ? "bg-green-100 text-green-800"
                                : lead.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* TASKS OVERVIEW */}
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h4 className="text-xl font-semibold text-purple-800 mb-5 flex items-center">
                    <FontAwesomeIcon icon={faTasks} className="mr-3" /> Tasks
                    Overview
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <StatCard
                      icon={faTasks}
                      label="Total Tasks"
                      value={totalTasks}
                      colorClass="text-purple-600"
                    />
                    <StatCard
                      icon={faHourglassHalf}
                      label="Pending Tasks"
                      value={pendingTasks}
                      colorClass="text-orange-600"
                    />
                    <StatCard
                      icon={faCheckCircle}
                      label="Completed"
                      value={completedTasks}
                      colorClass="text-green-600"
                    />
                  </div>

                  {staffTasks.length > 0 && (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {staffTasks.map((task) => (
                        <div
                          key={task._id}
                          className="bg-white p-4 rounded-lg shadow border flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {task.title}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Updated:{" "}
                              {new Date(task.updatedAt).toLocaleDateString()}
                            </p>
                          </div>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              task.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Staffdatamodal;
