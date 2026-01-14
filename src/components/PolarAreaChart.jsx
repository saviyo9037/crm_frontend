import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { listconvertedcustomers } from '../services/customersRouter';
import Spinner from './Spinner';

// Register chart elements
ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

function PolarAreaChart() {
  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['Getting Customers'],
    queryFn: listconvertedcustomers,
  });

  // Count payment statuses
  const statusCount = {
    pending: 0,
    'partially paid': 0,
    paid: 0,
  };

  // Ensure customers.customers is an array before iterating
  const customerList = Array.isArray(customers?.customers) ? customers.customers : [];

  customerList.forEach((customer) => {
    const payment = typeof customer.payment === 'string' ? customer.payment.toLowerCase() : null;
    if (payment && statusCount.hasOwnProperty(payment)) {
      statusCount[payment]++;
    }
  });

  const data = {
    labels: ['Pending', 'Partially Paid', 'Paid'],
    datasets: [
      {
        label: 'Payment Status',
        data: [statusCount['pending'], statusCount['partially paid'], statusCount['paid']],
        backgroundColor: ['#facc15', '#60a5fa', '#22c55e'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top', // Changed to 'top' for better responsiveness
        labels: {
          font: { size: 12, family: "'Inter', sans-serif" },
        },
      },
      tooltip: {
        backgroundColor: '#1E6DB0',
        titleFont: { size: 14, family: "'Inter', sans-serif" },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 12, family: "'Inter', sans-serif" },
        },
      },
    },
  };

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-red-500 text-sm">Error loading chart.</p>;
  if (customerList.length === 0) return <p className="text-gray-500 text-sm">No customer data available.</p>;

  return (
    <div className="p-4 bg-white shadow-md rounded-2xl max-w-md w-full">
      <h2 className="text-xl font-semibold mb-4">Customer Payment Status</h2>
      <div className="h-[300px]">
        <PolarArea data={data} options={options} />
      </div>
    </div>
  );
}

export default PolarAreaChart;