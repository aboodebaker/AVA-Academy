//@ts-nocheck
import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";
import { PrismaClient } from "@prisma/client";

// Function to retrieve matches from Pinecone embeddings
export async function getMatchesFromEmbeddings(embeddings: any, fileKey: string, chatpdf: string) {
  const prisma = new PrismaClient()
  console.log(chatpdf)
  try {
    const matches = await prisma.filePage.aggregateRaw({
      pipeline: [
        {
          '$vectorSearch': {
            'index': 'file_page_embeddings',
            'path': 'embeddings',
            'queryVector': embeddings,
            'numCandidates': 500,
            'limit': 1,
            'filter': {
              'chatpdf': chatpdf,
            }
          }
        },
        {
          '$project': {
            '_id': 1,
            'text': 1,
            'chatpdf': 1,
            'pageNumber': 1,
            'score': {
              '$meta': 'vectorSearchScore'
            }
          }
        }
      ]
    });
    console.log(matches)

    return matches
    
  } catch (error) {
    console.error("Error querying embeddings:", error);
    throw error;
  } finally{
    prisma.$disconnect()
  }
}

// Function to retrieve context based on a query and file key
export async function getContext(query: string, fileKey: string, fileId: string) {
  try {
    // Get embeddings for the query
    const queryEmbeddings = await getEmbeddings(query);

    // Get matches based on the embeddings and file key
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey, fileId);

    // Define a type for metadata





    let docs = matches.map((match) => {
      if (match && match.text) {
        const text = match.text || "";
        const pageNumber = match.pageNumber;
        return `${text} (Page ${pageNumber})`;
      }
      return "";
    });

    // Combine the extracted information into a single string with a maximum length of 12000 characters
    return docs.join("\n").substring(0, 12000);
  } catch (error) {
    console.error("Error in getContext:", error);
    throw error;
  }
}
