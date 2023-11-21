import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

// Function to retrieve matches from Pinecone embeddings
export async function getMatchesFromEmbeddings(embeddings: number[], fileKey: string) {
  try {
    // Initialize Pinecone client
    const client = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });

    // Retrieve the Pinecone index for "ava-academy"
    const pineconeIndex = await client.index("ava-academy");

    // Create a namespace based on the file key
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    // Query Pinecone for matches
    const queryResult = await namespace.query({
      topK: 3,
      vector: embeddings,
      includeMetadata: true,
    });

    // Filter and return relevant matches
    if (queryResult.matches && Array.isArray(queryResult.matches)) {
      return queryResult.matches.filter(match => {
        if (match.metadata && match.metadata.text) {
          return match.score && match.score > 0.1;
        }
        return false;
      }) || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error querying embeddings:", error);
    throw error;
  }
}

// Function to retrieve context based on a query and file key
export async function getContext(query: string, fileKey: string) {
  try {
    // Get embeddings for the query
    const queryEmbeddings = await getEmbeddings(query);

    // Get matches based on the embeddings and file key
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

    // Define a type for metadata
    type Metadata = {
      text?: string;
      pageNumber?: number;
    };

    // Extract relevant information from matches
    let docs = matches.map((match) => {
      if (match.metadata && match.metadata.text) {
        const text = (match.metadata as Metadata).text || "";
        const pageNumber = (match.metadata as Metadata).pageNumber;
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
