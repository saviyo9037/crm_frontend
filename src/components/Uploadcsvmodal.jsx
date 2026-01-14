import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadbulkleads } from '../services/leadsRouter';
import { useDispatch } from 'react-redux';
import { toggleUploadcsvmodal } from '../redux/modalSlice';
import Spinner from './Spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { API_URL } from '../utils/urls';

function Uploadcsvmodal() {
    const [csvFile, setCsvFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showsuccess, setshowsuccess] = useState(false);
    const [uploadedLeads, setUploadedLeads] = useState([]);
    const dispatch = useDispatch();
    const queryclient = useQueryClient();

    const uploadingcsv = useMutation({
        mutationKey: ['Uploading CSV'],
        mutationFn: uploadbulkleads,
        onSuccess: (data) => {
            queryclient.invalidateQueries(['List leads']);
            setCsvFile(null);
            setUploadedLeads(data?.data || []);
        },
        onError: (error) => {
            setErrorMessage(error?.response?.data?.message || "Upload failed. Please try again.");
        }
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            setCsvFile(file);
            setErrorMessage('');
        } else {
            setErrorMessage('Please upload a valid CSV file.');
            setCsvFile(null);
        }
    };

    const handleSubmit = async () => {
        if (!csvFile) {
            setErrorMessage('Please select a CSV file before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('csvfile', csvFile);
        await uploadingcsv.mutateAsync(formData);
        setshowsuccess(true);
        setTimeout(() => {
            setshowsuccess(false)
            dispatch(toggleUploadcsvmodal());
        }, 5000);
    };

    const handleDownload = () => {
        if (uploadedLeads.length === 0) {
            return;
        }

        const headers = Object.keys(uploadedLeads[0]);
        const csvContent = [
            headers.join(','),
            ...uploadedLeads.map(lead => 
                headers.map(header => 
                    `"${lead[header] || ''}"`
                ).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'uploaded_leads.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        // The outermost div should only handle positioning and allow the parent's backdrop to show.
        // The background color, opacity, and blur are handled by the parent component.
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-lg space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">New Uploads</h2>
                    <a
                        href={`${API_URL}/leads/csv-template`}
                        download
                        className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                    >
                        Download Template
                    </a>
                </div>

                {/* Error Message */}
                {errorMessage && (
                    <p className="text-red-600 text-sm text-center -mt-2">{errorMessage}</p>
                )}

                {/* Upload Box */}
                <label
                    htmlFor="csv-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-blue-500 p-6 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-blue-500 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a1 1 0 001 1h14a1 1 0 001-1v-1M4 12l1.293-1.293a1 1 0 011.414 0L12 16l5.293-5.293a1 1 0 011.414 0L20 12m-8 4V4" />
                    </svg>
                    <p className="text-blue-500 font-medium">Click to browse .csv file</p>
                    <input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>

                {/* File name */}
                {csvFile && (
                    <p className="text-center text-sm text-gray-600">
                        Selected File: <span className="font-medium">{csvFile.name}</span>
                    </p>
                )}

                {/* Spinner */}
                {uploadingcsv.isPending && (
                    <div className="flex justify-center">
                        <Spinner />
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={handleSubmit}
                        className="w-full mr-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                        disabled={uploadingcsv.isPending}
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => dispatch(toggleUploadcsvmodal())}
                        className="w-full ml-2 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Success Popup */}
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
                            className="relative z-10 bg-green-200 text-green-800 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm h-[150px] sm:h-[170px] flex flex-col items-center justify-center text-center"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.5 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                            <p>
                            ✅ Leads added successfully!
                            </p>
                            <button
                                onClick={handleDownload}
                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition"
                            >
                                Download Uploaded Leads
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Uploadcsvmodal;