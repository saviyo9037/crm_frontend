import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import { FaBars } from 'react-icons/fa';
import { listtask, updatetaskstatus } from '../services/tasksRouter';
import Icons from './Icons';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner';

function Agenttask() {
  const queryclient = useQueryClient();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [statussuccessmodal, setstatussuccessmodal] = useState(false);
  const metadata = useSelector((state) => state.auth.metadataUser);

    const fetchtasks = useQuery({
        queryKey: ['List Tasks'],
        queryFn: listtask
    });

  const edittaskstatus = useMutation({
    mutationKey: ["Editing Tasks status"],
    mutationFn: updatetaskstatus,
    onSuccess: () => {
      queryclient.invalidateQueries(["Editing Tasks status"]);
    },
  });

  const handletaskchange = async (taskId, status) => {
    await edittaskstatus.mutateAsync({ taskId, status });
    setstatussuccessmodal(true);
    setTimeout(() => {
      setstatussuccessmodal(false);
    }, 2000);
  };

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
        {edittaskstatus.isPending && <Spinner />}
        <div className="flex flex-col sm:flex-row justify-between mb-6 sm:mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center">
            <button
              className="mr-4 text-blue-600 hover:text-blue-800 transition"
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <FaBars className="text-lg sm:text-xl" />
            </button>
            Task
          </h3>
          <div className="flex justify-end">
            <Icons />
          </div>
        </div>

                {fetchtasks.isLoading ? (
                    <Spinner />
                ) : fetchtasks?.data?.task?.length > 0 ? (
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
                                {fetchtasks?.data?.task?.map((task, index) => (
                                    <motion.tr
                                        key={task._id}
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-3 sm:px-6 py-3 sm/py-4 font-medium text-gray-900 text-xs sm:text-sm">{task.name}</td>
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
                                                 className={`px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-gray-700 
                                                    ${task.status === 'pending' ? 'bg-yellow-300' : ''}
                                                    ${task.status === 'completed' ? 'bg-green-300' : ''}`}
                                                value={task.status}
                                                disabled = {!!metadata}
                                                onChange={(e) => handletaskchange(task._id, e.target.value)}
                                            >
                                                <option value="pending" className="text-black">Pending</option>
                                                <option value="completed" className="text-black">Completed</option>
                                            </select>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-6 text-base sm:text-lg">No tasks assigned to you yet.</p>
                )}
            </motion.div>
            <AnimatePresence>
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

export default Agenttask;
