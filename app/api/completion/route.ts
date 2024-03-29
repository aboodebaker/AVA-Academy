import { OpenAIApi, Configuration } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// /api/completion
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge'

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  // extract the prompt from the body
  const { prompt } = await req.json();

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a helpful AI embedded in a educational school notion text editor app that is used to autocomplete sentences
            The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful educational responses to the student.
        AI always just completes the sentance and never writes anything before it.
        AI does not write paragraphs and only writes maximum 3 sentances.
        AI never says sure and always gets straight into completing the sentance.
        `,
      },
      {
        role: "user",
        content: `
        ${prompt}
        `,
      },
    ],
    stream: true,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}