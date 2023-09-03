"use client"

import React, {useState} from 'react'
import Sidebar from './Sidebar'
import MenuBarMobile from './MobileMenuBar'

const Tester = () => {
    const [showSidebar, setShowSidebar] = useState(false);
  return (
    <div className='min-h-screen'>
    <MenuBarMobile setter={setShowSidebar} />
    <Sidebar show={showSidebar} setter={setShowSidebar} />
    </div>
  )
}

export default Tester