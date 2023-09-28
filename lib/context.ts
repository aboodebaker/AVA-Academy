import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    const client = new Pinecone({
      environment: process.env.PINECONE_ENVIRONMENT!,
      apiKey: process.env.PINECONE_API_KEY!,
    });
    const pineconeIndex = await client.index("ava-academy");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    
    const queryResult = await namespace.query({
      topK: 3,
      vector: embeddings,
      includeMetadata: true,
    });
    
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

export async function getContext(query: string, fileKey: string) {
  try {
    const queryEmbeddings = await getEmbeddings(query);
    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);

    type Metadata = {
      text?: string;
      pageNumber?: number;
    };

    let docs = matches.map((match) => {
      if (match.metadata && match.metadata.text) {
        return (match.metadata as Metadata).text || "";
      }
      return "";
    });
    
    // 5 vectors
    return docs.join("\n").substring(0, 3000);
  } catch (error) {
    console.error("Error in getContext:", error);
    throw error;
  }
}
