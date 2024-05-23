// @ts-nocheck
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
import { strict_output as strict_o } from '@/lib/gpt';
import { count } from 'console';
import { Configuration, OpenAIApi } from "openai";
import generateQRCode from '@/lib/qrcode'
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

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEYS,
});
const openai = new OpenAIApi(config);

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  const user = session?.user as { school?: string };
  const userId = user?.school;

  try {
    const body = await req.json();
    const { file_key, file_name, grade, subject, chatpdf } = body;
    console.log(file_key, file_name, grade, subject, chatpdf);
    

    const vectors = await loadS3IntoPinecone(file_key, chatpdf);
    const url = getS3Url(file_key)

    const filename = await downloadFromS3(file_key);

    const pdfData = await fs.readFile(filename);
    const pdfDoc = await PDFDocument.load(pdfData)

    const pagesno = await pdfDoc.getPageCount()

    const loader = new PDFLoader(filename);
    const pages = (await loader.load()) as PDFPage[];

    // Find the specific page
    // let summarys = []
    //
    // for (let i = 1; i <= pagesno; i++) {
    //   const page = pages.find(page => page.metadata.loc.pageNumber === i)?.pageContent;

    //   if (page) {
    //     let output = await strict_output(
    //       'You are an ai summariser. summarise the page of a module which a teacher is uploaded. you are to use the exact json format required. If it looks like an activity please put into your summary that it is an activity.',
    //       `your content to summarise is: ${page} `,
    //       {
    //         summary: "your summary, if you cannot then just say what is shown",
    //         topic:"topic of what is in the content. should be a bit specific eg. (graphs)"
    //       }
    //     )

    //     let outputWithPage = {
    //       summary: output.summary,
    //       topic: output.topic,
    //       pageNumber: i,
    //     }

    //     console.log(outputWithPage)

    //     summarys.push(outputWithPage)
    //   }
    // }

    const promises = Array.from({ length: pagesno }, (_, i) => {
    const pageNumber = i + 1;
    const page = pages.find(page => page.metadata.loc.pageNumber === pageNumber)?.pageContent;

      if (page) {
        // Return the promise from strict_output directly
        return strict_output(
          'You are an AI summariser. Summarise the page of a module which a teacher has uploaded. You are to use the exact JSON format required. If it looks like an activity please put into your summary that it is an activity.',
          `Your content to summarise is: ${page}`,
          {
            summary: "your summary, if you cannot then just say what is shown",
            topic: "topic of what is in the content. should be a bit specific eg. (graphs)"
          }
        ).then(output => ({
          summary: output.summary,
          topic: output.topic,
          pageNumber: pageNumber,
        }));
      } else {
        return Promise.resolve(null); // Return a resolved promise with null for missing pages
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Filter out null results (where pages were not found)
    const summarys = results.filter(result => result !== null);

    // Output the results
    summarys.forEach(outputWithPage => {
      console.log(outputWithPage);
    });


    const prompt = [{
      role: "system",
      content: `You are an ai topics analyser. You are to analyse the multiple summaries provided with the page number and determine where topics start and end. You are to specify the topic clearly. The summaries are page by page summaries of a pdf document used to teach students. there are multiple topics so group it in a []',
      
      you are to use a strict Json format: 
      [ 
        {
          topic: 'the name of the topic. Be pricise and not generic eg.(wrong answer: Grade 8 skills, right answer: Graph Skills)',
          pageStart: 'the page where the topic start',
          pageEnd: 'the page where the topic ends'
        },
        {
          topic: 'the name of the topic. Be pricise and not generic eg.(wrong answer: Grade 8 skills, right answer: Graph Skills)',
          pageStart: 'the page where the topic start',
          pageEnd: 'the page where the topic ends'
        },
        ...
    ]`
    },
    {
      role: "user",
      content: `
      You are an ai topics analyser. You are to analyse the multiple summaries provided with the page number and determine where topics start and end. You are to specify the topic clearly. The summaries are page by page summaries of a pdf document used to teach students. there are multiple topics so group it in a []',
      Group similar topics: eg. line graphs, histograms, - these should be placed under something broad like graphs
      you are to use a strict Json format: 
      {
        topics: [ 
        {
          topic: 'the name of the topic. Be pricise and not generic eg.(wrong answer: Grade 8 skills, right answer: Graph Skills)',
          pageStart: 'the page where the topic start',
          pageEnd: 'the page where the topic ends'
        },
        {
          topic: 'the name of the topic. Be pricise and not generic eg.(wrong answer: Grade 8 skills, right answer: Graph Skills)',
          pageStart: 'the page where the topic start',
          pageEnd: 'the page where the topic ends'
        },
        ...
      ]
    }

    here are the page by page summaries of a module called ${file_name}: ${JSON.stringify(summarys)},`
    }
]

  const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: prompt,
      response_format: { type: "json_object" },
      
    });
    // const topics = response.data.choices[0].message?.content.topics

    // console.log(topics)


    // for (const topic of topics) {
    //   const topicLink = `https://ava-academy.vercel.app/topic/${topic.topic}`;
    //   const pageNumber = topic.pageStart - 1;
    //   const qrCodeUrl = await generateQRCode(topicLink);
    //   const qrImage = await pdfDoc.embedPng(qrCodeUrl);

    //   const page = pdfDoc.getPage(pageNumber-1);
    //   const { width, height } = page.getSize();




    //   page.drawImage(qrImage, {
    //     x: width - 50,
    //     y: height - 100, // Adjust as needed
    //     width: 50,
    //     height: 50,
    //   });

    //   page.drawText(topic, {
    //     x: width- 120,
    //     y: height - 50, // Adjust as needed
    //     size: 12,
    //     font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    //     color: rgb(0, 0, 0),
    //   });
    // }

    // Embed QR codes and links for subtopics
    // for (const subtopic of subtopics) {
    //   const videoId = await searchYoutube(subtopic);
    //   const subtopicLink = `https://www.youtube.com/watch?v=${videoId}`;
    //   const pageNumber = pageNumberMap.get(subtopic);
    //   const qrCodeUrl = await generateQRCode(subtopicLink);
    //   const qrImage = await pdfDoc.embedPng(qrCodeUrl);

    //   const page = pdfDoc.getPage(pageNumber);
    //   const { width, height } = page.getSize();

    //   page.drawImage(qrImage, {
    //     x: 50,
    //     y: height - 150, // Adjust as needed
    //     width: 50,
    //     height: 50,
    //   });

    //   page.drawText(subtopic, {
    //     x: 120,
    //     y: height - 100, // Adjust as needed
    //     size: 12,
    //     font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    //     color: rgb(0, 0, 0),
    //   });
    // }

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    fss.writeFileSync('./edited.pdf', modifiedPdfBytes);
    console.log('check edited.pdf')

    // Now you can save or upload the modified PDF as needed
  





















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
    // for (const user of users) {

    //   const subjects = await prisma.subject.findFirst({
    //     where: {
    //       uniqueId: subject,
    //       userId: user.id,
    //     }
    //   })

    //   if (subjects == null) {
    //     return NextResponse.json(
    //       {
    //         error: "no subject like that available"
    //       },
    //       { status: 500 }
    //     );
    //   }

    //   const chat = await prisma.files.create({
    //     data: {
    //       pdfName: file_name,
    //       pdfUrl: url,
    //       userId: user.id, // Use the user's ID
    //       subjectid: subjects.id,
    //       fileKey: file_key,
    //       chatpdf: chatpdf,
    //       grade: grade,
    //     },
    //   });
      
    //   console.log(`Created chat for user ${user.id}`);
    // }

    const promise = users.map(async (user) => {
    try {
      const subjects = await prisma.subject.findFirst({
        where: {
          uniqueId: subject,
          userId: user.id,
        }
      });

      if (subjects == null) {
        throw new Error(`No subject available for user ${user.id}`);
      }

      const chat = await prisma.files.create({
        data: {
          pdfName: file_name,
          pdfUrl: url,
          userId: user.id,
          subjectid: subjects.id,
          fileKey: file_key,
          chatpdf: chatpdf,
          grade: grade,
        },
      });

      console.log(`Created chat for user ${user.id}`);
      return chat;
    } catch (error) {
      console.error(`Error processing user ${user.id}:`, error.message);
      // Return an error object to identify failures
      return { error: error.message, userId: user.id };
    }
  });

  // Wait for all promises to resolve
  const result = await Promise.all(promise);

  // Handle any errors and filter out successful operations
  const error = result.filter(result => result && result.error);
  const successfulChat = result.filter(result => !result.error);

  if (error.length > 0) {
    console.error('Some operations failed:', error);
    // Optionally, handle errors, e.g., return them or take other actions
  }


    return NextResponse.json(
      {
        pdf:'url'
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('error: ' + error.message);
    
    return NextResponse.json(
      { error: 'internal server error' },
      { status: 500 }
    );
  } finally {
    // Close the Prisma client when it's no longer needed
    prisma.$disconnect();
  }
}



