import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const POST = async (request) => {
  const { name, email, password, grade, Class} = await request.json();
  console.log(name, email, password, grade, Class )

  // if( !name || !email ||!password ||!grade || !Class) {
  //   return new NextResponse("Missing Email, Name, Grade or Password", {status: 400})

  // }
  // if( name == '' || email == '' ||password  == ''||grade  == ''|| Class == '') {
  //   return new NextResponse("Missing Email, Name, Grade or Password", {status: 400})

  // }

  const exist = prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if(exist) {
    return new NextResponse("User already exists", {status: 404})

  }
  const hashedpassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedpassword,
      grade: grade,
      class: Class,
    }
  })

  return NextResponse.json(JSON.stringify({token: user.id, email: user.email, class: user.class, grade: user.grade, name: user.name,}), {status: 200})
};
