// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import React from 'react'
import Activity from '@/components/Activitys/ActivityMS';

interface Props {
  params: {
    topic?: string;
    id:string;
  };
}

const page = async ({ params }: Props) => {
    const data = decodeURIComponent(params.id);
    const prisma = new PrismaClient()

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
    <div><Activity game={activity} file={file} note={note}/></div>
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
    <div><Activity game={activity} file={file} notes={notes}/></div>
  )
  }
}




export default page