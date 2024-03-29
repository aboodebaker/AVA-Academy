import ChatComponent from "@/components/ChatComponent";
import ChatSideBarComplete from "@/components/ChatSidebarComp";
import PDFViewer from "@/components/PDFViewer";
import { redirect } from "next/navigation";
import React from "react";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string };
  const userId = user?.id;
  if (!userId) {
    redirect('/sign-in');
  }

  const files = await prisma.files.findMany({
    where: {
      userId: userId,
    },
    include: {
      Subject: true,
    }
  });

  if (!files || !files.find((file) => file.id === chatId)) {
    redirect('/');
  }

  const currentFile = files.find((file) => file.id === chatId);
  const isPro = true;
  const url = currentFile?.pdfUrl

  return (
    <div className="flex min-h-dvh ">
      <div className="flex w-full max-h-screen">
        {/* chat sidebar */}
        <div className=" max-h-screen  max-w-xs ">
          <ChatSideBarComplete chats={files} chatId={chatId} isPro={isPro} />
        </div>
        {/* pdf viewer - hide on small screens */}
        <div className="max-h-screen p-4 overflow-scroll flex-[4] hidden sm:block">
          <PDFViewer pdf_Url={url} />
        </div>
        {/* chat component */}
        <div className=" h-screen flex-[5] ">
          <ChatComponent chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
