// @ts-nocheck
"use client"

import React, {useState} from 'react'
import ChatSideBar from './ChatSideBar'
import MobileSidebar from './mobileSidebarTeacher'

const ChatSideBarComplete = ({ chats, chatId, isPro }) => {
    return (
        <div className='max-h-screen'>
            <MobileSidebar chats={chats} chatId={chatId} isPro={isPro} />
        </div>
    );
};

export default ChatSideBarComplete;