import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  delete_all,
  delete_notification,
  fetchnotifications,
} from '../services/notificationsRouter';
import { useDispatch } from 'react-redux';
import {
  toggleFullnotificationmodal,
  toggleNotificationmodal,
} from '../redux/modalSlice';
import { FaTrash, FaBell } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { parseISO, isToday, isYesterday, format } from 'date-fns';

// Utility to assign background colors
const getNotificationColor = (title) => {
  switch (title) {
    case 'Follow-up Warning':
      return 'bg-yellow-600';
    case 'Follow-up Missed':
      return 'bg-red-600';
    case 'Lead Created':
      return 'bg-blue-600';
    case 'Lead Status Updated':
      return 'bg-green-600';
    case 'Next Follow-up Set':
      return 'bg-gray-600';
    case 'Team Assigned':
      return 'bg-indigo-600';
    case 'Team Unassigned':
      return 'bg-pink-600';
    case 'Lead Assigned':
      return 'bg-orange-600';
    default:
      return 'bg-gray-800';
  }
};

// Utility to group notifications
const groupNotificationsByDate = (notifications) => {
  const groups = {};

  notifications
    .slice() // avoid mutating original
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
    .forEach((notification) => {
      const date = parseISO(notification.createdAt);
      let label;

      if (isToday(date)) {
        label = 'Today';
      } else if (isYesterday(date)) {
        label = 'Yesterday';
      } else {
        label = format(date, 'MMMM d, yyyy');
      }

      if (!groups[label]) groups[label] = [];
      groups[label].push(notification);
    });

  return groups;
};

function Fullnotificationmodal() {
  const dispatch = useDispatch();
  const queryclient = useQueryClient();

  const [showconfirm, setshowconfirm] = useState(false);
  const [statussucceess, setstatussuccess] = useState(false);

  const { data: notifications, isLoading, isError } = useQuery({
    queryKey: ['List notifications'],
    queryFn: fetchnotifications,
  });

  const deletingnotification = useMutation({
    mutationKey: ['Delete notification'],
    mutationFn: delete_notification,
    onSuccess: () => {
      queryclient.invalidateQueries(['List notifications']);
    },
  });

  const deletingall = useMutation({
    mutationKey: ['Delete all notifications'],
    mutationFn: delete_all,
    onSuccess: () => {
      queryclient.invalidateQueries(['List notifications']);
    },
  });

  const handledelete = async (id) => {
    await deletingnotification.mutateAsync(id);
  };

  const handleconfirm = () => {
    setshowconfirm(true);
  };

  const closeconfirm = () => {
    setshowconfirm(false);
  };

  const handlealldelete = async () => {
    await deletingall.mutateAsync();
    setstatussuccess(true);
    setshowconfirm(false);
    setTimeout(() => {
      setstatussuccess(false);
      dispatch(toggleFullnotificationmodal());
      dispatch(toggleNotificationmodal());
    }, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[2000] p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 bg-black opacity-80"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-[2010]"
      >
        <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-4 sm:p-6 text-white">
          <FaBell className="text-5xl sm:text-6xl md:text-[80px] mb-3 sm:mb-4" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">All Notifications</h2>
          <p className="text-xs sm:text-sm mt-2 text-center">View and manage all your notifications.</p>
        </div>
        <div className="relative w-full md:w-2/3 p-4 sm:p-6 md:p-8">
          <button
            onClick={() => dispatch(toggleFullnotificationmodal())}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition"
          >
            ×
          </button>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">All Notifications</h3>

          {isError && (
            <p className="text-red-600 bg-red-100 p-2 sm:p-3 rounded-md mb-3 sm:mb-4 text-sm sm:text-base">
              Failed to load notifications.
            </p>
          )}

          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleconfirm}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold transition text-sm sm:text-base"
              >
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {isLoading ? (
                <div className="text-center py-8 text-sm sm:text-base text-gray-400 animate-pulse">Loading...</div>
              ) : notifications && notifications.length > 0 ? (
                (() => {
                  const grouped = groupNotificationsByDate(notifications);

                  return Object.entries(grouped).map(([groupName, group]) =>
                    group.length > 0 ? (
                      <div key={groupName} className="space-y-2">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">{groupName}</h4>
                        {group.map((notification) => (
                          <motion.div
                            key={notification._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-stretch border border-black rounded-lg bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm overflow-hidden"
                          >
                            <div className={`w-5 ${getNotificationColor(notification.title)}`} />
                            <div className="flex-1 p-3 sm:p-4 flex justify-between items-center">
                              <div>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">{notification.title}</p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {format(parseISO(notification.createdAt), 'hh:mm a')}
                                </p>
                              </div>
                              <button
                                onClick={() => handledelete(notification._id)}
                                className="text-gray-500 hover:text-red-500 text-sm transition-colors duration-150 p-2 rounded-full hover:bg-gray-200"
                                aria-label={`Delete notification: ${notification.title}`}
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : null
                  );
                })()
              ) : (
                <div className="text-center py-8 text-sm sm:text-base text-gray-400">No notifications available</div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showconfirm && (
            <motion.div
              className="fixed inset-0 z-[2020] flex items-center justify-center p-4 sm:p-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-black opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="bg-white w-full max-w-md sm:max-w-lg mx-auto rounded-2xl shadow-2xl flex flex-col p-4 sm:p-6 md:p-8 relative z-[2030]"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">Are you sure?</h3>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handlealldelete}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold transition text-sm sm:text-base"
                  >
                    Yes
                  </button>
                  <button
                    onClick={closeconfirm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 sm:py-3 px-4 rounded-lg font-semibold transition text-sm sm:text-base"
                  >
                    No
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {statussucceess && (
            <motion.div
              className="fixed inset-0 z-[2020] flex items-center justify-center p-4 sm:p-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="absolute inset-0 bg-black opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
              <motion.div
                className="relative z-[2030] bg-green-200 text-green-800 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm h-[100px] sm:h-[120px] flex items-center justify-center text-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                ✅ All notifications deleted successfully!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Fullnotificationmodal;