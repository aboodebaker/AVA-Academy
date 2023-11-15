// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import React from 'react'
import Activity from '@/components/Activitys/ActivitySOE';

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

    const file = await prisma.files.findUnique({
      where: {
        id: activity?.fileId
      }
    })

    console.log(activity)
  return (
    <div><Activity game={activity} file={file}/></div>
  )
}

export default page