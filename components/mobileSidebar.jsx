'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu as Icon } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { Button } from "./ui/button";

const MobileSidebar = ({ chats, chatId, isPro }) => {
    const [showSidebar, setShowSidebar] = useState(false); 

    return (
        <div className='overflow-hidden max-h-screen'>
            {/* Button for small devices */}
            <button
                className="md:hidden text-l flex text-text absolute top-0 left-0 mb-4 z-20 m-1"
                onClick={() => {
                    setShowSidebar(!showSidebar);
                }}
            >
                <Icon />
            </button>
            
            {/* Sidebar */}
            <div className={`md:flex  md:flex-col md:bg-gray-900 md:text-gray-200 ${showSidebar ? 'block' : 'hidden'} md:relative`}>
                {/* <nav className="md:hidden absolute top-0 left-0 mb-4 z-20 h-[60px] flex [&>*]:my-auto px-2 justify-between items-center ">
                    <button
                        className="text-l flex text-text"
                        onClick={() => {
                            setShowSidebar(!showSidebar);
                        }}
                    >
                        <Icon />
                    </button>
                </nav> */}

                 <Link href="/chat">
                    <Button className="w-full border-dashed border-white border m-5 text-text">
                    
                    Normal Chat
                    </Button>
                </Link>
                <div className="flex h-screen w-full overflow-hidden pb-20 flex-col gap-2 mt-4">
                    {chats.map((chat) => (
                        <Link key={chat.id} href={`/chat/${chat.id}`}>
                            <div
                                className={`rounded-lg p-3 flex items-center ${chat.id === chatId ? 'bg-blue-600 text-white' : 'hover:text-white'}`}
                            >
                                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-white text-ellipsis">
                                    {chat.pdfName}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MobileSidebar;
