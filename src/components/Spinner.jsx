import React from 'react'

function Spinner() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
            <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-[spin_1s_linear_infinite]" />
        </div>
    )
}

export default Spinner