// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import React from 'react';
// import { delete_notification, fetchnotifications } from '../services/notificationsRouter';
// import { FaTrash } from 'react-icons/fa';
// import { useDispatch, useSelector } from 'react-redux';
// import { AnimatePresence, motion } from 'framer-motion';
// import Fullnotificationmodal from './Fullnotificationmodal';
// import { toggleFullnotificationmodal } from '../redux/modalSlice';
// import { isToday, isYesterday, parseISO, format } from 'date-fns';

// // Utility function to assign background color based on the notification title
// const getNotificationColor = (title) => {
//   switch (title) {
//     case 'Follow-up Warning':
//       return 'bg-yellow-600';
//     case 'Follow-up Missed':
//       return 'bg-red-600';
//     case 'Lead Created':
//       return 'bg-blue-600';
//     case 'Lead Status Updated':
//       return 'bg-green-600';
//     case 'Next Follow-up Set':
//       return 'bg-gray-600';
//     case 'Team Assigned':
//       return 'bg-indigo-600';
//     case 'Team Unassigned':
//       return 'bg-pink-600';
//     case 'Lead Assigned':
//       return 'bg-orange-600';
//     default:
//       return 'bg-gray-800';
//   }
// };

// // Grouping and sorting function
// const groupAndSortNotifications = (notifications) => {
//   const groups = {};

//   notifications
//     .slice() // avoid mutating original
//     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
//     .forEach((notification) => {
//       const date = parseISO(notification.createdAt);
//       let label;

//       if (isToday(date)) {
//         label = 'Today';
//       } else if (isYesterday(date)) {
//         label = 'Yesterday';
//       } else {
//         label = format(date, 'MMMM d, yyyy');
//       }

//       if (!groups[label]) groups[label] = [];
//       groups[label].push(notification);
//     });

//   return groups;
// };

// function Notificationmodal() {
//   const queryclient = useQueryClient();
//   const dispatch = useDispatch();

//   const isFullnotificationmodal = useSelector(
//     (state) => state.modal.fullnotificationModal
//   );

//   const { data: notifications, isLoading, isError } = useQuery({
//     queryKey: ['List notifications'],
//     queryFn: fetchnotifications,
//   });

//   const deletingnotification = useMutation({
//     mutationKey: ['Delete notification'],
//     mutationFn: delete_notification,
//     onSuccess: () => {
//       queryclient.invalidateQueries(['List notifications']);
//     },
//   });

//   const handledelete = async (id) => {
//     await deletingnotification.mutateAsync(id);
//   };

//   const groupedNotifications = notifications
//     ? Object.entries(groupAndSortNotifications(notifications))
//     : [];

//   let count = 0; // Counter to limit to top 5 notifications only

//   return (
//     <div className="w-96 p-6 bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] rounded-2xl shadow-2xl border border-gray-100 text-gray-900 transition-all duration-300">
//       <h3 className="text-xl font-semibold mb-4 text-white tracking-tight">Notifications</h3>

//       {isLoading ? (
//         <div className="text-center py-8 text-sm text-white animate-pulse">Loading...</div>
//       ) : isError ? (
//         <div className="text-center py-8 text-sm text-red-200 font-medium">Failed to load notifications.</div>
//       ) : notifications && notifications.length > 0 ? (
//         <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//           {groupedNotifications.map(([label, items]) => {
//             const groupToShow = [];

//             for (let i = 0; i < items.length && count < 5; i++) {
//               groupToShow.push(items[i]);
//               count++;
//             }

//             if (groupToShow.length === 0) return null;

//             return (
//               <div key={label} className="space-y-2">
//                 <h4 className="text-xs font-medium text-white uppercase mb-2 tracking-wider">{label}</h4>
//                 {groupToShow.map((notification) => (
//                   <motion.li
//                     key={notification._id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="flex items-stretch border border-black rounded-xl bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm overflow-hidden"
//                   >
//                     <div className={`w-5 ${getNotificationColor(notification.title)} rounded-l-xl`} />
//                     <div className="flex-1 p-4 flex justify-between items-center">
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
//                         <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
//                       </div>
//                       <button
//                         onClick={() => handledelete(notification._id)}
//                         className="text-gray-500 hover:text-red-500 text-sm transition-colors duration-150 p-2 rounded-full hover:bg-gray-200"
//                         aria-label={`Delete notification: ${notification.title}`}
//                       >
//                         <FaTrash className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </motion.li>
//                 ))}
//               </div>
//             );
//           })}

//           {notifications.length > 5 && (
//             <button
//               onClick={() => dispatch(toggleFullnotificationmodal())}
//               className="mt-4 text-white hover:text-gray-200 font-medium text-sm transition-colors duration-150"
//             >
//               View All Notifications
//             </button>
//           )}
//         </ul>
//       ) : (
//         <div className="text-center py-8 text-sm text-white">No notifications available</div>
//       )}

//       <AnimatePresence>
//         {isFullnotificationmodal && (
//           <motion.div
//             key="full-notification"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3, ease: "easeInOut" }}
//             className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-0"
//           >
//             <Fullnotificationmodal />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// export default Notificationmodal;

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { delete_notification, fetchnotifications } from '../services/notificationsRouter';
import { FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import Fullnotificationmodal from './Fullnotificationmodal';
import { toggleFullnotificationmodal } from '../redux/modalSlice';
import { isToday, isYesterday, parseISO, format } from 'date-fns';
import { showRemainder } from '../services/remainderRouter';

// Utility function to assign background color based on the notification title
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

// Grouping and sorting function
const groupAndSortNotifications = (notifications) => {
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

function Notificationmodal() {
  const queryclient = useQueryClient();
  const dispatch = useDispatch();

  const isFullnotificationmodal = useSelector(
    (state) => state.modal.fullnotificationModal
  );

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

  const {
  data: remainders,
  isLoading: isRemaindersLoading,
  isError: isRemaindersError,
} = useQuery({
  queryKey: ["List remainders"],
  queryFn: showRemainder,
});

  const handledelete = async (id) => {
    await deletingnotification.mutateAsync(id);
  };

  const groupedNotifications = notifications
    ? Object.entries(groupAndSortNotifications(notifications))
    : [];

  let count = 0; // Counter to limit to top 5 notifications only

  return (
    <div className="w-96 p-6 bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] rounded-2xl shadow-2xl border border-gray-100 text-gray-900 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-4 text-white tracking-tight">Notifications</h3>

      {isLoading ? (
        <div className="text-center py-8 text-sm text-white animate-pulse">Loading...</div>
      ) : isError ? (
        <div className="text-center py-8 text-sm text-red-200 font-medium">Failed to load notifications.</div>
      ) : notifications && notifications.length > 0 ? (
        <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {groupedNotifications.map(([label, items]) => {
            const groupToShow = [];

            for (let i = 0; i < items.length && count < 5; i++) {
              groupToShow.push(items[i]);
              count++;
            }

            if (groupToShow.length === 0) return null;

            return (
              <div key={label} className="space-y-2">
                <h4 className="text-xs font-medium text-white uppercase mb-2 tracking-wider">{label}</h4>
                {groupToShow.map((notification) => (
                  <motion.li
                    key={notification._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-stretch border border-black rounded-xl bg-white hover:bg-gray-100 transition-all duration-200 shadow-sm overflow-hidden"
                  >
                    <div className={`w-5 ${getNotificationColor(notification.title)} rounded-l-xl`} />
                    <div className="flex-1 p-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                      </div>
                      <button
                        onClick={() => handledelete(notification._id)}
                        className="text-gray-500 hover:text-red-500 text-sm transition-colors duration-150 p-2 rounded-full hover:bg-gray-200"
                        aria-label={`Delete notification: ${notification.title}`}
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </div>
            );
          })}

          {notifications.length > 5 && (
            <button
              onClick={() => dispatch(toggleFullnotificationmodal())}
              className="mt-4 text-white hover:text-gray-200 font-medium text-sm transition-colors duration-150"
            >
              View All Notifications
            </button>
          )}
        </ul>
      ) : (
        <div className="text-center py-8 text-sm text-white">No notifications available</div>
      )}

      <AnimatePresence>
        {isFullnotificationmodal && (
          <motion.div
            key="full-notification"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-0"
          >
            <Fullnotificationmodal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Notificationmodal;