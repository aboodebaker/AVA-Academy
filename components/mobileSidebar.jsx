'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { FiMenu as Icon } from 'react-icons/fi';
import { FaUser } from 'react-icons/fa';
import { Button } from "./ui/button";

const MobileSidebar = ({ chats, chatId, isPro, useClient }) => {
    const [showSidebar, setShowSidebar] = useState(false); 

    return (
        <div className='overflow-hidden max-h-screen'>
            {useClient ? (
                <button
                    className=" text-l flex text-text  mb-4 z-20 m-1 mt-8"
                    onClick={() => {
                        setShowSidebar(!showSidebar);
                    }}
                >
                    <Icon />
                </button>
            )
        : <></>}
            
            <div className={` ${showSidebar ? 'block flex  flex-col bg-gray-900 text-gray-200 relative' : 'hidden'} `}>
                <div className="flex h-screen w-full overflow-hidden pb-20 flex-col gap-2 mt-4">
                    <div className='flex justify-center align-center w-full'>
                        <Link href="/chat">
                            <Button className="w-90 border-dashed border-white border m-5 text-white">
                                Normal Chat
                            </Button>
                        </Link>
                    </div>
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
