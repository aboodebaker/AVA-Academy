import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(req: Request) {
  const { courseId } = await req.json();
  await prisma.course.delete({where: {
    id: courseId
  }})
  return new NextResponse("ok", { status: 200 });
}