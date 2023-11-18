// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import React from 'react'
import Activity from '@/components/Activitys/ActivityMS';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface Props {
  params: {
    topic?: string;
    id:string;
  };
}

const page = async ({ params }: Props) => {
    const data = decodeURIComponent(params.id);
    const prisma = new PrismaClient()
const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string };
  const userId = user?.id;
    const activity = await prisma.activity.findUnique({
        where: {
            id: data
        },
        include: {
            questions: true,
        }
    })

    console.log(activity?.questions)

    const file = await prisma.files.findUnique({
      where: {
        id: activity?.fileId
      }
    })
    console.log(activity?.noteId)
    if (activity?.noteId !== null) {
    const note = await prisma.notes.findUnique({
      where: {
        id: activity?.noteId
      }
    })
    console.log(note)
    return (
    <div><Activity game={activity} file={file} note={note} userId={userId}/></div>
  )
}
  


    if (activity?.noteId == null) {
    const notes = await prisma.notes.findMany({
      where: {
        subject: file?.subject
      }
      
    }
    )
  
    
  return (
    <div><Activity game={activity} file={file} notes={notes} userId={userId}/></div>
  )
  }
}




export default page