const fss = require("fs");
const fs = require('fs/promises');
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { loadS3IntoPinecone } from '@/lib/pinecone';
import { getS3Url } from '@/lib/s3';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { downloadFromS3 } from "@/lib/s3-server";
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
import { strict_output } from '@/lib/gpts';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

interface User {
  id: string;
  // Add other properties as needed
}

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);;
  const user = session?.user as { school?: string };
  const userId = user?.school;

  try {
    const body = await req.json();
    const { file_key, file_name, grade, subject, chatpdf } = body;
    console.log(file_key, file_name, grade, subject);

    await loadS3IntoPinecone(file_key);
    const url = getS3Url(file_key)

    const filename = await downloadFromS3(file_key);

    const pdfData = await fs.readFile(filename);
    const pdfDoc = await PDFDocument.load(pdfData)

    const pagesno = await pdfDoc.getPageCount()

    const loader = new PDFLoader(filename);
    const pages = (await loader.load()) as PDFPage[];

    // Find the specific page
    let summarys = []
    
    for (let i = 0; i < pagesno; i++) {


      const page = pages.find(page => page.metadata.loc.pageNumber === i)?.pageContent;

      let output = await strict_output(
        'You are an ai summariser. summarise the page of a module which a teacher is uploaded. you are to use the exact json format required',
        `your content to summarise is: ${page} `,
        {
          summary: "your summary, if you cannot then just say what is shown",
          topic:"topic of what is in the content. very specific. should be from reasoning and not what is in the text"
        }

      )

      let outputWithPage = {
        summary: output.summary,
        topic: output.topic,
        pageNumber: i,
      }

      summarys.push(outputWithPage)
    }

    const users = await prisma.user.findMany({
      where: {
        grade: {
          in: ['teacher', grade, 'registerUser']
        },
        schoolId: {
          equals: userId
        }
      }
    })
    console.log(users)
    for (const user of users) {

      const subjects = await prisma.subject.findFirst({
        where: {
          uniqueId: subject,
          userId: user.id,
        }
      })

      if (subjects == null) {
        return NextResponse.json(
      {
        error: "no subject like that available"
      },
      { status: 500 }
    );
      }


      const chat = await prisma.files.create({
        data: {
          pdfName: file_name,
          pdfUrl: url,
          userId: user.id, // Use the user's ID
          subjectid: subjects.id,
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


