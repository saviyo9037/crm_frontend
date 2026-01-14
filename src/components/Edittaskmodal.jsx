import { useFormik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { AnimatePresence, motion } from 'framer-motion'
import { toggleedittaskmodal } from '../redux/modalSlice'
import { FaTasks } from 'react-icons/fa'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { liststaffs } from '../services/staffRouter'
import { edittask } from '../services/tasksRouter'
import Spinner from './Spinner'

function Edittaskmodal() {
  const dispatch = useDispatch()
  const queryclient = useQueryClient()
  const selectedtask = useSelector((state) => state.modal.selectedTask)

  const [showsuccess, setshowsuccess] = useState(false)

  const liststaff = useQuery({
    queryKey: ['List staffs'],
    queryFn: liststaffs
  })

  const updatingtask = useMutation({
    mutationKey: ['Editing task'],
    mutationFn: edittask,
    onSuccess: () => {
      queryclient.invalidateQueries(['Editing task'])
    }
  })

  const edittaskvalidation = Yup.object({
    name: Yup.string(),
    assignedTo: Yup.string(),
    deadline: Yup.date().min(new Date(new Date().setHours(0, 0, 0, 0)), "Deadline cannot be in the past"),
    description: Yup.string()
  })

  const edittaskForm = useFormik({
    initialValues: {
      name: selectedtask?.name || '',
      assignedTo: selectedtask?.assignedTo || '',
      deadline: selectedtask?.deadline?.slice(0, 10) || '',
      description: selectedtask?.description || ''
    },
    validationSchema: edittaskvalidation,
    onSubmit: async (values) => {
      await updatingtask.mutateAsync({ taskId: selectedtask._id, taskdata: values })
      setshowsuccess(true)
      setTimeout(() => {
        dispatch(toggleedittaskmodal(null))
        setshowsuccess(false)
      }, 1000);
    }
  })

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-y-auto'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className='bg-white w-full max-w-4xl mx-4 my-8 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden sm:my-4'
      >
        <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-6 text-white">
          <FaTasks className='text-6xl sm:text-[80px] mb-4' />
          <h2 className='text-xl sm:text-2xl font-bold'>Edit Tasks</h2>
          <p className='text-xs sm:text-sm mt-2 text-center'>
            Register new customers to start managing their leads and communications.
          </p>
        </div>

        <div className='relative w-full md:w-2/3 p-4 sm:p-8'>
          <button
            onClick={() => dispatch(toggleedittaskmodal(null))}
            className='absolute top-3 right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition'
          >
            &times;
          </button>

          <h3 className='text-xl sm:text-2xl font-semibold text-gray-800 mb-4'>Edit your Task</h3>

          {updatingtask.isPending && (
            <Spinner />
          )}
          {updatingtask.isError && (
            <p className='text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm'>
              {updatingtask.error?.response?.data?.message}
            </p>
          )}

          <form onSubmit={edittaskForm.handleSubmit} className='space-y-4'>
            <div>
              <input
                type='text'
                name='name'
                value={edittaskForm.values.name}
                {...edittaskForm.getFieldProps('name')}
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
                placeholder='Enter the Taskname'
              />
              {edittaskForm.touched.name && edittaskForm.errors.name && (
                <p className='text-red-500 text-xs sm:text-sm mt-1'>{edittaskForm.errors.name}</p>
              )}
            </div>

            {liststaff.isLoading &&
              <Spinner />
            }
            <div>
              <select
                name='assignedTo'
                value={edittaskForm.values.assignedTo}
                {...edittaskForm.getFieldProps('assignedTo')}
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
              >
                <option value=''>--Select Staff--</option>
                {liststaff?.data?.map((staff) => (
                  <option key={staff._id} value={staff._id}>{staff.name} ({staff.role})</option>
                ))}
              </select>
              {edittaskForm.touched.assignedTo && edittaskForm.errors.assignedTo && (
                <p className='text-red-500 text-xs sm:text-sm mt-1'>{edittaskForm.errors.assignedTo}</p>
              )}
            </div>

            <div>
              <input
                type='date'
                name='deadline'
                value={edittaskForm.values.deadline}
                {...edittaskForm.getFieldProps('deadline')}
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
              />
              {edittaskForm.touched.deadline && edittaskForm.errors.deadline && (
                <p className='text-red-500 text-xs sm:text-sm mt-1'>{edittaskForm.errors.deadline}</p>
              )}
            </div>

            <div>
              <textarea
                name='description'
                value={edittaskForm.values.description}
                {...edittaskForm.getFieldProps('description')}
                className='border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
                rows='4'
                placeholder='Enter task description'
              ></textarea>
              {edittaskForm.touched.description && edittaskForm.errors.description && (
                <p className='text-red-500 text-xs sm:text-sm mt-1'>{edittaskForm.errors.description}</p>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition text-sm sm:text-base'
            >
              Edit Task
            </button>
          </form>
        </div>
      </motion.div>
      <AnimatePresence>
        {showsuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="absolute inset-0 bg-black opacity-30" />
            <motion.div
              className="relative z-10 bg-green-200 text-green-800 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm h-[100px] sm:h-[120px] flex items-center justify-center text-center"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              ✅ Task edited successfully!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Edittaskmodal