import React from "react";
import { Prisma, PrismaClient } from "@prisma/client";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/QuizCreation";

export const metadata = {
  title: "Quiz | Quizmify",
  description: "Quiz yourself on anything!",
};

interface Props {
  searchParams: {
    topic?: string;
  };
}

const Quiz = async ({ searchParams }: Props) => {
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
    }
  })




  return <QuizCreation topic={searchParams.topic ?? ""} files={files} />;
};

export default Quiz;
