import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { useQuery } from '@tanstack/react-query';
import { listconvertedcustomers } from '../services/customersRouter';
import Spinner from './Spinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerStatusPieChart = ({ startDate, endDate }) => {
  const { data: customers = [], isLoading, error } = useQuery({
    queryKey: ['Getting Customers'],
    queryFn: async () => {
      let allData = [];
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const response = await listconvertedcustomers({ page: currentPage });
        allData = [...allData, ...(response.customers || [])];
        totalPages = response.totalPages || 1;
        currentPage += 1;
      }

      return { customers: allData, totalCustomers: allData.length };
    },
    staleTime: 5 * 60 * 1000,
  });

  const customerList = Array.isArray(customers?.customers) ? customers.customers : [];

  // Filter customers by date range if provided
  const filteredCustomers = React.useMemo(() => {
    if (!startDate || !endDate) return customerList;
    return customerList.filter((customer) => {
      if (!customer.createdAt) return false;
      const customerDate = new Date(customer.createdAt);
      return customerDate >= startDate && customerDate <= endDate;
    });
  }, [customerList, startDate, endDate]);

  // Count statuses: success, failed, pending
  const statusCount = React.useMemo(() => {
    const counts = {
      success: 0,
      failed: 0,
      pending: 0
    };

    filteredCustomers.forEach(customer => {
      const status = customer.status?.title?.trim().toLowerCase();
      if (status === 'success') counts.success++;
      else if (status === 'failed') counts.failed++;
      else if (status === 'pending') counts.pending++;
      else counts.pending++; // treat unknown as pending or adjust as needed
    });

    return counts;
  }, [filteredCustomers]);
const statuses = [
  { label: `Success: ${statusCount.success}`, value: statusCount.success, color: '#10B981' },
  { label: `Failed: ${statusCount.failed}`, value: statusCount.failed, color: '#EF4444' },
  { label: `Pending: ${statusCount.pending}`, value: statusCount.pending, color: '#F59E0B' },
];

// remove data with 0 value
const filtered = statuses.filter(item => item.value > 0);

const chartData = {
  labels: filtered.map(item => item.label),
  datasets: [
    {
      data: filtered.map(item => item.value),
      backgroundColor: filtered.map(item => item.color),
      borderWidth: 1
    }
  ]
};


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%", // modern donut style
    plugins: {
      legend: {
        display: false, // Hide default legend for custom summary
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw ;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  if (isLoading) return <Spinner />;
  if (error) return <p>Error loading chart.</p>;

  const total = statusCount.success + statusCount.failed + statusCount.pending;
  if (total === 0) {
    return <p className="text-center text-gray-500">No customer status data available.</p>;
  }

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white/60 backdrop-blur-sm flex flex-col items-center">
        {/* <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          📊 Customer Status Distribution
        </h2> */}
        <p className="text-gray-500 text-sm">
          Total Customers: <span className="font-semibold text-gray-800">{total}</span>
        </p>
      </div>

      {/* Chart + Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 items-center gap-6 px-6 py-6">
        {/* Chart Section */}
        <div className="col-span-3 flex items-center justify-center h-[320px] sm:h-[380px] md:h-[400px]">
          {total > 0 ? (
            <Pie data={chartData} options={options} />
          ) : (
            <p className="text-gray-400 text-sm">No customer status data available</p>
          )}
        </div>

        {/* Status Summary */}
        <div className="col-span-2 flex flex-col gap-4">
          {[
            { status: 'Success', count: statusCount.success, color: '#10B981' },
            { status: 'Failed', count: statusCount.failed, color: '#EF4444' },
            { status: 'Pending', count: statusCount.pending, color: '#F59E0B' },
          ].map(({ status, count, color }) => (
            <div
              key={status}
              className="flex justify-between items-center bg-white/80 shadow-sm hover:shadow-md border border-gray-100 rounded-xl px-4 py-3 transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2 text-gray-800 font-semibold">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                ></span>
                <span className="capitalize">{status}</span>
              </div>
              <span className="text-gray-700 font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 text-center py-2 text-xs text-gray-500">
        Updated based on current customer records
      </div>
    </div>
  );
};

export default CustomerStatusPieChart;
