import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { Configuration, OpenAIApi } from "openai";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import {UserSystemEnum } from "@prisma/client";
import { NextResponse } from "next/server";



const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const chat = await prisma.files.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return NextResponse.json({ error: "chat not found" }, { status: 404 });
    }

    const fileKey = chat.fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      AI assistant will always provide the page number.
      AI assistant will always stick to the page number if the user states it.
      `,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        
        ...messages.filter((message: Message) => message.role === "user"),
        prompt,
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
            content: response.data.choices[0].message.content,
            role: UserSystemEnum.system, // Use the updated enum value
            fileId: chatId, // Use chatId as fileId, you may need to adjust this based on your schema
          },
        });
      
    return new NextResponse(response.data.choices[0].message.content, {status: 200});
  } catch (error) {
    console.log(error)
  } finally {
    // Close the Prisma client when it's no longer needed
    prisma.$disconnect();
  }
}
//{
    //   onStart: async () => {
    //     // save user message into db
    //     await prisma.message.create({
    //       data: {
    //         chatId,
    //         content: lastMessage.content,
    //         role: UserSystemEnum.User, // Use the updated enum value
    //         fileId: chatId, // Use chatId as fileId, you may need to adjust this based on your schema
    //       },
    //     });
    //   },
    //   onCompletion: async (completion) => {
    //     // save ai message into db
    //     await prisma.message.create({
    //       data: {
    //         chatId,
    //         content: completion,
    //         role: UserSystemEnum.System, // Use the updated enum value
    //         fileId: chatId, // Use chatId as fileId, you may need to adjust this based on your schema
    //       },
    //     });
    //   },
    // }