import React from 'react'
import Sidebar from '../Components/Sidebar'

export default function Layout ({
  children,
  hideBar = false,
  hideNav = true,
  hideFooter = true
}) {
  return (
    <main className='min-h-screen bg-[#101B24] text-[#E6EDF2]'>
      {/* Sidebar includes Desktop Sidebar + Mobile Header + Bottom Navigation */}
      <Sidebar hideBar={hideBar} />

      {/* Main Content */}
      <div className='min-h-screen lg:ml-64'>
        <div
          className='
          w-full max-w-screen-2xl mx-auto
          px-4 sm:px-6 lg:px-8
          pt-20 pb-24
          lg:pt-6 lg:pb-6
        '
        >
          {children}
        </div>
      </div>
    </main>
  )
}
