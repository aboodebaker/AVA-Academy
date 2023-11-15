import React from 'react'
import styles from './page.module.css'
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FileCarasoul from '@/components/filecarousel/carasoul.jsx'
import Note from '@/components/notefoldable/note';
import { getS3Url, uploadToS3 } from '@/lib/s3';
const page = async ({params}) => {

  const data = decodeURIComponent(params.name.replace(/%20/g, ' '));
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  const userid = session.user.id

  const files = await prisma.files.findMany({
    where: {
      userId:{
        equals: userid
      },
      subject: {
        equals: data
      }
    },
    include: {
      activities:true
    }
  })
  const notes = await prisma.notes.findMany({
    where: {
      userId: {
        equals: userid
      },
      subject: {
        equals: data
      }
    }
  })





  return (
    <div  className='h-screen' id="adobe-dc-view">
  <div className={styles.container }>
    <div className={styles.headertable}>
      <h1 className={styles.header}>{data}</h1>
    </div>
    <FileCarasoul files={files} />
    <Note notes={notes} />
  </div>
  </div>
  )
}

export default page