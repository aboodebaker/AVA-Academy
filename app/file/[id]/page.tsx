import React from 'react'
import { PrismaClient } from '@prisma/client';
import PDFViewer from '@/components/PDFViewerClasses';
type Props = {
    params: any
}

const prisma = new PrismaClient()

const page = async ({params}: Props) => {
  const data = decodeURIComponent(params.id);


  const file = await prisma.files.findUnique({
    where: {
        id: data,
    }
  })

  const activities = await prisma.activity.findMany({
    where: {
        fileId: {
            equals: data
        }
    }
  })

  console.log(activities)

  const courses = await prisma.course.findMany({
    where: {
      fileId: data,
      show: true,
    }
  })
  return (
    <div className='h-full w-full'><PDFViewer id={data} pdf_Url={file?.pdfUrl} activities={activities} userId={file?.userId} courses={courses}></PDFViewer></div>
  )
}

export default page