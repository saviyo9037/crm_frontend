import Icons from "./Icons";

import PaymentDetails from "../components/payments/PaymentDetails";

import React, { useState } from "react";

import { motion } from "framer-motion";

import { FaBars } from "react-icons/fa";

import Sidebar from "./Sidebar";

import ProductPaymentDetails from "../components/payments/ProductPaymentDetails";

import PaymentAddModel from "../components/payments/PaymentAddModel";

import AllTransactions from "../components/payments/AllTransactions";

import { Paymentprogresschart } from "../components/Paymentprogresschart";

// import Icons from "./Icons";

function Paymentreports() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const [activesettings, setactivesettings] = useState("paymentprogress");

  // toggle active

  return (
    <>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
        {/* Sidebar */}

        <motion.div
          animate={{ x: sidebarVisible ? 0 : -256 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 h-full w-64 z-40 bg-white shadow-md"
        >
          <Sidebar />
        </motion.div>

        {/* Main content */}

        <motion.div
          animate={{ marginLeft: sidebarVisible ? 256 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          {/* Header */}

          <div className="relative flex justify-between items-start">
            <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-300 bg-gray-100">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
                <button
                  className="mr-3 text-blue-600 hover:text-blue-800 transition"
                  onClick={() => setSidebarVisible(!sidebarVisible)}
                >
                  <FaBars className="text-xl" />
                </button>
                Payments
              </h3>

              <div className="flex items-center space-x-2 mt-2 sm:mt-0"></div>
            </div>

            <div className="absolute top-4 right-6">
              <Icons />
            </div>
          </div>

          {/* Body layout */}

          {/* Left menu */}

          <div className="flex flex-wrap justify-start gap-2 p-4 sm:p-6 bg-gray-50 border-b border-gray-200 overflow-x-auto">
            {[
              { key: "paymentprogress", label: "Payment Progress" },

              { key: "paymentdetails", label: "Payment Details" },

              { key: "paymentproductdetails", label: "Product payment" },

              { key: "alltransactions", label: "All Transactions" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setactivesettings(item.key)}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-4xl font-semibold text-sm sm:text-base transition-all whitespace-nowrap ${
                  activesettings === item.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right content */}

          <div className="flex-1 overflow-y-auto p-6">
            {activesettings === "paymentprogress" && (
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* there changed saviyo ............................................................................................... */}

                <Paymentprogresschart />
              </motion.div>
            )}

            {activesettings === "paymentdetails" && (
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PaymentDetails />
              </motion.div>
            )}

            {activesettings === "paymentproductdetails" && (
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductPaymentDetails />
              </motion.div>
            )}

            {activesettings === "alltransactions" && (
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AllTransactions />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default Paymentreports;
