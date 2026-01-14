import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowUpLeft, Bell, Settings } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { FaUser, FaUsers } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { liststaffs } from '../services/staffRouter'
import { Link, useNavigate } from 'react-router-dom'
import { clearMetadataUser, setMetadataUser } from '../redux/authSlice'
import { impersonateuser } from '../services/impersonatemiddlewareRouter'
import { jwtDecode } from 'jwt-decode'
import { AnimatePresence, motion } from 'framer-motion'
import { toggleNotificationmodal, toggleStaffdetailmodal } from '../redux/modalSlice'
import Staffdetailsmodal from '../components/Staffdetailsmodal'
import Notificationmodal from '../components/Notificationmodal'
import Spinner from '../components/Spinner'
import { fetchunreadcount, markallread } from '../services/notificationsRouter'

function Icons() {
  const userlogged = useSelector((state) => state.auth.user)
  const role = useSelector((state) => state.auth.role)
  const metadatauser = useSelector((state) => state.auth.metadataUser)
  const isStaffdetailmodal = useSelector((state) => state.modal.staffdetailsModal)
  const isNotificationmodal = useSelector((state) => state.modal.notificationModal)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryclient = useQueryClient()
  const notificationmodalRef = useRef(null)
  const bellButtonRef = useRef(null) // Add ref for the bell button

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks on the bell button to prevent double-toggle
      if (
        isNotificationmodal &&
        notificationmodalRef.current &&
        !notificationmodalRef.current.contains(event.target) &&
        (!bellButtonRef.current || !bellButtonRef.current.contains(event.target))
      ) {
        dispatch(toggleNotificationmodal())
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isNotificationmodal, dispatch])

  const [showdropdown, setshowdropdown] = useState(false)

  const fetchstaffs = useQuery({
    queryKey: ['List Staffs'],
    queryFn: liststaffs
  })

  const { data: unreadCount } = useQuery({
    queryKey: ['Counting unreadnotification'],
    queryFn: fetchunreadcount
  })

  const markingnotificationsRead = useMutation({
    mutationKey: ['Marking all read'],
    mutationFn: markallread,
    onSuccess: () => {
      queryclient.invalidateQueries(['Counting unreadnotification'])
    }
  })

  const impersonatingUser = useMutation({
    mutationKey: ['Impersonating User'],
    mutationFn: impersonateuser,
    onSuccess: () => {
      queryclient.invalidateQueries(['Impersonating User', 'List tasks', 'List leads'])
    }
  })

  const handledropdown = () => {
    setshowdropdown(prev => !prev)
  }

  const handleimpersonate = async (selectedId) => {
    if (!selectedId) {
      return
    }

    const selectedUser = fetchstaffs.data?.find((staff) => staff._id === selectedId)
    if (!selectedUser) {
      return
    }

    dispatch(setMetadataUser(selectedUser))
    const response = await impersonatingUser.mutateAsync({ selectedId })
    const impersonatedUser = response.impersonateAs

    if (impersonatedUser) {
      navigate('/admindashboard')
    }
  }

  const stopimpersonate = () => {
    dispatch(clearMetadataUser())
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
    }
    queryclient.invalidateQueries(['List tasks', 'List leads'])
    navigate('/admindashboard')
  }

  const handlenotificationclick = async (event) => {
    event.stopPropagation() // Prevent the click from triggering handleClickOutside
    if (isNotificationmodal) {
      // If modal is open, just close it without marking notifications as read
      dispatch(toggleNotificationmodal())
    } else {
      // If modal is closed, mark notifications as read and open it
      await markingnotificationsRead.mutateAsync()
      dispatch(toggleNotificationmodal())
      queryclient.invalidateQueries(['Counting unreadnotification'])
    }
  }

  return (
    <div className='relative flex items-center gap-2 sm:gap-4 text-black text-lg sm:text-xl bg-white rounded-2xl shadow-md p-2 sm:p-3'>
      <AnimatePresence>
        {!metadatauser && showdropdown && (
          <motion.div
            className='absolute left-[-220px] w-[220px]'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {fetchstaffs.isLoading && <Spinner />}
            <select
              className={`w-full p-3 rounded-xl bg-white text-sm text-gray-800 font-medium border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:bg-gray-50 transition-all duration-200 appearance-none bg-no-repeat bg-right bg-[length:12px_12px] bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")]`}
              onChange={(e) => handleimpersonate(e.target.value)}
            >
              <option value="" className='p-3 text-gray-600 font-medium bg-white hover:bg-blue-50'>
                👥 Select staff
              </option>
              {fetchstaffs?.data?.map((staff) => (
                <option
                  key={staff._id}
                  value={staff._id}
                  className='p-3 text-gray-800 font-medium bg-white hover:bg-blue-50 border-t border-gray-100'
                >
                  {staff.name} ({staff.role})
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </AnimatePresence>
      {impersonatingUser.isPending && <Spinner />}
      {role === 'Admin' ? (
        <>
          {metadatauser ? (
            <div className="relative group">
              <motion.button
                onClick={stopimpersonate}
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-red-500 hover:text-red-700 transition"
                title="Stop impersonating"
              >
                <ArrowUpLeft size={20} strokeWidth={3} />
              </motion.button>
            </div>
          ) : (
            <>
              <button onClick={handledropdown} className="hover:text-blue-600 transition">
                <FaUsers />
              </button>
              <div className="relative">
                <button
                  ref={bellButtonRef} // Attach ref to bell button
                  onClick={handlenotificationclick}
                  className="relative hover:text-blue-600 transition"
                >
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {isNotificationmodal && (
                    <motion.div
                      ref={notificationmodalRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[999]"
                    >
                      <Notificationmodal />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to='/settings'>
                <button className="hover:text-blue-600 transition">
                  <Settings />
                </button>
              </Link>
              <button
                className="relative group w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 shadow-md transition-all duration-200"
                onClick={() => dispatch(toggleStaffdetailmodal())}
              >
                {userlogged.image ? (
                  <img
                    src={userlogged.image}
                    alt='Pro'
                    className='w-full h-full rounded-full border-2 border-[#00B5A6] object-contain'
                  />
                ) : (
                  <FaUser className="text-lg sm:text-xl" />
                )}
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Profile
                </span>
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <div className="relative">
            <button
              ref={bellButtonRef} // Attach ref to bell button
              onClick={handlenotificationclick}
              className="relative hover:text-blue-600 transition"
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {isNotificationmodal && (
                <motion.div
                  ref={notificationmodalRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute mr-10 right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg"
                >
                  <Notificationmodal />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            className="relative group w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700 shadow-md transition-all duration-200"
            onClick={() => dispatch(toggleStaffdetailmodal())}
          >
            {userlogged.image ? (
              <img
                src={userlogged.image}
                alt='Pro'
                className='w-full h-full rounded-full border-2 border-[#00B5A6] object-contain'
              />
            ) : (
              <FaUser className="text-lg sm:text-xl" />
            )}
            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Profile
            </span>
          </button>
        </>
      )}
      <AnimatePresence>
        {isStaffdetailmodal && (
          <motion.div
            key="staff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0 bg-black"
            />
            <div className="relative z-10 w-full max-w-md sm:max-w-lg">
              <Staffdetailsmodal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Icons