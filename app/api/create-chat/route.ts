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
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string };
  const userId = user?.id;
  

  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);

    await loadS3IntoPinecone(file_key);

    // Create a Files record instead of a chat record
    const chat = await prisma.files.create({
      data: {
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId: userId,
        fileKey: file_key,
      },
    });

    return NextResponse.json(
      {
        chat_id: chat.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  } finally {
    // Close the Prisma client when it's no longer needed
    prisma.$disconnect();
  }
}
