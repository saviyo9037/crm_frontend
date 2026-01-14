import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import Sidebar from "./Sidebar";
import {
  FaBars,
  FaChevronDown,
  FaEdit,
  FaInfoCircle,
  FaTrash,
  FaUserAlt,
  FaUserCircle,
  FaUserPlus,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAssignleadsmodal,
  toggleAssignteamsmodal,
  togglestaffeditmodal,
  togglestaffmodal,
  toggleStaffdatamodal,
} from "../redux/modalSlice";

import Assignleadsmodal from "../components/Assignleadsmodal";
import Staffmodel from "../components/Staffmodel";
import Staffeditmodal from "../components/Staffeditmodal";
import Adminassignteams from "../components/Adminassignteams";
import StaffDetailsModal from "../components/Staffdetailsmodal";
import { AnimatePresence, motion } from "framer-motion";
import { deletestaff, liststaffs } from "../services/staffRouter";
import Icons from "./Icons";
import Spinner from "../components/Spinner";
import Staffdatamodal from "../components/Staffdatamodal";
import { listleads } from "../services/leadsRouter";

function Stafflist() {
  const dispatch = useDispatch();
  const queryclient = useQueryClient();

  // Global Modals
  const isAssignteamsmodal = useSelector(
    (state) => state.modal.assignteamsModal
  );
  const isAssignleadsmodal = useSelector(
    (state) => state.modal.assignleadsModal
  );
  const isStaffmodal = useSelector((state) => state.modal.staffmodal);
  const isStaffeditmodal = useSelector((state) => state.modal.staffeditmodal);

  // UI states
  const [selectedRole, setselectedRole] = useState("Sub-Admin");
  const [sidebarVisible, setsidebarVisible] = useState(true);

  // Delete Modal States
  const [showReassignModal, setshowReassignModal] = useState(false);
  const [typedDelete, setTypedDelete] = useState("");
  const [selectedStaffId, setselectedStaffId] = useState(null);
  const [staffRole, setStaffRole] = useState(null);
  const [newUserId, setnewUserId] = useState(null);
  const [statussucceess, setstatussuccess] = useState(false);

  const fetchleads = useQuery({
    queryKey: ["Listleads"],
    queryFn: listleads,
    keepPreviousData: true,
  });

  const fetchstaffs = useQuery({
    queryKey: ["listagents"],
    queryFn: liststaffs,
  });

  // DELETE STAFF Mutation
  const deletestaffs = useMutation({
    mutationKey: ["Deletestaffs"],
    mutationFn: ({ staffId, newUserId }) => deletestaff(staffId, { newUserId }),
    onSuccess: () => {
      queryclient.invalidateQueries(["listagents"]);
      queryclient.invalidateQueries(["Listleads"]);
    },
  });

  // FILTER STAFF BY ROLE
  const filteredStaff = useMemo(() => {
    return fetchstaffs?.data?.filter((staff) => staff.role === selectedRole);
  }, [fetchstaffs.data, selectedRole]);

  // OPEN DELETE MODAL
  const handleconfirm = (staff) => {
    setselectedStaffId(staff._id);
    setStaffRole(staff.role);
    setshowReassignModal(true);
  };

  // CLOSE DELETE MODAL
  const closeconfirm = () => {
    setselectedStaffId(null);
    setStaffRole(null);
    setnewUserId(null);
    setTypedDelete("");
    setshowReassignModal(false);
  };

  // FINAL DELETE ACTION
  const confirmDeleteAndReassign = async () => {
    if (!newUserId || typedDelete !== "DELETE") return;

    await deletestaffs.mutateAsync({
      staffId: selectedStaffId,
      newUserId,
    });

    closeconfirm();
    setstatussuccess(true);

    setTimeout(() => {
      setstatussuccess(false);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 overflow-x-hidden">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-40">
        <motion.div
          animate={{ x: sidebarVisible ? 0 : -260 }}
          transition={{ duration: 0.3 }}
          className="w-64 h-full shadow-2xl"
        >
          <Sidebar />
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 min-h-screen overflow-y-auto p-6"
      >
        {deletestaffs.isPending && <Spinner />}

        <div className="flex flex-col max-w-7xl mx-auto">
          {/* HEADER */}
          <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <button
              className="mr-4 text-indigo-600 hover:text-indigo-800"
              onClick={() => setsidebarVisible(!sidebarVisible)}
            >
              <FaBars className="text-2xl" />
            </button>
            Staff Management
          </h3>

          {/* RIGHT TOP ICONS */}
          <div className="absolute top-6 right-6 z-50">
            <Icons />
          </div>

          {/* FILTER + ADD BUTTON */}
          <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4">
            <select
              value={selectedRole}
              onChange={(e) => setselectedRole(e.target.value)}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-full shadow-md hover:bg-indigo-700"
            >
              <option value="Sub-Admin">Sub-Admin</option>
              <option value="Agent">Agent</option>
            </select>

            <button
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-lg"
              onClick={() => dispatch(togglestaffmodal())}
            >
              <FaUserPlus /> Add Staff
            </button>
          </div>

          {/* STAFF GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchstaffs.isLoading ? (
              <Spinner />
            ) : filteredStaff?.length > 0 ? (
              filteredStaff.map((staff, index) => (
                <motion.div
                  key={staff._id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* ACTION BUTTONS */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => dispatch(toggleStaffdatamodal(staff._id))}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <FaInfoCircle className="text-xl" />
                    </button>
                    <button
                      onClick={() => dispatch(togglestaffeditmodal(staff))}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                    >
                      <FaEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleconfirm(staff)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>

                  {/* PROFILE */}
                  <div className="flex items-center space-x-5 mt-4">
                    <div className="text-indigo-600">
                      {staff.profileImage ? (
                        <img
                          src={staff.profileImage}
                          alt=""
                          className="w-24 h-24 rounded-full border-4 border-indigo-100 object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-24 h-24" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold">{staff.name}</h4>
                      <p className="text-gray-600 text-sm">{staff.role}</p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-col gap-3">
                    {staff.role === "Sub-Admin" && (
                      <button
                        onClick={() => dispatch(toggleAssignteamsmodal(staff))}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Assign Teams
                      </button>
                    )}
                    <button
                      onClick={() =>
                        dispatch(toggleAssignleadsmodal(staff._id))
                      }
                      className="px-4 py-2.5 rounded-xl border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                    >
                      Assign Leads
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No staff available
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* MODALS */}
      <AnimatePresence>
        {isAssignteamsmodal && (
          <ModalWrapper>
            <Adminassignteams />
          </ModalWrapper>
        )}

        {isAssignleadsmodal && (
          <ModalWrapper>
            <Assignleadsmodal />
          </ModalWrapper>
        )}

        {isStaffmodal && (
          <ModalWrapper>
            <Staffmodel />
          </ModalWrapper>
        )}

        {isStaffeditmodal && (
          <ModalWrapper>
            <Staffeditmodal />
          </ModalWrapper>
        )}

        {/* SUCCESS MESSAGE */}
        {statussucceess && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <motion.div
              className="bg-green-100 text-green-900 px-10 py-5 rounded-xl shadow-xl font-semibold"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              ✅ Staff deleted successfully!
            </motion.div>
          </motion.div>
        )}

        {showReassignModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full text-white shadow-lg ${
                    staffRole === "Sub-Admin" ? "bg-orange-500" : "bg-red-600"
                  }`}
                >
                  <FaTrash className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Delete {staffRole}</h3>
                  <p className="text-gray-600 text-sm">
                    This action is irreversible.
                  </p>
                </div>
              </div>

              {/* Impact Section */}
              <div
                className={`p-4 rounded-xl text-sm mb-5 ${
                  staffRole === "Sub-Admin"
                    ? "bg-orange-50 text-orange-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <p className="font-semibold mb-1">This will:</p>
                {staffRole === "Sub-Admin" ? (
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Reassign ALL agents under this Sub-Admin</li>
                    <li>Reassign ALL leads of this Sub-Admin & their agents</li>
                  </ul>
                ) : (
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Reassign all leads assigned to this agent</li>
                  </ul>
                )}
              </div>

              {/* Reassign Dropdown */}
              <div className="mb-5">
                <label className="block font-medium mb-1">Reassign to:</label>
                <select
                  onChange={(e) => setnewUserId(e.target.value)}
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select new {staffRole}</option>

                  {(staffRole === "Sub-Admin"
                    ? fetchstaffs.data?.filter(
                        (s) =>
                          s.role === "Sub-Admin" && s._id !== selectedStaffId
                      )
                    : fetchstaffs.data?.filter(
                        (s) => s.role === "Agent" && s._id !== selectedStaffId
                      )
                  )?.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type-to-confirm */}
              <div className="mb-5">
                <label className="block font-medium mb-1">
                  Type <b>DELETE</b> to confirm:
                </label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-red-500"
                  placeholder="Type DELETE"
                  onChange={(e) => setTypedDelete(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={closeconfirm}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteAndReassign}
                  disabled={
                    !newUserId ||
                    typedDelete !== "DELETE" ||
                    deletestaffs.isPending
                  }
                  className={`px-5 py-2.5 rounded-xl text-white flex items-center gap-2 ${
                    !newUserId || typedDelete !== "DELETE"
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deletestaffs.isPending ? <Spinner /> : <FaTrash />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <Staffdatamodal />
      </AnimatePresence>
    </div>
  );
}

/* Simple Wrapper for Modals */
const ModalWrapper = ({ children }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="absolute inset-0 bg-black/60" />
    <div className="relative z-10 w-full max-w-lg">{children}</div>
  </motion.div>
);

export default Stafflist;
