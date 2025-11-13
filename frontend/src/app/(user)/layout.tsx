import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <h1 className="text-2xl my-5 bg-gray-600">
                NavbarSection
            </h1>
            {children}
            <h1 className="text-2xl my-5 bg-gray-600">
                FooterSection
            </h1>
        </div>
    )
}

export default Layout