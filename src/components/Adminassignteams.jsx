import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAssignteamsmodal } from '../redux/modalSlice'
import { listagents } from '../services/staffRouter'
import { assignteams, unassignteams } from '../services/teamsRouter'
import { motion } from 'framer-motion'
import Spinner from './Spinner'

function Adminassignteams() {
  const dispatch = useDispatch()
  const queryclient = useQueryClient()
  const subadmin = useSelector((state) => state.modal.selectedSubadminId)
  const [filteragents, setfilteragents] = useState('All')

  const getagents = useQuery({
    queryKey: ['Getting agents'],
    queryFn: listagents
  })

  const assigningteams = useMutation({
    mutationKey: ['AssignTeams'],
    mutationFn: assignteams,
    onSuccess: () => {
      queryclient.invalidateQueries(["listagents"])
    }
  })

  const unassignteam = useMutation({
    mutationKey: ['UnassignTeams'],
    mutationFn: unassignteams,
    onSuccess: () => {
      queryclient.invalidateQueries(["listagents"])
    }
  })

  const handleassignteams = async (subadminId, agentId, checked) => {
    if (checked) {
      await assigningteams.mutateAsync({ subadminId, agentId })
      queryclient.invalidateQueries(['Getting agents'])
    } else {
      await unassignteam.mutateAsync({ subadminId, agentId })
      queryclient.invalidateQueries(['Getting agents'])
    }
  }

  const filteredagents = getagents?.data?.filter((agents) => {
    if (filteragents === 'Assigned') return agents.assignedTo;
    if (filteragents === 'Unassigned') return !agents.assignedTo;
    return true
  })

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-3xl md:max-w-4xl text-center relative max-h-[90vh] overflow-hidden border border-gray-300"
      >
        {assigningteams.isPending &&
          <Spinner />
        }
        {unassignteam.isPending &&
          <Spinner />
        }
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-6 text-xl sm:text-2xl md:text-3xl font-bold text-gray-400 hover:text-red-500 transition"
          onClick={() => dispatch(toggleAssignteamsmodal(null))}
        >
          &times;
        </button>
        <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 tracking-tight">Assign Agents</h3>

        <div className="flex justify-end mb-3 sm:mb-4">
          <select
            className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
            value={filteragents}
            onChange={(e) => setfilteragents(e.target.value)}
          >
            <option>All</option>
            <option value='Assigned'>Assigned</option>
            <option value='Unassigned'>Unassigned</option>
          </select>
        </div>

        <div className="overflow-auto max-h-[60vh] sm:max-h-[65vh] rounded-xl border border-gray-200">
          {getagents.isLoading ? (
            <Spinner />
          ) : filteredagents?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left text-gray-700 min-w-[400px]">
                <thead className="text-xs uppercase bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white sticky top-0 z-10 shadow">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">#</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">Name</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm">Phone</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-center">Assign</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredagents.map((agent, index) => (
                    <tr
                      key={agent._id}
                      className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-5 font-semibold text-gray-800 text-xs sm:text-sm">{index + 1}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 font-medium text-xs sm:text-sm">{agent.name}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm">{agent.mobile}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={agent?.assignedTo === subadmin?._id}
                            disabled={agent?.assignedTo && agent?.assignedTo !== subadmin?._id}
                            onChange={(e) => handleassignteams(subadmin._id, agent._id, e.target.checked)}
                          />
                          <div
                            className={`w-9 sm:w-11 h-5 sm:h-6 rounded-full transition-colors duration-300 
                              ${agent?.assignedTo && agent?.assignedTo !== subadmin?._id ? 'bg-gray-300' : 'peer-checked:bg-green-500 bg-red-500'}
                              relative after:absolute after:top-[1px] sm:after:top-[2px] after:left-[1px] sm:after:left-[2px] after:bg-white after:border 
                              after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all 
                              peer-checked:after:translate-x-full`}
                          ></div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm sm:text-lg py-6 sm:py-10">No agents available.</p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Adminassignteams


// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import React from 'react'
// import { assignteams, listagents, unassignteams } from '../services/adminRouter'
// import { useDispatch, useSelector } from 'react-redux'
// import { toggleAssignteamsmodal } from '../redux/modalSlice'

// function Adminassignteams() {

//   const dispatch = useDispatch()
//   const queryclient = useQueryClient()
//   const subadmin = useSelector((state) => state.modal.selectedSubadminId)

//   const getagents = useQuery({
//     queryKey: ['Getting agents'],
//     queryFn: listagents
//   })

//   const assigningteams = useMutation({
//     mutationKey: ['AssignTeams'],
//     mutationFn: assignteams,
//     onSuccess: () => {
//       queryclient.invalidateQueries(['Getting agents'])
//     }
//   })

//   const unassignteam = useMutation({
//     mutationKey: ['UnassignTeams'],
//     mutationFn: unassignteams,
//     onSuccess: () => {
//       queryclient.invalidateQueries(['Getting agents'])
//     }
//   })

//   const handleassignteams = async (subadminId, agentId, checked) => {
//     if (checked) {
//       await assigningteams.mutateAsync({ subadminId, agentId })
//     } else {
//       await unassignteam.mutateAsync({ subadminId, agentId })
//     }
//   }

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
//       <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-6xl text-center relative max-h-[90vh] overflow-hidden border border-gray-300">

//         <button
//           className="absolute top-4 right-6 text-3xl font-bold text-gray-400 hover:text-red-500 transition"
//           onClick={() => dispatch(toggleAssignteamsmodal())}
//         >
//           &times;
//         </button>

//         <h3 className="text-4xl font-bold text-gray-800 mb-6 tracking-tight">Assign Agents</h3>

//         <div className="flex justify-end mb-4">
//           <select className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 font-medium bg-white focus:ring-2 focus:ring-blue-500">
//             <option>All</option>
//             <option>Assign</option>
//             <option>Unassign</option>
//           </select>
//         </div>

//         <div className="overflow-auto max-h-[65vh] rounded-xl border border-gray-200">
//           {getagents.isLoading ? (
//             <p className="text-blue-600 font-medium text-center py-12 animate-pulse">Loading agents...</p>
//           ) : getagents?.data?.length > 0 ? (
//             <table className="w-full text-sm text-left text-gray-700">
//               <thead className="text-xs text-white uppercase bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] sticky top-0 z-10 shadow">
//                 <tr>
//                   <th className="px-6 py-4">#</th>
//                   <th className="px-6 py-4">Name</th>
//                   <th className="px-6 py-4">Phone</th>
//                   <th className="px-6 py-4 text-center">Assign</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {getagents.data.map((lead, index) => (
//                   <tr key={lead._id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
//                     <td className="px-6 py-5 font-semibold text-gray-800">{index + 1}</td>
//                     <td className="px-6 py-5 font-medium">{lead.name}</td>
//                     <td className="px-6 py-5">{lead.mobile}</td>
//                     <td className="px-6 py-5 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition"
//                           disabled={subadmin?.assignedAgents?.includes(lead._id)}
//                           onClick={() => handleassignteams(subadmin._id, lead._id, true)}
//                         >
//                           Assign
//                         </button>
//                         <button
//                           className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
//                           disabled={!subadmin?.assignedAgents?.includes(lead._id)}
//                           onClick={() => handleassignteams(subadmin._id, lead._id, false)}
//                         >
//                           Unassign
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p className="text-gray-400 text-lg py-10">No agents available.</p>
//           )}
//         </div>
//       </div>
//     </div>

//   )
// }

// export default Adminassignteams


