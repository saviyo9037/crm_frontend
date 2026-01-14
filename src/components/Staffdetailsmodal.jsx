import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleStaffdetailmodal } from '../redux/modalSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { changepassword, profile_image } from '../services/staffRouter'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { setImage } from '../redux/authSlice'
import Spinner from './Spinner'
import { AnimatePresence, motion } from 'framer-motion'

function Staffdetailsmodal() {
    const dispatch = useDispatch()
    const queryclient = useQueryClient()
    const userlogged = useSelector((state) => state.auth.user)
    const role = useSelector((state) => state.auth.role)
    const [section, setsection] = useState('details')

    const [showsuccess, setshowsuccess] = useState(false)
    const [imagesuccess, setimagesuccess] = useState(false)

    const changingpassword = useMutation({
        mutationKey: ['Change Password'],
        mutationFn: changepassword
    })

    const uploadingImage = useMutation({
        mutationKey: ['Upload Profile'],
        mutationFn: profile_image,
        onSuccess: (profileImage) => {
            dispatch(setImage(profileImage)),
                queryclient.invalidateQueries(['listagents'])
        }
    })

    const profileimagevalidation = Yup.object({
        profileimage: Yup.mixed().required('Profile image is required')
    })

    const profileimageForm = useFormik({
        initialValues: {
            profileimage: null
        },
        validationSchema: profileimagevalidation,

        onSubmit: async (values) => {
            const formData = new FormData()
            formData.append('profileimage', values.profileimage)
            await uploadingImage.mutateAsync(formData)
            setimagesuccess(true)
            setTimeout(() => {
                dispatch(toggleStaffdetailmodal(null))
                setimagesuccess(false)
            }, 1000);
        }
    })

    const changepasswordvalidation = Yup.object({
        oldpassword: Yup.string().required('This field is required'),
        newpassword: Yup.string().required('This field is required').min(6, "New password must be at least 6 characters").matches(/[A-Z]/, "Password must contain at least one uppercase letter").matches(/\d/, "Password must contain at least one number").matches(/[@$!%*?&]/, "Password must contain at least one special character"),
        confirmnewpassword: Yup.string().required('This field is required').oneOf([Yup.ref('newpassword')], "Passwords do not match")
    })

    const changepasswordForm = useFormik({
        initialValues: {
            oldpassword: '',
            newpassword: '',
            confirmnewpassword: ''
        },
        validationSchema: changepasswordvalidation,
        onSubmit: async (values) => {
            await changingpassword.mutateAsync({ id: userlogged.id, formdata: values })
            setshowsuccess(true)
            setTimeout(() => {
                dispatch(toggleStaffdetailmodal(null))
                setshowsuccess(false)
            }, 1000);
        }
    })

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900/70 to-blue-900/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 p-8 relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                    {role !== 'Admin' ? (
                        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Staff Profile
                        </h2>
                    ) : (
                        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Admin Profile
                        </h2>
                    )}
                    <button
                        onClick={() => dispatch(toggleStaffdetailmodal(null))}
                        className="text-gray-400 hover:text-red-500 text-2xl font-bold transition duration-300 transform hover:scale-125"
                    >
                        &times;
                    </button>
                </div>
                <div className="flex gap-4 mb-8">
                    <button
                        className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${section === 'details'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        onClick={() => setsection('details')}
                    >
                        Profile
                    </button>
                    <button
                        className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${section === 'changepassword'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        onClick={() => setsection('changepassword')}
                    >
                        Password
                    </button>
                </div>

                {/* Section Content */}
                {section === 'details' ? (
                    <div className="space-y-4">
                        <div className="flex justify-center mb-4">
                            <div className="w-24 h-24 rounded-full border-2 border-blue-500 overflow-hidden flex items-center justify-center bg-gray-100 shadow-md">
                                <img
                                    src={userlogged?.image}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        {uploadingImage.isLoading && (
                            <Spinner />
                        )}
                        {uploadingImage.isError && (
                            <p className="text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium shadow-sm">
                                Error: {uploadingImage.error?.message}
                            </p>
                        )}
                        {uploadingImage.isSuccess && (
                            <p className="text-green-600 bg-green-50 p-4 rounded-xl text-sm font-medium shadow-sm">
                                Profile picture uploaded successfully!
                            </p>
                        )}
                        <form onSubmit={profileimageForm.handleSubmit} className="flex items-center gap-4">
                            <input
                                type="file"
                                name="profileimage"
                                accept='image/*'
                                onChange={(e) => {
                                    profileimageForm.setFieldValue('profileimage', e.currentTarget.files[0]);
                                }}
                                className="w-48 px-3 py-2 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 text-sm file:mr-3 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                            >
                                Upload
                            </button>
                        </form>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                            <span className="font-medium text-gray-700">Name:</span>
                            <span className="text-gray-900 font-semibold">{userlogged.name}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                            <span className="font-medium text-gray-700">Email:</span>
                            <span className="text-gray-900 font-semibold">{userlogged.email}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                            <span className="font-medium text-gray-700">Role:</span>
                            <span className="text-gray-900 font-semibold capitalize">{userlogged.role}</span>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow-sm">
                            <span className="font-medium text-gray-700">Mobile:</span>
                            <span className="text-gray-900 font-semibold">{userlogged.mobile}</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {changingpassword.isLoading && (
                            <Spinner />
                        )}
                        {changingpassword.isError && (
                            <p className="text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium shadow-sm">
                                {changingpassword.error?.response?.data?.message}
                            </p>
                        )}
                        <form onSubmit={changepasswordForm.handleSubmit} className="space-y-5">
                            <div>
                                <input
                                    type="password"
                                    name="oldpassword"
                                    placeholder="Current Password"
                                    value={changepasswordForm.values.oldpassword}
                                    {...changepasswordForm.getFieldProps('oldpassword')}
                                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50 text-gray-900 placeholder-gray-400"
                                />
                                {changepasswordForm.touched.oldpassword && changepasswordForm.errors.oldpassword && (
                                    <p className="text-red-500 text-xs mt-2">{changepasswordForm.errors.oldpassword}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="newpassword"
                                    placeholder="New Password"
                                    value={changepasswordForm.values.newpassword}
                                    {...changepasswordForm.getFieldProps('newpassword')}
                                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50 text-gray-900 placeholder-gray-400"
                                />
                                {changepasswordForm.touched.newpassword && changepasswordForm.errors.newpassword && (
                                    <p className="text-red-500 text-xs mt-2">{changepasswordForm.errors.newpassword}</p>
                                )}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    name="confirmnewpassword"
                                    placeholder="Confirm New Password"
                                    value={changepasswordForm.values.confirmnewpassword}
                                    {...changepasswordForm.getFieldProps('confirmnewpassword')}
                                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-gray-50 text-gray-900 placeholder-gray-400"
                                />
                                {changepasswordForm.touched.confirmnewpassword && changepasswordForm.errors.confirmnewpassword && (
                                    <p className="text-red-500 text-xs mt-2">{changepasswordForm.errors.confirmnewpassword}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition duration-300 shadow-md"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>

                )}
            </div>
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
                            ✅ Password changed successfully!
                        </motion.div>
                    </motion.div>
                )}
                {imagesuccess && (
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
                            ✅ Profile picture changed successfully!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Staffdetailsmodal