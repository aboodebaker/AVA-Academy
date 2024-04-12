import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

interface User {
  id: string;
  // Add other properties as needed
}
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// /api/create-chat
export async function POST(req: Request, res: Response) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);;
  const user = session?.user as { school?: string };
  const userId = user?.school;

  try {
    const body = await req.json();
    const { image, name, grade } = body;
    console.log(image, name, grade);



    var randomInteger = getRandomInt(1, 1000000000);

    // Convert the random integer to a string
    var uniqueId = randomInteger.toString();

    

    const users = await prisma.user.findMany({
      where: {
        grade: {
          in: ['teacher', grade, 'registerUser']
        },
        schoolId: {
          equals: userId,
        }
      }
    })
    console.log(users)
    for (const user of users) {
      const chat = await prisma.subject.create({
        data: {
          image: image,
          name: name,
          grade: grade,
          userId: user.id,
          uniqueId: uniqueId,
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
