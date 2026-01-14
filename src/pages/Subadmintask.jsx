import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FaAddressBook, FaBars, FaEdit, FaUserCircle } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { toggleaddtasksmodal, toggleViewedittaskmodal, toggleViewtasksmodal } from '../redux/modalSlice';
import Addtaskmodal from '../components/Addtaskmodal';
import Viewtasksmodal from '../components/Viewtasksmodal';
import VieweditTaskmodal from '../components/VieweditTaskmodal';
import { listagents } from '../services/staffRouter';
import { listtask, updatetaskstatus } from '../services/tasksRouter';
import Icons from './Icons';
import Spinner from '../components/Spinner';

function Subadmintask() {
    const [activetask, setactivetask] = useState('staffs');
    const isTaskmodal = useSelector((state) => state.modal.addtasksmodal)
    const isViewtaskmodal = useSelector((state) => state.modal.viewtasksModal)
    const isViewedittaskmodal = useSelector((state) => state.modal.viewedittaskModal)
    const userlogged = useSelector((state) => state.auth.user)
    const metadata = useSelector((state) => state.auth.metadataUser)

    const [sidebarVisible, setsidebarVisible] = useState(true);
    const [statussuccessmodal, setstatussuccessmodal] = useState(false)

    const dispatch = useDispatch()
    const queryclient = useQueryClient()

    const fetchstaffs = useQuery({
        queryKey: ["listagents"],
        queryFn: listagents
    })

    const fetchtasks = useQuery({
        queryKey: ["List tasks"],
        queryFn: listtask
    })

    const updatingtaskstatus = useMutation({
        mutationKey: ['Update Task Status'],
        mutationFn: updatetaskstatus,
        onSuccess: () => {
            queryclient.invalidateQueries(['Update Task Status'])
        }
    })

    const handlestatuschange = async (taskId, status) => {
        await updatingtaskstatus.mutateAsync({ taskId, status })
        setstatussuccessmodal(true)
        setTimeout(() => {
            setstatussuccessmodal(false)
        }, 2000);
    }

    const userId = metadata ? metadata._id : userlogged.id
    const filteredStaffs = fetchstaffs?.data?.filter((staff) => staff.assignedTo === userId)
    const filteredtasks = fetchtasks?.data?.task?.filter((task) => task.assignedTo === userId)

    return (
        <div className="flex min-h-screen w-screen bg-gray-100 overflow-x-hidden">
            <div className="fixed inset-y-0 left-0 z-40">
                <motion.div
                    animate={{ x: sidebarVisible ? 0 : -260 }}
                    transition={{ duration: 0.3 }}
                    className="w-64 h-full fixed top-0 left-0 z-50"
                >
                    <Sidebar />
                </motion.div>
            </div>

            <motion.div
                animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-4 sm:p-8 overflow-y-auto"
            >
                {fetchstaffs.isLoading &&
                    <Spinner />
                }
                {fetchtasks.isLoading &&
                    <Spinner />
                }
                {updatingtaskstatus.isLoading &&
                    <Spinner />
                }
                <div className='flex flex-col sm:flex-row justify-between mb-6 sm:mb-8'>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
                        <button
                            className="mr-4 text-blue-600 hover:text-blue-800 transition"
                            onClick={() => setsidebarVisible(!sidebarVisible)}
                        >
                            <FaBars className="text-lg sm:text-xl" />
                        </button>
                        Task Manager
                    </h3>
                    <div className="flex justify-end">
                        <Icons />
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row justify-between mb-6 sm:mb-8 gap-4'>
                    <div className="flex gap-3 sm:gap-4">
                        <button
                            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold cursor-pointer text-sm sm:text-base ${activetask === 'staffs'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setactivetask('staffs')}
                        >
                            Staffs
                        </button>
                        <button
                            className={`px-4 sm:px-6 py-2 rounded-lg font-semibold cursor-pointer text-sm sm:text-base ${activetask === 'tasks'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700'
                                }`}
                            onClick={() => setactivetask('tasks')}
                        >
                            Tasks
                        </button>
                    </div>

                    {!metadata &&
                        <button
                            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-2 rounded-md shadow hover:from-blue-700 hover:to-blue-600 transition text-sm sm:text-base"
                            onClick={() => dispatch(toggleaddtasksmodal())}
                        >
                            <FaAddressBook className="inline-block mr-2" />Add Tasks
                        </button>
                    }
                </div>

                {activetask === 'staffs' ? (
                    fetchstaffs.isLoading ? (
                        <p className="text-center text-blue-600 font-medium py-6 text-sm sm:text-base">Loading staff...</p>
                    ) : filteredStaffs?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredStaffs?.map((staff, index) => (
                                <motion.div
                                    key={staff._id}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-4 sm:p-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="text-blue-600 text-[80px] sm:text-[100px] lg:text-[120px]">
                                            {staff.profileImage ? <img
                                                src={staff.profileImage}
                                                alt='Profile image'
                                                className='w-[120px] h-[120px] rounded-full  border-2 border-[#00B5A6] object-contain'
                                            /> :
                                                <FaUserCircle />}

                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg sm:text-xl font-bold text-gray-800">{staff.name}</h4>
                                            <p className="text-xs sm:text-sm text-gray-500 capitalize">{staff.role}</p>
                                        </div>
                                        {!metadata &&
                                            <div className="flex flex-col gap-2 items-end">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 transition"
                                                    title="Edit Tasks"
                                                    onClick={() => dispatch(toggleViewedittaskmodal(staff))}
                                                >
                                                    <FaEdit className="text-base sm:text-lg" />
                                                </button>
                                            </div>
                                        }
                                    </div>

                                    <div className="mt-4 sm:mt-6">
                                        <button
                                            className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 px-4 py-2 rounded-xl font-medium transition hover:bg-blue-600 hover:text-white text-sm sm:text-base"
                                            onClick={() => dispatch(toggleViewtasksmodal(staff._id))}
                                        >
                                            <FaAddressBook />
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center text-base sm:text-lg py-6">No staff members available</p>
                    )
                ) : (
                    fetchtasks.isLoading ? (
                        <p className="text-center text-blue-600 font-medium py-6 text-sm sm:text-base">Loading tasks...</p>
                    ) : filteredtasks?.length > 0 ? (
                        <div className="overflow-x-auto bg-white rounded-xl shadow">
                            <table className="min-w-full table-auto text-left border border-gray-200">
                                <thead>
                                    <tr className="bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] text-white">
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold">#</th>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold">Name</th>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold">Dead Line</th>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold">Task Description</th>
                                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredtasks?.map((task, index) => (
                                        <motion.tr
                                            key={task._id}
                                            className="border-t border-gray-200 hover:bg-gray-50"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{index + 1}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-xs sm:text-sm">{task.name}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                                                {task.deadline
                                                    ? new Date(task.deadline).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 capitalize text-xs sm:text-sm">{task.description}</td>
                                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                                                <select
                                                    className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white text-gray-700"
                                                    value={task.status}
                                                    onChange={(e) => handlestatuschange(task._id, e.target.value)}
                                                >
                                                    <option value="pending" className="text-yellow-600">Pending</option>
                                                    <option value="completed" className="text-green-600">Completed</option>
                                                </select>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-6 text-base sm:text-lg">No tasks assigned to you yet.</p>
                    )
                )}

            </motion.div>

            <AnimatePresence>
                {isTaskmodal && (
                    <motion.div
                        key="tasks"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-black backdrop-blur-sm"
                        />
                        <div className="relative z-10 w-full max-w-4xl mx-4 my-8 sm:my-0">
                            <Addtaskmodal />
                        </div>
                    </motion.div>
                )}
                {isViewtaskmodal && (
                    <motion.div
                        key="view-tasks"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-black backdrop-blur-sm"
                        />
                        <div className="relative z-10 w-full max-w-4xl mx-4 my-8 sm:my-0">
                            <Viewtasksmodal />
                        </div>
                    </motion.div>
                )}
                {isViewedittaskmodal && (
                    <motion.div
                        key="edit-tasks"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-black backdrop-blur-sm"
                        />
                        <div className="relative z-10 w-full max-w-4xl mx-4 my-8 sm:my-0">
                            <VieweditTaskmodal />
                        </div>
                    </motion.div>
                )}
                {statussuccessmodal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center"
                    >
                        <motion.div className="absolute inset-0 bg-black opacity-30" />
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="relative z-10 bg-green-100 text-green-700 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-2xl text-sm sm:text-base font-semibold w-[90%] sm:w-[400px] h-[100px] sm:h-[120px] flex items-center justify-center text-center"
                        >
                            Status updated successfully!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Subadmintask;