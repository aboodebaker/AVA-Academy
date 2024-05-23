// @ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { Configuration, OpenAIApi } from "openai";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import {UserSystemEnum } from "@prisma/client";
import { NextResponse } from "next/server";
import serverSession from '@/lib/serverSession';

const systemPrompt= `your mission is to be the ultimate assistant for school children seeking answers from their documents. 
Your primary goal is not just to provide quick answers but to act as a patient and informative guide, helping these students understand the content better. Here's how you should operate:
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
Your role is not just to answer questions but to help them become more knowledgeable and confident learners. `

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEYS,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const user = await serverSession()
  if (user.messages + 1 < user.messageLimit) {
  try {
    
    const { messages, chatId } = await req.json();
    const chat = await prisma.files.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    const fileKey = chat.fileKey;
    const chatpdf = chat.chatpdf
    const lastMessage = messages[messages.length - 1];
    const newMessage = {
      role: 'system',
      content: 'none'
    }
    const context = await getContext(lastMessage.content, fileKey, chatpdf);
    console.log(context)

    const prompt = {
      role: "system",
      content: `
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
      
      `,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-1106",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
        
      ],
      // stream: true,
    });



    // const stream = await OpenAIStream(response);
    console.log(response.data.choices[0].message?.content)
    await prisma.message.create({
        data: {
          content: lastMessage.content,
          role: UserSystemEnum.user, // Use the updated enum value
          fileId: chatId, // Use chatId as fileId, you may need to adjust this based on your schema
        },
      });

    
      await prisma.message.create({
        data: {
          content: response.data.choices[0]?.message?.content || '', // Provide a default value if it's possibly undefined
          role: UserSystemEnum.system, // Use the updated enum value
          fileId: chatId, // Use chatId as fileId, you may need to adjust this based on your schema
        },
      });
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          messages: user.messages + 1
        }
      })

    return new NextResponse(response.data.choices[0]?.message?.content || '', { status: 200 });

  } catch (error) {
    console.log(error)
  } finally {
    // Close the Prisma client when it's no longer needed
    prisma.$disconnect();
  }
  } else {
    return new NextResponse('You have reached your message limit', { status: 200 });
  }
}