import { useMutation, useQuery } from '@tanstack/react-query'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import * as Yup from 'yup'
import { logindata } from '../services/authRouter'
import { useDispatch, useSelector } from 'react-redux'
import { loginaction } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { FaChartLine, FaTasks, FaUserTie } from 'react-icons/fa'
import Spinner from '../components/Spinner'
import { togglepasswordModal } from '../redux/passwordmodalSlice'
import Passwordmodal from '../components/passwordcomponents/Passwordmodal'
import Registeradminmodal from '../components/Admincomponents/Registeradminmodal'
import { toggleregisteradminModal } from '../redux/createadminmodalSlice'
import { countadmin } from '../services/registeradminRouter'

function Auth() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isPasswordmodal = useSelector((state) => state.passwordmodal.passwordModal)
    const isRegisteradminmodal = useSelector((state) => state.createadminmodal.registeradminModal)

    const [showPassword, setshowPassword] = useState(false)

    const { data: countingadmin } = useQuery({
        queryKey: ['Counting admin'],
        queryFn: countadmin
    })

    const modulelogin = useMutation({
        mutationKey: ["Login"],
        mutationFn: logindata,
        onSuccess: (loginuserdata) => {
            const decodedData = jwtDecode(loginuserdata.token)

            dispatch(loginaction(loginuserdata))

            if (decodedData.role === "Admin") {
                navigate("/admindashboard");
            } else if (decodedData.role === "Sub-Admin") {
                navigate("/subadminhome");
            } else if (decodedData.role === "Agent") {
                navigate("/subadminhome")
            } else {
                navigate("/userhome");
            }
        }
    })

    const loginvalidation = Yup.object({
        email: Yup.string().required("Email is required"),
        password: Yup.string().required("Password is required")
    })

    const loginForm = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: loginvalidation,
        onSubmit: async (values) => {
            await modulelogin.mutateAsync(values)
        }
    })

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-[#00B5A6] to-[#1E6DB0]">
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-white shadow-2xl lg:rounded-r-3xl"
            >
                <div className="w-full max-w-md">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1E6DB0] mb-2">Sign In</h2>
                    <p className="text-gray-500 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base">Login with your credentials</p>

                    {modulelogin.isPending &&
                        <Spinner />
                    }

                    {modulelogin.isError && (
                        <p className="text-red-600 bg-red-100 p-3 rounded-lg text-center mb-4 text-sm sm:text-base">
                            {modulelogin.error?.response?.data?.message || 'Login failed. Please try again.'}
                        </p>
                    )}

                    <form onSubmit={loginForm.handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <input
                                type="email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6DB0] focus:outline-none placeholder-gray-400 text-sm sm:text-base"
                                name="email"
                                value={loginForm.values.email}
                                {...loginForm.getFieldProps('email')}
                                placeholder="Enter your email"
                            />
                            {loginForm.touched.email && loginForm.errors.email && (
                                <p className="text-red-500 text-xs sm:text-sm mt-1">{loginForm.errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E6DB0] focus:outline-none placeholder-gray-400 text-sm sm:text-base"
                                    name="password"
                                    value={loginForm.values.password}
                                    {...loginForm.getFieldProps('password')}
                                    placeholder="Enter your password"
                                />
                                <div
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center cursor-pointer text-gray-500"
                                    onClick={() => setshowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </div>
                            </div>
                            {loginForm.touched.password && loginForm.errors.password && (
                                <p className="text-red-500 text-xs sm:text-sm">{loginForm.errors.password}</p>
                            )}
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => dispatch(togglepasswordModal())}
                                className="text-xs sm:text-sm text-[#1E6DB0] hover:underline focus:outline-none mt-1"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#00B5A6] hover:bg-[#1E6DB0] text-white py-3 rounded-lg font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                        >
                            Login
                        </button>
                    </form>
                    {countingadmin?.count === 0 &&
                        <button
                            onClick={() => dispatch(toggleregisteradminModal())}
                            className="w-full mt-5 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white py-3 rounded-lg font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                        >
                            Register as Admin
                        </button>
                    }
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="hidden lg:flex w-1/2 items-center justify-center p-4 sm:p-6 lg:p-10"
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-white max-w-md text-center"
                >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-6 tracking-wide">Welcome to CRM Pro!</h1>
                    <ul className="space-y-4 text-base sm:text-lg text-left font-medium">
                        <li className="flex items-center gap-3">
                            <FaUserTie className='text-[#FFD700] text-lg sm:text-xl' />
                            Lead Management
                        </li>
                        <li className="flex items-center gap-3">
                            <FaTasks className='text-[#FFD700] text-lg sm:text-xl' />
                            Clients & Task Handling
                        </li>
                        <li className="flex items-center gap-3">
                            <FaChartLine className='text-[#FFD700] text-lg sm:text-xl' />
                            Real-Time Report Tracking
                        </li>
                    </ul>
                </motion.div>
            </motion.div>
            <AnimatePresence>
                {isPasswordmodal && (
                    <motion.div
                        key="staff"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute inset-0 bg-black"
                        />
                        <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                            <Passwordmodal />
                        </div>
                    </motion.div>
                )}
                {isRegisteradminmodal && (
                    <motion.div
                        key="staff"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute inset-0 bg-black"
                        />
                        <div className="relative z-10 w-full max-w-md sm:max-w-lg">
                            <Registeradminmodal />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Auth