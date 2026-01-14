import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { FaEdit } from 'react-icons/fa'
import { activateGstSettings, getsettingsgst } from '../../services/settingservices/gstSettingsRouter'
import { useDispatch } from 'react-redux'
import { togglegsteditModal } from '../../redux/settingsmodalSlice'
import { AnimatePresence } from 'framer-motion'

const Gstmodal = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();

    const fetchingGst = useQuery({
        queryFn:getsettingsgst,
        queryKey:["fetching_gst_data"]
    })

    const updatingActivegst = useMutation({
        mutationFn:activateGstSettings,
        mutationKey:["gst_activate"],
        onSuccess:()=>{
            queryClient.invalidateQueries(["List_settingstatus"])
        }
    })

    const handleActivegst = async (gstDataId,active) => {
        await updatingActivegst.mutateAsync({
            gstDataId,
            active
        })
    }
  return (
    <div>
        
        <table className="min-w-full text-xs sm:text-sm mt-4">
            <thead className="bg-gray-200 text-gray-700">
                <tr>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Product_gst</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Gst_amount</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Edit</th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold">Active</th>
                </tr>
                
            </thead>
            <tbody>
                {fetchingGst?.data?.getGst?.map((gst,index)=>(
                
                    <tr className="border-b" key={index}>
                        <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{gst.type}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">{gst.gst_amount}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-3 truncate">
                            <button
                                className="text-blue-600 hover:text-blue-800 text-base sm:text-lg"
                                onClick={() => dispatch(togglegsteditModal(gst))}
                            >
                            <FaEdit />
                            </button>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-3">
                            <label className="relative inline-flex items-center cursor-pointer w-10 sm:w-11 h-5 sm:h-6">
                                    <input    
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={!!gst?.active}
                                        onChange={(e)=>handleActivegst(gst._id,e.target.checked)}
                                        />
                                        
                                        <div className="w-10 sm:w-11 h-5 sm:h-6 bg-red-600 rounded-full peer-checked:bg-green-600 transition-colors duration-300"></div>
                                        <div className="absolute left-1 top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                            </label>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}


export default Gstmodal