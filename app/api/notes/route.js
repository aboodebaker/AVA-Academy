import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req, res) {
  try {
    const { email, title, subject, content, shared } = await req.json();

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.error("User not found", { status: 404 });
    }

    // Create a new note for the user
    const newNote = await prisma.notes.create({
      data: {
        title,
        subject,
        content,
        shared,
        userId: user.id,
      },
    });

    return NextResponse.json(newNote, { status: 200 });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    
  }
}
