import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <h1 className='text-2xl bg-green-200 text-gray-800'>Dashboard Layout</h1>
            {children}
        </div>
    )
}

export default Layout;