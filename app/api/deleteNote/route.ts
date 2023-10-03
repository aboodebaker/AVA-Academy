import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()
export async function POST(req: Request) {
  const { noteId } = await req.json();
  await prisma.notes.delete({where: {
    id: noteId
  }})
  return new NextResponse("ok", { status: 200 });
}