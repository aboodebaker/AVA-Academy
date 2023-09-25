import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const POST = async (request) => {
  const { name, email, password, grade, classes} = await request.json();
  console.log(name, email, password, grade, classes )

  if( !name || !email ||!password ||!grade ) {
    return new NextResponse("Missing Email, Name, Grade or Password", {status: 400})

  }

  // const exist = prisma.user.findUnique({
  //   where: {
  //     email: email
  //   }
  // });

  // if(exist) {
  //   return new NextResponse("User already exists", {status: 400})

  // }
  const hashedpassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedpassword,
      grade: grade,
      class: classes,
    }
  })

  return NextResponse.json(user, {status: 200})
};