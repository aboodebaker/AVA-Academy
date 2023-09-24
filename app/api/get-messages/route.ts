import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();



export const POST = async (req: Request) => {
  const { chatId } = await req.json();
  const _messages = await prisma.message.findMany({
    where: {
      fileId: chatId,
    },
  });
  return NextResponse.json(_messages);
};

// Close the Prisma client when it's no longer needed
prisma.$disconnect();
