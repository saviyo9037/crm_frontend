import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { toggleedittaskmodal, toggleViewedittaskmodal } from '../redux/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { FaChartBar } from 'react-icons/fa'
import Edittaskmodal from './Edittaskmodal'
import { AnimatePresence, motion } from 'framer-motion'
import { listtask } from '../services/tasksRouter'
import Spinner from './Spinner'

function VieweditTaskmodal() {
    const dispatch = useDispatch()
    const selectedstaff = useSelector((state) => state.modal.selectedStaffsId)
    const isEdittaskmodal = useSelector((state) => state.modal.edittaskmodal)

    const listtasks = useQuery({
        queryKey: ['List tasks'],
        queryFn: listtask
    })

    const filteredtasks = listtasks?.data?.task?.filter((task) => task.assignedTo === selectedstaff?._id)

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-4xl md:max-w-6xl text-center relative max-h-[90vh] overflow-hidden border border-gray-300 my-4 sm:my-8">
                <button
                    className="absolute top-3 right-4 text-2xl sm:text-3xl font-bold text-gray-400 hover:text-red-500 transition"
                    onClick={() => dispatch(toggleViewedittaskmodal(null))}
                >
                    ×
                </button>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 tracking-tight flex justify-center items-center gap-2 sm:gap-3">
                    <FaChartBar className="text-blue-500 text-xl sm:text-2xl md:text-3xl" />
                    Assigned Tasks
                </h3>

                <div className="overflow-x-auto max-h-[65vh] rounded-xl border border-gray-200 shadow-inner">
                    {listtasks.isLoading ? (
                        <Spinner />
                    ) : filteredtasks?.length > 0 ? (
                        <table className="w-full text-xs sm:text-sm text-left text-gray-800 border-separate border-spacing-y-2 min-w-[600px]">
                            <thead className="sticky top-0 z-10">
                                <tr className="bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white shadow-md">
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center w-12 sm:w-16">#</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left w-1/4 sm:w-1/5">Name</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left w-1/4 sm:w-1/5">Deadline</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left">Task Description</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-center w-20 sm:w-24">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredtasks?.map((task, index) => (
                                    <tr
                                        key={task._id}
                                        className="bg-white hover:bg-blue-50 transition rounded-lg shadow-sm"
                                    >
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-center">{index + 1}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">{task.name}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                                            {task.deadline
                                                ? new Date(task.deadline).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : "N/A"}
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4">{task.description || "N/A"}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                                            <button
                                                className="bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-800 font-medium px-2 sm:px-3 py-1 rounded transition text-xs sm:text-sm"
                                                onClick={() => dispatch(toggleedittaskmodal(task))}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-400 text-sm sm:text-lg py-6 sm:py-10">No tasks to edit for this staff</p>
                    )}
                </div>
            </div>
            <AnimatePresence>
                {isEdittaskmodal && (
                    <motion.div
                        key="tasks"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-black backdrop-blur-sm"
                        />
                        <div className="relative z-10 w-full max-w-[95%] sm:max-w-4xl">
                            <Edittaskmodal />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default VieweditTaskmodal