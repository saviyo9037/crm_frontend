import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleleadformeditModal } from '../../redux/settingsmodalSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editleadsettingsformfields } from '../../services/settingservices/leadFormFieldsSettingsRouter';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { AnimatePresence, motion } from 'framer-motion';
import Spinner from '../Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function Leadformfieldseditmodal() {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const selectedForm = useSelector((state) => state.settingsmodal.selectedForm);
    const [showSuccess, setShowSuccess] = useState(false);
    const [options, setOptions] = useState(selectedForm?.options || []);
    const [optionInput, setOptionInput] = useState('');

    const updatingLeadForm = useMutation({
        mutationKey: ['Update lead form'],
        mutationFn: editleadsettingsformfields,
        onSuccess: () => {
            queryClient.invalidateQueries(['List Form Fields']);
            setOptions([]); // Clear options only on successful submission
            setOptionInput('');
        },
    });

    const validateEditLeadForm = Yup.object({
        name: Yup.string().required('Field name is required'),
        type: Yup.string().required('Field type is required'),
        options: Yup.array().when('type', {
            is: 'choice',
            then: (schema) =>
                schema
                    .of(Yup.string())
                    .min(1, 'At least one option is required for dropdown')
                    .required('Options are required for dropdown'),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    const editLeadForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: selectedForm?.name || '',
            type: selectedForm?.type || '',
            options: selectedForm?.options || [],
        },
        validationSchema: validateEditLeadForm,
        onSubmit: async (values) => {
            try {
                await updatingLeadForm.mutateAsync({
                    settingsleadformId: selectedForm._id,
                    settingsleadformdata: values,
                });
                setShowSuccess(true);
                setTimeout(() => {
                    dispatch(toggleleadformeditModal(null));
                    setShowSuccess(false);
                    editLeadForm.resetForm(); // Reset form after submission
                }, 1000);
            } catch (error) {
                console.error('Submission error:', error);
            }
        },
    });

    const handleAddOption = () => {
        if (optionInput.trim()) {
            const newOptions = [...options, optionInput.trim()];
            setOptions(newOptions);
            editLeadForm.setFieldValue('options', newOptions);
            setOptionInput('');
        }
    };

    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
        editLeadForm.setFieldValue('options', newOptions);
    };

    const handleTypeChange = (e) => {
        editLeadForm.handleChange(e);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-2 sm:px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white w-full max-w-lg sm:max-w-2xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 relative"
            >
                <button
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 text-xl sm:text-2xl text-gray-500 hover:text-red-600 transition-colors"
                    onClick={() => dispatch(toggleleadformeditModal(null))}
                >
                    &times;
                </button>

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Edit Field Type</h2>

                {updatingLeadForm.isPending && <Spinner />}
                {updatingLeadForm.isError && (
                    <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm sm:text-base">
                        {updatingLeadForm.error?.response?.data?.message}
                    </div>
                )}
                <form onSubmit={editLeadForm.handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                {...editLeadForm.getFieldProps('name')}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                                placeholder="Enter field name"
                            />
                            {editLeadForm.touched.name && editLeadForm.errors.name && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{editLeadForm.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                name="type"
                                {...editLeadForm.getFieldProps('type')}
                                onChange={handleTypeChange}
                                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                            >
                                <option value="" disabled>Select field type</option>
                                <option value="text">Character</option>
                                <option value="number">Number</option>
                                <option value="email">Email</option>
                                <option value="textarea">Textarea</option>
                                <option value="file">File</option>
                                <option value="image">Image</option>
                                <option value="date">Date</option>
                                <option value="choice">Dropdown</option>
                                <option value="checkbox">Checkbox</option>
                            </select>
                            {editLeadForm.touched.type && editLeadForm.errors.type && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{editLeadForm.errors.type}</p>
                            )}
                        </div>
                    </div>

                    {/* {editLeadForm.values.type === 'choice' && (
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Dropdown Options
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={optionInput}
                                    onChange={(e) => setOptionInput(e.target.value)}
                                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                                    placeholder="Enter option"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                                    disabled={!optionInput.trim()}
                                >
                                    Add
                                </button>
                            </div>
                            {options.length > 0 && (
                                <ul className="mt-2 max-h-[130px] overflow-y-auto rounded-lg border border-gray-200">
                                    {options.map((option, index) => (
                                        <li
                                            key={index}
                                            className={`flex justify-between items-center text-sm px-3 py-2 ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                                            }`}
                                        >
                                            <span>{option}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(index)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Remove option"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {editLeadForm.touched.options && editLeadForm.errors.options && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{editLeadForm.errors.options}</p>
                            )}
                        </div>
                    )} */}

                    <div className="text-xs sm:text-sm text-gray-500">
                        <span className="font-medium">Note:</span> For phone numbers, please select the "Character" type.
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                        Submit
                    </button>
                </form>
            </motion.div>
            <AnimatePresence>
                {showSuccess && (
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
                            ✅ Lead form edited successfully!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Leadformfieldseditmodal;