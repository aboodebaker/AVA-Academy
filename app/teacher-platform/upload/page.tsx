// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import React from 'react'
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from 'next/navigation';
import Page from '@/components/upload';

type Props = {}

const page = async (props: Props) => {
  const session = await getAuthSession();
  const prisma = new PrismaClient()
  const users = session?.user as { id: string };
  const userId = users.id;
  if (session) {

  const subjects = await prisma.subject.findMany({
    where: {
      userId: userId
    }
  })
  
  return (
    <div>
      <Page subjects={subjects} />
    </div>
  )
  } else {
    redirect('login')
  }
}

export default page