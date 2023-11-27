// @ts-nocheck
import React from "react";
import { Prisma, PrismaClient } from "@prisma/client";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/forms/ActivityCreationForm";

const page = async () => {
  const prisma = new PrismaClient()



  const files = await prisma.files.findMany({
    include: {
      Subject: true
    }
  })

  return (
    <QuizCreation topic={""} files={files} />
  )
}

export default page