import React from 'react'

const Loading = () => {
    return (
        <div>
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        </div>
    )
}

export default Loading;