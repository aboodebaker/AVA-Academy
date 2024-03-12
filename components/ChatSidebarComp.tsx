// @ts-nocheck
"use client"

import React, {useState} from 'react'
import ChatSideBar from './ChatSideBar'
import MobileSidebar from './mobileSidebar'

const ChatSideBarComplete = ({ chats, chatId, isPro }) => {
    return (
        <div className='h-full'>
            <MobileSidebar chats={chats} chatId={chatId} isPro={isPro} useClient={true} />
        </div>
    );
};

export default ChatSideBarComplete;