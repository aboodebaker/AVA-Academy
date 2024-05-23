//@ts-nocheck
import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export const getPineconeClient = () => {
  return new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

type PDFPage = {
  pageContent: string;
  metadata: {
    text: string;
    loc: { pageNumber: number };
  };
};

export async function loadS3IntoPinecone(fileKey: string, chatpdf: string) {
  // 1. obtain the pdf -> downlaod and read from pdf
  const prisma = new PrismaClient();
  console.log(chatpdf)



  try {


    console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);


  if (!file_name) {
    throw new Error("could not download from s3");
  }


  console.log("loading pdf into memory" + file_name);
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorise and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocument));


  //4. upload to mongoDB
  // for (const document of vectors) {
  //       const { embeddings, text, pageNumber } = document;
        
  //       let filePage = await prisma.filePage.create({
  //         data: {
  //           embeddings: embeddings,
  //           pageNumber: pageNumber,
  //           text: text,
  //           chatpdf: chatpdf,
  //         }
  //       })

       

  //       console.log(`Stored page number ${pageNumber} into MongoDB, ${text !== null || '' ? 'there is text' : 'there is no text'} 
  //       and ${embeddings !== null || '' ? 'there is embeddings' : 'there is no embeddings'}`)

  //   }
  const promises = vectors.map(async (document) => {
    const { embeddings, text, pageNumber } = document;

    try {
      const filePage = await prisma.filePage.create({
        data: {
          embeddings: embeddings,
          pageNumber: pageNumber,
          text: text,
          chatpdf: chatpdf,
        }
      });

      console.log(`Stored page number ${pageNumber} into MongoDB, ${text !== null ? 'there is text' : 'there is no text'} 
        and ${embeddings !== null ? 'there is embeddings' : 'there is no embeddings'}`);

      return filePage;
    } catch (error) {
      console.error(`Error processing document for page number ${pageNumber}:`, error.message);
      return { error: error.message, pageNumber: pageNumber };
    }
  });

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Handle any errors and filter out successful operations
  const errors = results.filter(result => result && result.error);
  const successfulFilePages = results.filter(result => !result.error);

  if (errors.length > 0) {
    console.error('Some operations failed:', errors);
    // Optionally, handle errors, e.g., return them or take other actions
  }



  console.log('complete')


  // 4. upload to pinecone
  // const client = await getPineconeClient();
  // const pineconeIndex = await client.index("ava-academy");
  // const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  // console.log("inserting vectors into pinecone");
  // await namespace.upsert(vectors);

  // console.log('complete')

  return vectors;
  } catch (error) {
    console.log(error)
  }
  
}

async function embedDocument(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);

//text ?? 
    return {
      embeddings: embeddings,
      text: doc.metadata.text, // Safely access the text property
      pageNumber: doc.metadata.pageNumber,
    };
  } catch (error) {
    console.log("Error embedding document:", error);
    throw error;
  }
}

export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};
//truncateStringByBytes(pageContent, 36000) !== null ? truncateStringByBytes(pageContent, 36000) : 
async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, "");
  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: pageContent,
      },
    }),
  ]);
  return docs;
}
