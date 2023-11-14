import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

interface User {
  id: string;
  // Add other properties as needed
}

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const prisma = new PrismaClient();

  try {
    const body = await req.json();
    const { file_key, file_name, grade, subject, chatpdf } = body;
    console.log(file_key, file_name, grade, subject);

    await loadS3IntoPinecone(file_key);
    const url = getS3Url(file_key)

    const users = await prisma.user.findMany({
      where: {
        grade: {
          equals: grade
        }
      }
    })
    console.log(users)
    for (const user of users) {
      const chat = await prisma.files.create({
        data: {
          pdfName: file_name,
          pdfUrl: url,
          userId: user.id, // Use the user's ID
          subject: subject,
          fileKey: file_key,
          chatpdf: chatpdf,
          grade: grade,
        },
      });
      console.log(`Created chat for user ${user.id}`);
    }

    return NextResponse.json(
      {
        pdf:'url'
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('error'+error);
    
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  } finally {
    // Close the Prisma client when it's no longer needed
    prisma.$disconnect();
  }
}
