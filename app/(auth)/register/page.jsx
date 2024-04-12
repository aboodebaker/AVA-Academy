import { PrismaClient } from "@prisma/client";
import React from "react";
import Register from "./component";


const Page = async () => {
 
  const prisma = new PrismaClient()

  const schools = await prisma.school.findMany()
  console.log(schools)

  return (
    <>
    <Register schools={schools} />
    </>
  );
};

export default Page;