// import { prisma } from "@/lib/prisma";
// import { PrismaClient } from "@prisma/client";
// import { NextResponse } from "next/server";
// import bcrypt from 'bcrypt'

// export const POST = async (request) => {
//     const {email, password} = await request.json()
//   if (!email || !password) {
//           return new NextResponse('Please enter your details', {status: 404})
//         }

//         const user = await prisma.user.findUnique({
//           where: {
//             email: email
//           }
//         })

//         if (!user) {
//           return new NextResponse('No user found', {status: 404})
//         }
//         else {
//           if(user.password == null) {
//             return null
//           }
//         const isPasswordValid = await compare(
//           credentials.password,
//           user.password
//         )

//         if (!isPasswordValid) {
//           return new NextResponse('Password is invalid. Please enter the correct password', {status: 404})
//         }

//   return new NextResponse(JSON.stringify({token: user.id, email: user.email, class: user.class, grade: user.grade, name: user.name,}), {status: 200})
// }
// };
