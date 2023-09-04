import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession, } from "next-auth";
import {authOptions} from '@/app/api/auth/[...nextauth]/route'

export async function GET(req, res) {
  try {
    const session = await getServerSession(authOptions)
    

    

    

    return NextResponse.json(session, {status:200})
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    return NextResponse.error("Internal Server Error", { status: 500 });
  }
}