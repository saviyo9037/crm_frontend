import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { listleads } from '../services/leadsRouter';
import Spinner from './Spinner';
import LeadStatusDonutChart from './DonutChart';
import { motion } from 'framer-motion';

const DailyLeadsOverviewChart = ({ startDate, endDate }) => {
  const userlogged = useSelector((state) => state.auth.user);

  const todayStart = moment().startOf('day').toISOString();
  const todayEnd = moment().endOf('day').toISOString();

  const startDateToUse = startDate ? moment(startDate).startOf('day').toISOString() : todayStart;
  const endDateToUse = endDate ? moment(endDate).endOf('day').toISOString() : todayEnd;

  const { data: dailyLeads, isLoading: dailyLeadsLoading, error: dailyLeadsError } = useQuery({
    queryKey: ['Daily Leads', startDateToUse, endDateToUse, userlogged.role],
    queryFn: ({ queryKey }) => {
      const [_key, start, end, role] = queryKey;
      return listleads({
        startDate: start,
        endDate: end,
        noLimit: role === 'Admin',
      });
    },
    retry: 3,
  });

  if (dailyLeadsError) {
    console.error('Daily Leads Query error:', dailyLeadsError);
    return <div className="p-4 text-red-600">Error loading daily leads data.</div>;
  }

  return (
    <motion.div
      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition overflow-hidden min-h-[200px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Daily Leads Overview</h4>
      <div className="w-full h-auto">
        <LeadStatusDonutChart leads={dailyLeads?.leads} isLoading={dailyLeadsLoading} title="Daily Leads Overview" />
      </div>
    </motion.div>
  );
};

export default DailyLeadsOverviewChart;