import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { deleteS3Object, getS3Url } from '@/lib/s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';


// /api/create-chat
export async function POST(req, res) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  const user = session.user
  const userId = user.id;
  try {
    const body = await req.json();
    const { file_key, oldUrl } = body;


    const url = getS3Url(file_key)

    const file = await prisma.files.findFirst({
      where: {
        userId: {
            equals: userId
        },
        pdfUrl: {
            equals: oldUrl
        }
      }
    })

    const fileId = file.id

    const updated = await prisma.files.update({
        where: {
            id: {
                equals: fileId
            },
        },
        data: {
          fileKey: file_key,
          pdfUrl: url,
          edited: file.edited + 1,
        }
    })
    
    if (file.edited != 0) {
      deleteS3Object(file.fileKey)
    }
    
    

    return NextResponse.json(
      {
        pdf: url
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
