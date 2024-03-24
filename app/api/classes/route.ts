//@ts-nocheck
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";




export async function POST(request) { 
const prisma = await new PrismaClient()

  const { id } = await request.json();

  const subjects = await prisma.subject.findMany({
  where: {
    userId: id
  }
});


  return NextResponse.json(subjects, {status: 200})

}