// @ts-nocheck
import React from "react";
import { Prisma, PrismaClient } from "@prisma/client";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreationFormWithId";

export const metadata = {
  title: "Quiz | Quizmify",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: {
    topic?: string;
    id:string;
  };
}

const Quiz = async ({ params }: Props) => {
    const data = decodeURIComponent(params.id);
    console.log(data)
  const session = await getAuthSession();
  const prisma = new PrismaClient()
  const user = session?.user as { id?: string };
  const userId = user?.id;
  if (!session?.user) {
    redirect("/");
  }

  const files = await prisma.files.findMany({
    where: {
      userId: {
      equals: userId
      }
    },
    include: {
      Subject: true,
    }
  })




  return <QuizCreation topic={params.topic ?? ""} files={files} id={data} />;
};

export default Quiz;
