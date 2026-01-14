// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import * as Yup from 'yup'
// import { useFormik } from 'formik'
// import { AnimatePresence, motion } from 'framer-motion'
// import { FaUserPlus } from 'react-icons/fa'
// import { createadmin } from '../../services/registeradminRouter'
// import { toggleregisteradminModal } from '../../redux/createadminmodalSlice'
// import Spinner from '../Spinner'
// import PhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/lib/style.css'

// function Registeradminmodal() {

//     const dispatch = useDispatch()
//     const queryclient = useQueryClient()

//     const [showsuccess, setshowsuccess] = useState(false)

//     const admin = useMutation({
//         mutationKey: ["create admin"],
//         mutationFn: createadmin,
//         onSuccess: ()=>{
//             queryclient.invalidateQueries(['create admin'])
//         }
//     })

//     const adminvalidation = Yup.object({
//         name: Yup.string().required("Name is required"),
//         email: Yup.string().required("Email is required").matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, "Invalid email format"),
//         mobile: Yup.string().required("Mobile is required"),
//         password: Yup.string().required("Password is required").min(6, "New password must be at least 6 characters").matches(/[A-Z]/, "Password must contain at least one uppercase letter").matches(/\d/, "Password must contain at least one number").matches(/[@$!%*?&]/, "Password must contain at least one special character")
//     })

//     const createadminForm = useFormik({
//         initialValues: {
//             name: '',
//             email: '',
//             mobile: '',
//             password: ''
//         },
//         validationSchema: adminvalidation,
//         onSubmit: async (values) => {
//             await admin.mutateAsync(values)
//             setshowsuccess(true)
//             setTimeout(() => {
//                 dispatch(toggleregisteradminModal())
//                 setshowsuccess(false)
//             }, 1000);
//         }
//     })

//     return (
//         <div className='fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0'>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.4 }}
//                 className='bg-white w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden'
//             >
//                 {admin.isPending &&
//                     <Spinner/>
//                 }
//                 <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-4 sm:p-6 text-white">
//                     <FaUserPlus className='text-5xl sm:text-6xl md:text-[80px] mb-3 sm:mb-4' />
//                     <h2 className='text-lg sm:text-xl md:text-2xl font-bold'>Register as Admin</h2>
//                     <p className='text-xs sm:text-sm mt-2 text-center'>Register as Admin to control the website and to add staffs.</p>
//                 </div>
//                 <div className='relative w-full md:w-2/3 p-4 sm:p-6 md:p-8'>
//                     <button
//                         onClick={() => dispatch(toggleregisteradminModal())}
//                         className='absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition'
//                     >
//                         &times;
//                     </button>
//                     <h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4'>Enter Your Details</h3>

//                     {admin.isError && (
//                         <p className='text-red-600 bg-red-100 p-2 sm:p-3 rounded-md mb-3 sm:mb-4 text-sm sm:text-base'>{admin.error?.response?.data?.message}</p>
//                     )}

//                     <form onSubmit={createadminForm.handleSubmit} className='space-y-3 sm:space-y-4'>
//                         <div>
//                             <input
//                                 type='text'
//                                 name='name'
//                                 value={createadminForm.values.name}
//                                 {...createadminForm.getFieldProps('name')}
//                                 className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
//                                 placeholder='Enter the name'
//                             />
//                             <span className='text-red-500 text-xs block mt-1'>* required</span>
//                             {createadminForm.touched.name && createadminForm.errors.name && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.name}</p>
//                             )}
//                         </div>

//                         <div>
//                             <input
//                                 type='email'
//                                 name='email'
//                                 value={createadminForm.values.email}
//                                 {...createadminForm.getFieldProps('email')}
//                                 className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
//                                 placeholder='Enter the email'
//                             />
//                             <span className='text-red-500 text-xs block mt-1'>* required</span>
//                             {createadminForm.touched.email && createadminForm.errors.email && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.email}</p>
//                             )}
//                         </div>

//                         <div>
//                             <PhoneInput
//                                 country={"us"}
//                                 value={createadminForm.values.mobile}
//                                 onChange={(phone) => createadminForm.setFieldValue("mobile", phone)}
//                                 inputClass="!w-full !p-3 !text-gray-800 !border !border-gray-300 !rounded-lg"
//                                 buttonClass="!border-gray-300"
//                             />
//                             <span className='text-red-500 text-xs block mt-1'>* required</span>
//                             {createadminForm.touched.mobile && createadminForm.errors.mobile && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.mobile}</p>
//                             )}
//                         </div>

//                         <div>
//                             <input
//                                 type='password'
//                                 name='password'
//                                 value={createadminForm.values.password}
//                                 {...createadminForm.getFieldProps('password')}
//                                 className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
//                                 placeholder='Enter the password'
//                             />
//                             <span className='text-red-500 text-xs block mt-1'>* required</span>
//                             {createadminForm.touched.password && createadminForm.errors.password && (
//                                 <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.password}</p>
//                             )}
//                         </div>

//                         <button
//                             type='submit'
//                             className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base'
//                         >
//                             Register
//                         </button>
//                     </form>
//                 </div>
//             </motion.div>
//             <AnimatePresence>
//                 {showsuccess && (
//                     <motion.div
//                         className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <motion.div className="absolute inset-0 bg-black opacity-30" />
//                         <motion.div
//                             className="relative z-10 bg-green-200 text-green-800 px-6 sm:px-10 py-4 sm:py-6 rounded-xl shadow-xl text-sm sm:text-base font-semibold w-full max-w-xs sm:max-w-sm h-[100px] sm:h-[120px] flex items-center justify-center text-center"
//                             initial={{ scale: 0.5 }}
//                             animate={{ scale: 1 }}
//                             exit={{ scale: 0.5 }}
//                             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//                         >
//                             ✅ Admin registered successfully!
//                         </motion.div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     )
// }

// export default Registeradminmodal


import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import { FaUserPlus } from 'react-icons/fa'
import { createadmin } from '../../services/registeradminRouter'
import { toggleregisteradminModal } from '../../redux/createadminmodalSlice'
import Spinner from '../Spinner'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

function Registeradminmodal() {

    const dispatch = useDispatch()
    const queryclient = useQueryClient()

    const [showsuccess, setshowsuccess] = useState(false)

    const admin = useMutation({
        mutationKey: ["create admin"],
        mutationFn: createadmin,
        onSuccess: ()=>{
            queryclient.invalidateQueries(['create admin'])
        }
    })

    const adminvalidation = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().required("Email is required").matches(/.+@.+\..+/, "Invalid email format"),
        mobile: Yup.string().required("Mobile is required"),
        password: Yup.string().required("Password is required").min(6, "New password must be at least 6 characters").matches(/[A-Z]/, "Password must contain at least one uppercase letter").matches(/\d/, "Password must contain at least one number").matches(/[@$!%*?&]/, "Password must contain at least one special character")
    })

    const createadminForm = useFormik({
        initialValues: {
            name: '',
            email: '',
            mobile: '',
            password: ''
        },
        validationSchema: adminvalidation,
        onSubmit: async (values) => {
            await admin.mutateAsync(values)
            setshowsuccess(true)
            setTimeout(() => {
                dispatch(toggleregisteradminModal())
                setshowsuccess(false)
            }, 1000);
        }
    })

    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-0'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className='bg-white w-full max-w-md sm:max-w-lg md:max-w-3xl mx-auto rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden'
            >
                {admin.isPending &&
                    <Spinner/>
                }
                <div className="bg-gradient-to-b from-[#00B5A6] to-[#1E6DB0] w-full md:w-1/3 flex flex-col items-center justify-center p-4 sm:p-6 text-white">
                    <FaUserPlus className='text-5xl sm:text-6xl md:text-[80px] mb-3 sm:mb-4' />
                    <h2 className='text-lg sm:text-xl md:text-2xl font-bold'>Register as Admin</h2>
                    <p className='text-xs sm:text-sm mt-2 text-center'>Register as Admin to control the website and to add staffs.</p>
                </div>
                <div className='relative w-full md:w-2/3 p-4 sm:p-6 md:p-8'>
                    <button
                        onClick={() => dispatch(toggleregisteradminModal())}
                        className='absolute top-3 right-3 sm:top-4 sm:right-4 text-xl sm:text-2xl text-gray-400 hover:text-red-500 transition'
                    >
                        &times;
                    </button>
                    <h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4'>Enter Your Details</h3>

                    {admin.isError && (
                        <p className='text-red-600 bg-red-100 p-2 sm:p-3 rounded-md mb-3 sm:mb-4 text-sm sm:text-base'>{admin.error?.response?.data?.message}</p>
                    )}

                    <form onSubmit={createadminForm.handleSubmit} className='space-y-3 sm:space-y-4'>
                        <div>
                            <input
                                type='text'
                                name='name'
                                value={createadminForm.values.name}
                                {...createadminForm.getFieldProps('name')}
                                className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
                                placeholder='Enter the name'
                            />
                            <span className='text-red-500 text-xs block mt-1'>* required</span>
                            {createadminForm.touched.name && createadminForm.errors.name && (
                                <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type='email'
                                name='email'
                                value={createadminForm.values.email}
                                {...createadminForm.getFieldProps('email')}
                                className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
                                placeholder='Enter the email'
                            />
                            <span className='text-red-500 text-xs block mt-1'>* required</span>
                            {createadminForm.touched.email && createadminForm.errors.email && (
                                <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.email}</p>
                            )}
                        </div>

                        <div>
                            <PhoneInput
                                country={"us"}
                                value={createadminForm.values.mobile}
                                onChange={(phone) => createadminForm.setFieldValue("mobile", phone)}
                                inputClass="!w-full !p-3 !text-gray-800 !border !border-gray-300 !rounded-lg"
                                buttonClass="!border-gray-300"
                            />
                            <span className='text-red-500 text-xs block mt-1'>* required</span>
                            {createadminForm.touched.mobile && createadminForm.errors.mobile && (
                                <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.mobile}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type='password'
                                name='password'
                                value={createadminForm.values.password}
                                {...createadminForm.getFieldProps('password')}
                                className='border border-gray-300 p-2 sm:p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base'
                                placeholder='Enter the password'
                            />
                            <span className='text-red-500 text-xs block mt-1'>* required</span>
                            {createadminForm.touched.password && createadminForm.errors.password && (
                                <p className='text-red-500 text-xs sm:text-sm mt-1'>{createadminForm.errors.password}</p>
                            )}
                        </div>

                        <button
                            type='submit'
                            className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base'
                        >
                            Register
                        </button>
                    </form>
                </div>
            </motion.div>
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
                            ✅ Admin registered successfully!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Registeradminmodal