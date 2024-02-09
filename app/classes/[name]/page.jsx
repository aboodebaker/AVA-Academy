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
  

  const subject = await prisma.subject.findFirst({
    where: {
      name: data,
      userId: userid
    },
    include: {
      files: true
    }
  })

  

  const files = await prisma.files.findMany({
    where: {
      userId:{
        equals: userid
      },
      subjectid: {
        equals: subject.id
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

  const user = await prisma.user.findUnique({
    where: {
      id: userid
    }
  })





  return (
    <div  className='min-h-dvh' id="adobe-dc-view">
  <div className={styles.container }>
    <div className={styles.headertable}>
      <h1 className={styles.header}>{data}</h1>
    </div>
    <FileCarasoul files={files} user={user}/>
    

    
  </div>
{/*   
  <Note notes={notes} /> */}
  </div>
  )
}

export default page