// import React from 'react'

// const LeadtabCustomerUpdate = () => {
//   return (
//     <div>
//            <div className="px-4 sm:px-6 pt-4 pb-3 bg-white">
//                             <div >
//                                 <div>

//                                     <div className="grid grid-cols-3 gap-4 text-sm sm:text-base text-blue-700 mb-4 ">


//                                         <button className={`px-3 py-1 rounded border-2 ${activeTab === 'personal' ? 'bg-blue-500 text-white' : ' bg-green-700 text-white'}`} onClick={() => setActiveTab('personal')}>Personal Details</button>
//                                         <button className={`px-3 py-1 rounded ${activeTab === 'payment' ? 'bg-blue-500 text-white' : ' bg-green-700 text-white'}`} onClick={() => setActiveTab('payment')}>Payment</button>
//                                         <button className={`px-3 py-1 rounded ${activeTab === 'followups' ? 'bg-blue-500 text-white' : ' bg-green-700 text-white'}`} onClick={() => setActiveTab('followups')}>Follow-ups</button>


//                                     </div>
// {/* <button>
//     <div className="grid grid-cols-3 gap-2 text-sm sm:text-base mb-4">
//   {['personal', 'payment', 'followups'].map((tab) => (
//     <button
//       key={tab}
//       className={`px-3 py-1 rounded border ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-200'}`}
//       onClick={() => setActiveTab(tab)}
//     >
//       {tab === 'personal' ? 'Personal Details' : tab === 'payment' ? 'Payment' : 'Follow-ups'}
//     </button>
//   ))}
// </div>
// </button> */}
//                                     {activeTab === "personal" && (
//                                         <div>

//                                             <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }} className='mt-3'>
//                                                 <div className="space-y-3 mt-4">

//                                                     <p className="flex items-center gap-2">
//                                                         <FontAwesomeIcon icon={faUser} className="text-[#00B5A6] w-4" />
//                                                         <strong className="font-semibold text-gray-800">Created By:</strong>
//                                                         <span className="text-gray-600">{selectedlead?.createdBy?.name || 'N/A'}</span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2">
//                                                         <FontAwesomeIcon icon={faTag} className="text-[#00B5A6] w-4" />
//                                                         <strong className="font-semibold text-gray-800">Source:</strong>
//                                                         <span className="text-gray-600">{selectedlead?.source?.title || 'N/A'}</span>
//                                                     </p>
//                                                     <p className="flex items-center gap-2">
//                                                         <FontAwesomeIcon icon={faDollarSign} className="text-[#00B5A6] w-4" />
//                                                         <strong className="font-semibold text-gray-800">Lead Value:</strong>
//                                                         <span className="text-gray-600">{selectedlead?.leadvalue || 'Not Given'}</span>
//                                                     </p>
//                                                 </div>

//                                                 {/* Right Column */}
//                                                 <div className="text-left sm:text-right space-y-3">
//                                                     <p className="flex sm:justify-end items-center gap-2">
//                                                         <FontAwesomeIcon icon={faCalendar} className="text-[#00B5A6] w-4" />
//                                                         <strong className="font-semibold text-gray-800">Date:</strong>
//                                                         <span className="text-gray-600 ml-1">
//                                                             {selectedlead?.createdAt
//                                                                 ? new Date(selectedlead.createdAt).toLocaleDateString('en-US')
//                                                                 : 'N/A'}
//                                                         </span>
//                                                     </p>
//                                                     {selectedlead?.role === 'user' &&
//                                                         selectedlead?.status !== 'converted' &&
//                                                         !metadata && (
//                                                             <button
//                                                                 onClick={() => convertcustomer(selectedlead?._id, 'converted')}
//                                                                 className="mt-2 inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
//                                                             >
//                                                                 <FontAwesomeIcon icon={faCheckCircle} />
//                                                                 Convert to Customer
//                                                             </button>
//                                                         )}
//                                                 </div>
//                                                 {/* Follow-up Section */}
//                                                 {fetchnextfollowup?.data?.setting?.isnextfollowupActive &&
//                                                     (selectedlead?.status === 'new' || selectedlead?.status === 'open' || selectedlead.priority ==="Not Assigned") && (
//                                                         <div className="col-span-full text-center bg-white p-4 rounded-2xl shadow-md">
//                                                             <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1.5 flex items-center justify-center gap-1.5">
//                                                                 <FontAwesomeIcon icon={faCalendarCheck} className="text-[#00B5A6]" />
//                                                                 Next Follow-up Date
//                                                             </h3>
//                                                             <p className="mb-2 text-lg sm:text-xl font-bold text-gray-900">
//                                                                 {selectedlead?.nextFollowUp && !isDateover
//                                                                     ? new Date(selectedlead.nextFollowUp).toLocaleDateString('en-GB', {
//                                                                         day: '2-digit',
//                                                                         month: 'short',
//                                                                         year: 'numeric',
//                                                                     })
//                                                                     : 'Follow-up not set'}
//                                                             </p>
//                                                             <div className="flex justify-center items-center gap-2">
//                                                                 <input
//                                                                     id="followupDate"
//                                                                     type="date"
//                                                                     disabled={isdisabled}
//                                                                     value={nextFollowupdate}
//                                                                     onChange={(e) => setnextFollowupdate(e.target.value)}
//                                                                     className="px-2 py-1.5 w-36 text-xs border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00B5A6] transition-all duration-300 bg-white disabled:bg-gray-100"
//                                                                 />
//                                                                 {isdisabled ? (
//                                                                     <p className="text-red-500 text-sm font-medium">
//                                                                         Updated by {selectedlead?.nextfollowupupdatedBy?.name}
//                                                                     </p>
//                                                                 ) : (
//                                                                     <button
//                                                                         type="button"
//                                                                         className="inline-flex items-center gap-1.5 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white text-sm px-4 py-1.5 rounded-full font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
//                                                                         onClick={handlenextfollowup}
//                                                                     >
//                                                                         <FontAwesomeIcon icon={faCalendarCheck} />
//                                                                         Set
//                                                                     </button>
//                                                                 )}
//                                                             </div>
//                                                             {dateerror && (
//                                                                 <p className="text-red-600 text-xs mt-1 font-medium">{dateerror}</p>
//                                                             )}
//                                                         </div>
//                                                     )}

//                                                 <div className="bg-white p-4 sm:p-6 rounded-b-2xl shadow-lg relative">
//                                                     <form
//                                                         className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
//                                                         onSubmit={updateuserleadsform.handleSubmit}
//                                                     >
//                                                         {!metadata && (
//                                                             <div className="absolute top-3 right-3">
//                                                                 <button
//                                                                     type="submit"
//                                                                     className="inline-flex items-center gap-1.5 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
//                                                                 >
//                                                                     <FontAwesomeIcon icon={faCheckCircle} />
//                                                                     Update
//                                                                 </button>
//                                                             </div>
//                                                         )}
//                                                         {filteredleadform?.length > 0 ? (
//                                                             filteredleadform.map((leadform, index) => {
//                                                                 const inputType = leadform.type;
//                                                                 return (
//                                                                     <div key={index} className="relative min-h-[40px]">
//                                                                         <label className="text-xs font-semibold text-gray-800 mb-1.5 flex items-center gap-1.5">
//                                                                             <FontAwesomeIcon
//                                                                                 icon={inputType === 'file' || inputType === 'image' ? faFileDownload : faTag}
//                                                                                 className="text-[#00B5A6]"
//                                                                             />
//                                                                             {leadform?.name}
//                                                                         </label>
//                                                                         {inputType === 'textarea' ? (
//                                                                             <textarea
//                                                                                 name={`userDetails[${index}].value`}
//                                                                                 value={
//                                                                                     updateuserleadsform.values.userDetails[index]?.value || ''
//                                                                                 }
//                                                                                 onChange={updateuserleadsform.handleChange}
//                                                                                 className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5A6] shadow-sm text-xs transition-all duration-300 resize-none h-20"
//                                                                             />
//                                                                         ) : inputType === 'choice' ? (
//                                                                             <select
//                                                                                 name={`userDetails[${index}].value`}
//                                                                                 value={
//                                                                                     updateuserleadsform.values.userDetails[index]?.value || ''
//                                                                                 }
//                                                                                 onChange={updateuserleadsform.handleChange}
//                                                                                 className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5A6] shadow-sm text-xs transition-all duration-300"
//                                                                             >
//                                                                                 <option value="" label="Select an option" />
//                                                                                 {leadform.options?.map((option, optIndex) => (
//                                                                                     <option key={optIndex} value={option}>
//                                                                                         {option}
//                                                                                     </option>
//                                                                                 ))}
//                                                                             </select>
//                                                                         ) : inputType === 'file' || inputType === 'image' ? (
//                                                                             <div className="flex items-center gap-3">
//                                                                                 <input
//                                                                                     name={`userDetails[${index}].value`}
//                                                                                     type="file"
//                                                                                     onChange={(event) => {
//                                                                                         const file = event.currentTarget.files[0];
//                                                                                         updateuserleadsform.setFieldValue(
//                                                                                             `userDetails[${index}].value`,
//                                                                                             file
//                                                                                         );
//                                                                                     }}
//                                                                                     accept={inputType === 'image' ? 'image/*' : undefined}
//                                                                                     className="p-2 border border-gray-200 rounded-lg focus:ring-2 w-[50%] focus:ring-[#00B5A6] shadow-sm text-xs transition-all duration-300 flex-1 "
//                                                                                 />
//                                                                                 {updateuserleadsform.values.userDetails[index]?.value && (
//                                                                                     <button
//                                                                                         className="inline-flex items-center gap-1.5 bg-[#00B5A6] hover:bg-[#1E6DB0] text-white font-semibold py-1.5 px-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
//                                                                                         type="button"
//                                                                                         onClick={() =>
//                                                                                             handleDownload(
//                                                                                                 updateuserleadsform.values.userDetails[index]
//                                                                                                     ?.value
//                                                                                             )
//                                                                                         }
//                                                                                     >
//                                                                                         <FontAwesomeIcon icon={faFileDownload} />
//                                                                                         Download
//                                                                                     </button>
//                                                                                 )}
//                                                                             </div>
//                                                                         ) : (
//                                                                             <input
//                                                                                 name={`userDetails[${index}].value`}
//                                                                                 value={
//                                                                                     updateuserleadsform.values.userDetails[index]?.value || ''
//                                                                                 }
//                                                                                 onChange={updateuserleadsform.handleChange}
//                                                                                 type={inputType}
//                                                                                 className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00B5A6] shadow-sm text-xs transition-all duration-300"
//                                                                             />
//                                                                         )}
//                                                                     </div>
//                                                                 );
//                                                             })
//                                                         ) : (
//                                                             <div className="col-span-1 sm:col-span-2 text-center text-gray-500 text-xs py-4 min-h-[40px]">
//                                                                 No lead form data available
//                                                             </div>
//                                                         )}
//                                                     </form>


//                                                 </div>

//                                             </div>
//                                         </div>

//                                     )
//                                     }

//                                     {activeTab === "payment" && (

//                                         <div style={{ border: "1px solid #ccc", padding: "40px", marginBottom: "10px" }}>



//                                             <p className=' flex justify-between mb-4'>
//                                                 <strong> Course Name:</strong>
//                                                 <span>{selectedlead?.courseName || "N/A"} </span></p>

//                                             <p className="flex justify-between mb-4">
//                                                 <strong>Course Duration:</strong>
//                                                 <span>{selectedlead?.courseName || "N/A"}</span>
//                                             </p>


//                                             <p className='flex justify-between mb-4'><strong> Course Total Fees: </strong><span>{selectedlead?.courseFees || "N/A"} </span></p>

//                                             <p className=' flex justify-between mb-4'><strong> Total payment: </strong><span>{selectedlead?.totalpayment || "N/A"} </span></p>

//                                             <p className=' flex justify-between mb-4'><strong> Due Amount: </strong><span>{selectedlead?.DueAmount || "N/A"} </span></p>




//                                         </div>
//                                     )}

//                                     {activeTab === "followups" && (
//                                         <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
//                                             <div>
//                                                 {selectedlead?.followups && selectedlead.followups.length >0 ? (
//                                                     <ul>  {console.log(followups, "vd")
//                                                     }
//                                                         {selectedlead.followups.map((f, index) => (
//                                                             <li>
//                                                                 <p>{f.date}</p>
//                                                                 <p>{f.nextDate}</p>
//                                                                 <p>{f.note}</p>
//                                                                 <p>{f.status}</p>

//                                                             </li>
//                                                         ))}
//                                                     </ul>
//                                                 ) : (
//                                                     <p className=' text-red-800'>No Followups Available !!</p>

//                                                 )}</div>


//                                         </div>
//                                     )}


//                                     {/* Left Column */}
//                                 </div>
//                             </div>
//                         </div>
      
//     </div>
//   )
// }

// export default LeadtabCustomerUpdate
