import { PrismaClient } from '@prisma/client';
import React from 'react'
import Activity from '@/components/Activitys/Activity';

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
            questions: true
        }
    })

    console.log(activity)
  return (
    <div><Activity game={activity}/></div>
  )
}

export default page