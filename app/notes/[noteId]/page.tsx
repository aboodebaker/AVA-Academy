import DeleteButton from "@/components/DeleteButton";
import TipTapEditor from "@/components/TipTapEditor";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

type Props = {
  params: {
    noteId: string;
  };
};

const NotebookPage = async ({ params: { noteId } }: Props) => {
  const session = await getServerSession(authOptions);
  const users = session?.user as { id?: string };
  const userId = users?.id;
  if (!userId) {
    return redirect("/notes");
  }

  const notes = await prisma.notes.findMany({
    where: {
        id: noteId,
        userId: userId,
    }
  })
  
  const note = notes[0]

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-4xl mx-auto">
        <div className="border shadow-xl border-stone-200 rounded-lg p-4 flex items-center bg-background">
          <Link href="/notes">
            <Button className="bg-primarys text-text rounded" size="sm">
              Back
            </Button>
          </Link>
          <div className="w-3"></div>
          <span className="font-semibold">
          </span>
          <span className="inline-block mx-1">/</span>
          <span className="text-stone-500 font-semibold text-text">{note.title}</span>
          <div className="ml-auto text-text">
            <DeleteButton noteId={note.id} />
          </div>
        </div>

        <div className="h-4"></div>
        <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-full bg-background">
          <TipTapEditor note={note} />
        </div>
      </div>
    </div>
  );
};

export default NotebookPage;