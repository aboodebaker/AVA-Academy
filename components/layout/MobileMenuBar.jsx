//MobileMenuBar.jsx
'use client'
import React from 'react'
import Link from 'next/link'
import { FiMenu as Icon } from 'react-icons/fi'
import { FaUser } from 'react-icons/fa'




export default function MenuBarMobile({ setter, showSidebar }) {
    return (
        <nav className={`md:hidden mb-4 z-20 fixed top-0 left-0 right-0 h-[60px]  flex [&>*]:my-auto px-2 `}>
            <button
                className="text-4xl flex text-white"
                onClick={() => {
                    setter(oldVal => !oldVal);
                }}
            >
                <Icon />
            </button>

        </nav>
    )
}