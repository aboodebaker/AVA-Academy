import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { chatId } = await req.json();

  await prisma.message.deleteMany({
    where: {
      fileId: {
        equals: chatId
      },
    },
  });

  return new NextResponse("ok", { status: 200 });
}


