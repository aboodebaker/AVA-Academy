import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { redirect } from "next/navigation";
import React from "react";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Chatcomp from '@/components/chat/page'


const page = async() => {
  const prisma = new PrismaClient()
  const session = await getServerSession(authOptions);
  const userId = session?.user.id
  if (!userId) {
    redirect('/sign-in');
  }

  const files = await prisma.files.findMany({
    where: {
      userId: userId,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });


  const isPro = true;
  const systemprompt = `
  You are a teaching assistant.`
  return (
    <div className="min-h-dvh">
      {user.messages + 1 < user.messageLimit ? 
    <div className="flex h-screen overflow-scroll">
      <div className="flex w-full flex-[1] max-h-screen overflow-scroll">
        <ChatSideBar chats={files} chatId={null} isPro={isPro} />
        </div>
        <div className="max-h-screen p-4  flex-[5]">
          <Chatcomp systemprompt={systemprompt} />
      </div>
    
    </div>
: <p>you do not have any more messages left</p>}
    </div>
  );
}
export default page;