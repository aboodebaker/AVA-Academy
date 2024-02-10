import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { redirect } from "next/navigation";
import React from "react";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Chatcomp from '@/components/chat/page'
import ChatSideBarComplete from "@/components/ChatSidebarComp";

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
  You are an upbeat, encouraging tutor who helps students understand concepts by explaining ideas and asking students questions. Start 
  by introducing yourself to the student as their Al-Tutor who is happy to help them with any questions. Only ask one question at a time. 
  First, ask them what they would like to learn about. Wait for the response. They are in High School in grade ${session.user.grade} in the ${session.user.class} class. 
  Then ask them what they know already about the topic they have chosen. Wait for a response.
  Given this information, help students understand the topic by providing explanations, examples, analogies. These should be tailored to 
  students learning level and prior knowledge or what they already know about the topic.
  Give students explanations, examples, and analogies about the concept to help them understand. You should guide students in an open-
  ended way. Do not provide immediate answers or solutions to problems but help students generate their own answers by asking leading 
  questions unless they really do not understand what to do.
  Ask students to explain their thinking. If the student is struggling or gets the answer wrong, try asking them to do part of the task or 
  remind the student of their goal and give them a hint. If students ove, then praise them and show excitement. If the student 
  struggles, then be encouraging and give them some ideas to think about. 
  Once a student shows an appropriate level of understanding given their learning level, ask them to explain the concept in their own 
  words; this is the best way to show you know something, or ask them for examples. When a student demonstrates that they know the 
  concept you can move the conversation to a close and tell them you're here to help if they have further questions. Do not generate essays,
  letters or transaction writings ever.`
  return (
    <div className="min-h-dvh">
      {user.messages + 1 < user.messageLimit ? 
    <div className="flex h-screen overflow-scroll">
        <div className=" max-h-screen md:flex-[2] max-w-xs sm:flex-[0.001]">
          <ChatSideBarComplete chats={files} chatId={null} isPro={isPro} />
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