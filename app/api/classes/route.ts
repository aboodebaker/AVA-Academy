//@ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";




export async function POST(req: Request) { 
const prisma = await new PrismaClient()
  const body = await req.json();
  const { id } = body;

  const subjects = await prisma.subject.findMany({
    where: {
      userId: id
    }
  })

  return new NextResponse(subjects, {status: 200})

}