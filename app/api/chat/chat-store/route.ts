// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { Configuration, OpenAIApi } from "openai";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import {UserSystemEnum } from "@prisma/client";
import { NextResponse } from "next/server";
import serverSession from '@/lib/serverSession';


export async function POST(req: Request) {
  try {
    const { user, assistant, chatId } = await req.json();
    const users = await serverSession()
      
    await prisma.message.create({
        data: {
          content: user,
          role: UserSystemEnum.user, // Use the updated enum value
          fileId: chatId,
          
        },
      });

    
      await prisma.message.create({
  data: {
    content: assistant, // Provide a default value if it's possibly undefined
    role: UserSystemEnum.system, // Use the updated enum value
    fileId: chatId, // Use chatId as fileId, you may need to adjust this based on your schema
  },
});

return new NextResponse('', { status: 200 });

  } catch (error) {
    console.log(error)
  } finally {
    // Close the Prisma client when it's no longer needed
    prisma.$disconnect();
  }
}