// @ts-nocheck
import { strict_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/nextauth";
import { getQuestionsSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { getContext } from "@/lib/context";
import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEYS,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request, res: Response) {
  try {

    // if (!session?.user) {
    //   return NextResponse.json(
    //     { error: "You must be logged in to create a game." },
    //     {
    //       status: 401,
    //     }
    //   );
    // }


    const { amount, topic, type, selectedFileId, userId } = await req.json();
    let questions: any
    const prisma = new PrismaClient()
    console.log('here')
    const chat = await prisma.files.findFirst({
      where: {
        chatpdf: selectedFileId,
        userId: userId,
      }
    })


    console.log(chat)


    const fileKey = chat.fileKey;
    console.log(fileKey)
    const newMessage = {
      role: 'user',
      content:  `generate a quiz about this topic: ${topic}`
    }
    const context = await getContext(newMessage.content, fileKey);
    console.log(context)
    console.log('here')
    const prompt = `
      your mission is to be the ultimate assistant for school children seeking answers from their documents. 
      You do not mention that you dont know the document or context ever but give as much knowledge as possible. If you cannot find something in the context
      say that you do not know and maybe check if it is in the document or if they could rephrase the question. Always answer just want the user wants and never previous questions
      Your primary goal is not just to provide quick answers but to act as a patient and informative guide, helping these students understand the content 
      better. Here's how you should operate:
      Setting Expectations: First you will recieve the context of the question from the document through a service called Pinecone. You are to use
      this information and maybe quote parts of this but do not state that you know of this. state it says in the text: ...
      Explain the relevant content, through the context that you recieved and background information. Use a casual tone, making sure the explanations 
      are easy to understand for students below grade 10.
      Step-by-Step Guidance: If the question is complex, consider breaking down the explanation into smaller steps. 
      Provide examples, analogies, or visuals, if applicable, to aid comprehension.
      Interactive Engagement: Encourage active learning. Ask the user questions related to the topic to gauge their 
      understanding and offer hints or clarifications as needed.
      Answer Delivery: Finally, provide a clear and concise answer to the user's question. 
      Remind them to use the context you provided earlier to help form their response. 
      Summarize the key points and ensure the student leaves the interaction with a solid grasp of the topic.
      Encourage Further Exploration: Suggest additional resources or topics the user might find interesting or related to their query, 
      fostering a curiosity for learning.
      Remember, your tone should remain casual and friendly, always keeping in mind that you're assisting young students. 
      Your role is not just to answer questions but to help them become more knowledgeable and confident learners.
      here is your context
      START OF DOCUMENT
      ${context}
      END OF DOCUMENT
      
      `

    





      let questionss = []




      if (type === "open_ended") {
      
      
        const messageContent =`You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array You are to generate a random hard open-ended questions about ${topic} from your document. You are to generate ${amount} questions`

        console.log('here')
        for (let i = 0; i < amount; i++) {
        questions = await strict_output(
        prompt,
        new Array(amount).fill(
          messageContent
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
      questionss.push(questions)

    }












    } else if (type === "mcq") {

      console.log('here')
      
      
      
      
      
      for (let i = 0; i < amount; i++) {

      const messageContent =
      `You are a helpful AI that is able to generate multiple choice question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array You are to generate a random hard open-ended questions about ${topic} from your document. You are to generate ${amount} questions with 1 answer and 3 other choices.
      ${questionss[0] ? `do not use these questions: ${questionss[0]}` : ''} ${questionss[1] ? `or this question: ${questionss[1]}` : ''}
      `
      questions = await strict_output(
        prompt,
        new Array(amount).fill(
           messageContent
        ),
        {
          "question": `<question>. ${questionss[0] ? `do not use these questions: ${questionss[0]}` : ''} ${questionss[1] ? `or this question: ${questionss[1]}` : ''} `,
          "answer": "<answer with max length of 15 words>",
          "option1": "<option1 with max length of 15 words>",
          "option2": "<option2 with max length of 15 words>",
          "option3": "<option3 with max length of 15 words>"
        }
      );
      questionss.push(questions)

    }
    }
    
    
    
    console.log(questionss)
    
    
    return NextResponse.json(
      {
        questions: questionss,
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