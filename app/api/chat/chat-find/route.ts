import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const prisma = new PrismaClient();
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { chatId } = await req.json();
    const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string };
  const userId = user?.id;
    const chat = await prisma.files.findUnique({
      where: { 
      id: chatId,
      userId:userId 
    },
    });
    console.log('found')
    return new NextResponse(JSON.stringify({chat: chat}), {status:200} )
}
