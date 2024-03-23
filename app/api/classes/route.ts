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
});

const plainSubjects = subjects.map(subject => {
  return {
    id: subject.id,
    name: subject.name,
    picture: subject.image,
  };
});

  return new NextResponse(plainSubjects, {status: 200})

}