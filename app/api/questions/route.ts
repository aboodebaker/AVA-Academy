import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";

export async function POST(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a game." },
    //     {
    //       status: 401,
    //     }
    //   );
    // }
    const body = await req.json();

    const { amount, topic, type, selectedFileId } = getQuestionsSchema.parse(body);
    let questions: any

    if (type === "open_ended") {
      
      
      const messageContent =`You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array You are to generate a random hard open-ended questions about ${topic} from your document. You are to generate ${amount} questions`

      const message = [{
        role: 'user',
        content: messageContent
      }]
    const config = {
      headers: {
            'x-api-key': 'sec_6ZyhabQToOvz2tf7DDqjbpNeuDNeZifR',
            'Content-Type': 'application/json',
          },
      }

      const response = await axios.post(
        'https://api.chatpdf.com/v1/chats/message',
          {
            sourceId: selectedFileId,
            messages: message,
          },
          config
        );

        const stream = await response.data.content;



          console.log(stream)
      questions = await strict_output(
        "You are a helpful AI that is able to change questions and answers into a JSON array",
        new Array(amount).fill(
          `You are to change these question and answers into a JSON array: ${stream}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );

      console.log(questions)
    } else if (type === "mcq") {


      const messageContent =`You are a helpful AI that is able to generate multiple choice question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array You are to generate a random hard open-ended questions about ${topic} from your document. You are to generate ${amount} questions with 1 answer and 3 other choices.`

      const message = [{
        role: 'user',
        content: messageContent
      }]
    const config = {
      headers: {
            'x-api-key': 'sec_6ZyhabQToOvz2tf7DDqjbpNeuDNeZifR',
            'Content-Type': 'application/json',
          },
      }

      const response = await axios.post(
        'https://api.chatpdf.com/v1/chats/message',
          {
            sourceId: selectedFileId,
            messages: message,
          },
          config
        );

        const stream = await response.data.content;
        console.log(stream)

      questions = await strict_output(
        "You are a helpful AI that is able to change questions and answers into a JSON array",
        new Array(amount).fill(
           `You are to change these question and answers into a JSON array and remove the letters before: ${stream}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
          option1: "option1 with max length of 15 words",
          option2: "option2 with max length of 15 words",
          option3: "option3 with max length of 15 words",
        }
      );
    }
    console.log(questions)
    return NextResponse.json(
      {
        questions: questions,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      console.error("elle gpt error", error);
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}
