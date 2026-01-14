// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { NavLink, useNavigate } from "react-router-dom";
// import { logoutaction } from "../redux/authSlice";
// import {
//   FaAddressBook,
//   FaBook,
//   FaBriefcase,
//   FaBuilding,
//   FaChartBar,
//   FaClock,
//   FaDollarSign,
//   FaEnvelope,
//   FaRupeeSign,
//   FaSignOutAlt,
//   FaTachometerAlt,
//   FaTasks,
//   FaUserFriends,
//   FaUsers,
// } from "react-icons/fa";
// import { motion } from "framer-motion";
// import { Menu, X } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { acessPermission } from "../services/settingservices/permissionAccessRouter";

// function Sidebar() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const role = useSelector((state) => state.auth.role);
//   const metadata = useSelector((state) => state.auth.metadataUser);
//   const effectiveRole = metadata?.role || role;

//   const [isOpen, setIsOpen] = useState(false);

//   const logoutpage = () => {
//     dispatch(logoutaction());
//     navigate("/");
//   };

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const {
//     data: permissionData,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["permissionToAccess"],
//     queryFn: acessPermission,
//   });

//   const hideLeadDetails = permissionData?.getPermission?.find(
//     (perm) => perm.title === "Hide lead details form agent"
//   );

//   const displayLeadDetails = permissionData?.getPermission?.find(
//     (perm) => perm.title === "Display all leads for every staff member"
//   );

//   const displayCustomerDetails = permissionData?.getPermission?.find(
//     (perm) => perm.title === "Display all customers for every staff member"
//   );

//   return (
//     <>
//       <button
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#00B5A6] text-white rounded-md"
//         onClick={toggleSidebar}
//       >
//         {isOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Backdrop */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
//           onClick={toggleSidebar}
//         ></div>
//       )}

//       <aside
//         className={`fixed top-0 left-0 h-screen ${
//           effectiveRole !== role && role === "Admin"
//             ? "bg-gray-700"
//             : "bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0]"
//         } text-white shadow-lg transition-transform duration-300 ease-in-out z-40
//                 ${
//                   isOpen ? "translate-x-0" : "-translate-x-full"
//                 } lg:translate-x-0 w-full sm:w-64`}
//       >
//         <div className="p-4 sm:p-6 text-center font-extrabold text-2xl sm:text-3xl lg:text-4xl border-b border-white/30 flex justify-center items-center space-x-2">
//           <motion.span
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-gradient-to-r from-blue-200 to-cyan-400 text-transparent bg-clip-text font-serif drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
//           >
//             Irohub
//           </motion.span>
//           <motion.span
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="relative text-yellow-300 font-mono drop-shadow-md"
//           >
//             CRM
//             <motion.div
//               layoutId="underline"
//               className="absolute left-0 right-0 -bottom-1 h-[3px] bg-yellow-400 rounded-full"
//               initial={{ width: 0 }}
//               animate={{ width: "100%" }}
//               transition={{ duration: 0.4, delay: 0.6 }}
//             />
//           </motion.span>
//         </div>
//         <ul className="space-y-2 p-2 sm:p-4">
//           {effectiveRole === "Admin" && (
//             <>
//               <li>
//                 <NavLink
//                   to="/admindashboard"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaTachometerAlt className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Dashboard
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/agents"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaUserFriends className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Staffs
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/leads"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaAddressBook className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Leads
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/followups"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaBook className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Followups
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/customers"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaUsers className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Customers
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/tasks"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaTasks className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Tasks
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/payments"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaRupeeSign className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Payments
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/paymentReports"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 rounded-lg text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaRupeeSign  className="mr-2 sm:mr-3 text-base sm:text-lg" />{" "}
//                   Payments Report
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/subadminreports"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaChartBar className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Reports
//                 </NavLink>
//               </li>
//             </>
//           )}
//           {effectiveRole === "Sub-Admin" && (
//             <>
//               <li>
//                 <NavLink
//                   to="/admindashboard"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaTachometerAlt className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Dashboard
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/staffs"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaUserFriends className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Staffs
//                 </NavLink>
//               </li>
//               {displayLeadDetails && displayLeadDetails.active === true && (
//                 <li>
//                   <NavLink
//                     to="/leads"
//                     className={({ isActive }) =>
//                       `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                         isActive ? "bg-blue-600" : ""
//                       }`
//                     }
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <FaAddressBook className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                     Leads
//                   </NavLink>
//                 </li>
//               )}

//               <li>
//                 <NavLink
//                   to="/followups"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaBook className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Followups
//                 </NavLink>
//               </li>
//               {displayCustomerDetails &&
//                 displayCustomerDetails.active === true && (
//                   <li>
//                     <NavLink
//                       to="/customers"
//                       className={({ isActive }) =>
//                         `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                           isActive ? "bg-blue-600" : ""
//                         }`
//                       }
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <FaUsers className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                       Customers
//                     </NavLink>
//                   </li>
//                 )}

//               <li>
//                 <NavLink
//                   to="/subadmintasks"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaTasks className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Tasks
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/payments"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaDollarSign className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Payments
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/subadminreports"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaChartBar className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Reports
//                 </NavLink>
//               </li>
//             </>
//           )}
//           {effectiveRole === "Agent" && (
//             <>
//               <li>
//                 <NavLink
//                   to="/subadminhome"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaTachometerAlt className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Dashboard
//                 </NavLink>
//               </li>
              
//               {hideLeadDetails &&
//                 hideLeadDetails.active === false &&
//                 displayLeadDetails &&
//                 displayLeadDetails.active === true && (
//                   <li>
//                     <NavLink
//                       to="/leads"
//                       className={({ isActive }) =>
//                         `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold 
//                                             hover:bg-white/20 hover:text-gray-100 rounded-lg 
//                                             transform transition-transform duration-300 ease-in-out 
//                                             hover:scale-105 text-sm sm:text-base ${
//                                               isActive ? "bg-blue-600" : ""
//                                             }`
//                       }
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <FaEnvelope className="mr-2 sm:mr-3 text-base sm:text-lg" />{" "}
//                       Lead List
//                     </NavLink>
//                   </li>
//                 )}

//               <li>
//                 <NavLink
//                   to="/followups"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaClock className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Followups
//                 </NavLink>
//               </li>
//               {displayCustomerDetails &&
//                 displayCustomerDetails.active === true && (
//                   <li>
//                     <NavLink
//                       to="/customers"
//                       className={({ isActive }) =>
//                         `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                           isActive ? "bg-blue-600" : ""
//                         }`
//                       }
//                       onClick={() => setIsOpen(false)}
//                     >
//                       <FaUserFriends className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                       Customers
//                     </NavLink>
//                   </li>
//                 )}

//               <li>
//                 <NavLink
//                   to="/agenttasks"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaTasks className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Tasks
//                 </NavLink>
//               </li>
//               <li>
//                 <NavLink
//                   to="/payments"
//                   className={({ isActive }) =>
//                     `flex items-center py-2 sm:py-3 px-3 sm:px-4 text-white font-bold hover:bg-white/20 hover:text-gray-100 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base ${
//                       isActive ? "bg-blue-600" : ""
//                     }`
//                   }
//                   onClick={() => setIsOpen(false)}
//                 >
//                   <FaDollarSign className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                   Payments
//                 </NavLink>
//               </li>
//             </>
//           )}
//           {!metadata && (
//             <li>
//               <button
//                 className="flex items-center w-full py-2 sm:py-2 px-3 sm:px-4 font-bold hover:bg-red-600 rounded-md cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 text-sm sm:text-base"
//                 onClick={() => {
//                   logoutpage();
//                   setIsOpen(false);
//                 }}
//               >
//                 <FaSignOutAlt className="mr-2 sm:mr-3 text-base sm:text-lg" />
//                 Logout
//               </button>
//             </li>
//           )}
//         </ul>
//       </aside>
//     </>
//   );
// }

// export default Sidebar;



import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutaction } from "../redux/authSlice";
import {
  FaAddressBook,
  FaBook,
  FaChartBar,
  FaClock,
  FaDollarSign,
  FaEnvelope,
  FaRupeeSign,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTasks,
  FaUserFriends,
  FaUsers,
} from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { acessPermission } from "../services/settingservices/permissionAccessRouter";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);
  const metadata = useSelector((state) => state.auth.metadataUser);
  const effectiveRole = metadata?.role || role;

  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const logoutpage = () => {
    dispatch(logoutaction());
    navigate("/");
  };

  const { data: permissionData } = useQuery({
    queryKey: ["permissionToAccess"],
    queryFn: acessPermission,
  });

  const hideLeadDetails = permissionData?.getPermission?.find(
    (perm) => perm.title === "Hide lead details form agent"
  );
  const displayLeadDetails = permissionData?.getPermission?.find(
    (perm) => perm.title === "Display all leads for every staff member"
  );
  const displayCustomerDetails = permissionData?.getPermission?.find(
    (perm) => perm.title === "Display all customers for every staff member"
  );

  const menuItems = {
    Admin: [
      { to: "/admindashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
      { to: "/agents", icon: <FaUserFriends />, label: "Staffs" },
      { to: "/leads", icon: <FaAddressBook />, label: "Leads" },
      { to: "/followups", icon: <FaBook />, label: "Followups" },
      { to: "/customers", icon: <FaUsers />, label: "Customers" },
      { to: "/tasks", icon: <FaTasks />, label: "Tasks" },
      { to: "/payments", icon: <FaRupeeSign />, label: "Payments" },
      { to: "/paymentReports", icon: <FaDollarSign />, label: "Payment Reports" },
      { to: "/subadminreports", icon: <FaChartBar />, label: "Reports" },
    ],
    "Sub-Admin": [
      { to: "/admindashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
      { to: "/staffs", icon: <FaUserFriends />, label: "Staffs" },
      { to: "/leads", icon: <FaAddressBook />, label: "Leads" },
      { to: "/followups", icon: <FaBook />, label: "Followups" },
      { to: "/customers", icon: <FaUserFriends />, label: "Customers" },

      { to: "/subadmintasks", icon: <FaTasks />, label: "Tasks" },
      { to: "/payments", icon: <FaDollarSign />, label: "Payments" },
      { to: "/subadminreports", icon: <FaChartBar />, label: "Reports" },
    ],
    Agent: [
      { to: "/subadminhome", icon: <FaTachometerAlt />, label: "Dashboard" },
      { to: "/leads", icon: <FaEnvelope />, label: "Lead List" },
      { to: "/followups", icon: <FaClock />, label: "Followups" },
     { to: "/customers", icon: <FaUserFriends />, label: "Customers" },

      { to: "/agenttasks", icon: <FaTasks />, label: "Tasks" },
      { to: "/payments", icon: <FaDollarSign />, label: "Payments" },
    ],
  };

  const currentMenu = menuItems[effectiveRole] || [];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white rounded-md shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen flex flex-col justify-between text-white transition-all duration-300 shadow-lg z-50
          ${isOpen ? "w-64" : "w-20"} 
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-[#0b1d29]`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div
            className={`font-bold text-xl tracking-wide bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent transition-opacity duration-200 ${
              !isOpen ? "opacity-0 hidden" : "opacity-100"
            }`}
          >
            Irohub CRM
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:block text-gray-300 hover:text-white transition"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu */}
        <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {currentMenu.map((item, i) => (
            <li key={i}>
              <NavLink
                to={item.to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-md transition-all duration-200 ease-out 
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0]"
                      : "hover:bg-white/10"
                  }`
                }
              >
                <div className="text-lg">{item.icon}</div>
                <span
                  className={`text-sm font-semibold tracking-wide whitespace-nowrap transition-opacity duration-200 ${
                    isOpen ? "opacity-100" : "opacity-0 hidden"
                  }`}
                >
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <div className="border-t border-white/10 px-4 py-3">
          <button
            onClick={logoutpage}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg hover:bg-red-600/80 transition-all"
          >
            <FaSignOutAlt className="text-lg" />
            <span
              className={`font-semibold transition-opacity duration-200 ${
                isOpen ? "opacity-100" : "opacity-0 hidden"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
