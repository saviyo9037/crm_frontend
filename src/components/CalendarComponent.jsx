import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarComponent = ({ onDateChange, selectedDate }) => {
  const [date, setDate] = useState(selectedDate || null);

  const handleChange = (newDate) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h5 className="text-lg font-semibold mb-2">Select a Date</h5>
      <DatePicker
        selected={date}
        onChange={handleChange}
        inline
        className="w-full"
      />
    </div>
  );
};

export default CalendarComponent;
