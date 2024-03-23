//@ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";




export async function POST(req: Request) { 
const prisma = await new PrismaClient()

  const { id } = await req.json();

  const subjects = await prisma.subject.findMany({
    where: {
      userId: id
    }
  })

  return new NextResponse(subjects, {status: 200})

}