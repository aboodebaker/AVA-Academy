import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { getContext } from "@/lib/context";
import {UserSystemEnum } from "@prisma/client";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
  try {
    const { user, assistant, chatId } = await req.json();
    
      
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