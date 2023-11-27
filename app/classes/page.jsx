import Class from '@/components/classes/page'
import React from "react";
import { getServerSession, } from "next-auth";
import styles from "./page.module.css";
import Link from "next/link";
import {authOptions} from '@/app/api/auth/[...nextauth]/route'
import Loader from "@/components/loader/Loader";
import Image from "next/image";
import { skip } from "node:test";
import { redirect } from "next/navigation";
import { url } from "node:inspector";
import ClassCard from "../../components/classcard/page";
import { PrismaClient } from '@prisma/client';

const Page = async () => {
  const prisma = new PrismaClient()
  const session = await getServerSession(authOptions)
  const user = session.user
  const userId = user.id

  

  
  if (session) {
    
  const subjects = await prisma.subject.findMany({
    where: {
      userId: userId
    }
  })



return (
  <div className={styles.container}>
    <div className={styles.headertable}>
      <h1 className={styles.header}>Classes</h1>
    </div>
    <Class subjects={subjects}/>
  </div>
);
  } 
  
  else {
    // Handle the case where no session is found
    redirect("/login");
  }

  };


export default Page;