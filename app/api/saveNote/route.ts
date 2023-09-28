import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { noteId, editorState } = body;
    if (!editorState || !noteId) {
      return new NextResponse("Missing editorState or noteId", { status: 400 });
    }

    const note = await prisma.notes.findUnique({
      where: { id: noteId },
    });
    
    if (!note) {
      return new NextResponse("failed to update", { status: 500 });
    }

    const updatedNote = await prisma.notes.update({
      where: { id: noteId },
      data: {
        editorState: editorState,
      },
    });

    
    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}