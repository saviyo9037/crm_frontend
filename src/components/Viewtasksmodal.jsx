import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toggleViewtasksmodal } from '../redux/modalSlice'
import { useDispatch, useSelector } from 'react-redux'
import { listtask, deletetask } from '../services/tasksRouter'
import Spinner from './Spinner'
import { FaTrash } from 'react-icons/fa'

function Viewtasksmodal() {
    const dispatch = useDispatch()
    const selectedstaffId = useSelector((state) => state.modal.selectedStaffsId)
    const queryclient = useQueryClient()

    const listtasks = useQuery({
        queryKey: ['List tasks'],
        queryFn: listtask
    })

    const deletetaskmutation = useMutation({
        mutationKey: ['Delete task'],
        mutationFn: deletetask,
        onSuccess: () => {
            queryclient.invalidateQueries(['List tasks'])
        }
    })

    const filteredtasks = listtasks?.data?.task?.filter((task) => task.assignedTo === selectedstaffId)

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-[95%] sm:max-w-4xl md:max-w-6xl text-center relative max-h-[90vh] overflow-hidden border border-gray-300 my-4 sm:my-8">
                <button
                    className="absolute top-3 right-4 text-2xl sm:text-3xl font-bold text-gray-400 hover:text-red-500 transition"
                    onClick={() => dispatch(toggleViewtasksmodal(null))}
                >
                    &times;
                </button>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 tracking-tight">Tasks</h3>

                <div className="overflow-x-auto max-h-[65vh] rounded-xl border border-gray-200">
                    {listtasks.isLoading ? (
                        <Spinner />
                    ) : filteredtasks?.length > 0 ? (
                        <table className="w-full text-xs sm:text-sm text-left text-gray-700 min-w-[600px]">
                            <thead className="text-xs text-white uppercase bg-gradient-to-r from-[#00B5A6] to-[#1E6DB0] sticky top-0 z-10 shadow">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">#</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Name</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Deadline</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Task Description</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                                    <th className="px-3 sm:px-6 py-3 sm:py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredtasks?.map((task, index) => (
                                    <tr key={task._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-3 sm:px-6 py-3 sm:py-5 font-semibold text-gray-800">{index + 1}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-5 font-medium">{task.name}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-5">
                                            {task.deadline
                                                ? new Date(task.deadline).toLocaleDateString('en-US', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : 'N/A'}
                                        </td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-5">{task.description || "N/A"}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-5">{task.status}</td>
                                        <td className="px-3 sm:px-6 py-3 sm:py-5">
                                            <button
                                                onClick={() => deletetaskmutation.mutate(task._id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Delete Task"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-400 text-sm sm:text-lg py-6 sm:py-10">No tasks assigned to this staff</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Viewtasksmodal