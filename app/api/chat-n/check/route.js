import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/nextauth";
import { PrismaClient } from "@prisma/client";


export async function POST(req, res) {
        const prisma = new PrismaClient()
 const session = await getAuthSession();
  const user = session?.user
  console.log(user)
  const userId = user?.id;
  console.log(userId)
  const userss = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  const users = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      messages: userss.messages + 1
    }
  })
  return new NextResponse({ sucess: true }, { status: 200 });

}