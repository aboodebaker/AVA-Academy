
import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
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
  });

  if (!files || !files.find((file) => file.id === chatId)) {
    redirect('/');
  }

  const currentFile = files.find((file) => file.id === chatId);
  const isPro = true;
  const url = currentFile?.pdfUrl

  return (
    <div className="flex h-screen">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* chat sidebar */}
        <div className="flex-[2] max-w-xs">
          <ChatSideBar chats={files} chatId={chatId} isPro={isPro} />
        </div>
        {/* pdf viewer */}
        <div className="max-h-screen p-4 overflow-scroll flex-[4]">
          <PDFViewer pdf_Url={url} />
        </div>
        {/* chat component */}
        <div className="flex-[5] border-l-4 border-l-slate-200">
          <ChatComponent chatId={chatId} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
