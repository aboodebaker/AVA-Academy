import { OpenAIApi, Configuration } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEYS,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const response = await openai.createEmbedding({
      model: "text-embedding-3-small",
      input: text.replace(/\n/g, " "),
    });

    // Access the response data directly using the 'data' property
    
    const test = await response.data


    
    return test.data[0].embedding as number[];
  } catch (error) {
    console.log("error calling openai embeddings api", error);
    throw error;
  }
}
