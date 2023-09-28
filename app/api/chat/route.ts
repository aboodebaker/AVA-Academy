// import { Configuration, OpenAIApi } from "openai-edge";
// import { Message, OpenAIStream, StreamingTextResponse } from "ai";
// import { getContext } from "@/lib/context";
// import {UserSystemEnum } from "@prisma/client";
// import { NextResponse } from "next/server";

// export const runtime = "edge";


// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(config);

// export async function POST(req: Request) {
//   try {
//     const { messages, chatId } = await req.json();
//     console.log(chatId)
    
//     const chatApi = await fetch('http://localhost:3000/api/chat/chat-find', {
//       method: "POST",
//       body: JSON.stringify({chatId:chatId}),
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     })

//     const cha = await chatApi.json();
//     console.log(cha)
//     const chat = cha.chat

//     if (!chat) {
//       return NextResponse.json({ error: "chat not found" }, { status: 404 });
//     }
    
//     const fileKey = chat.fileKey;
//     const lastMessage = messages[messages.length - 1];
//     const context = await getContext(lastMessage.content, fileKey);

//     const prompt = {
//       role: "system",
//       content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
//       The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
//       AI is a well-behaved and well-mannered individual.
//       AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
//       AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
//       AI assistant is a big fan of Pinecone and Vercel.
//       START CONTEXT BLOCK
//       ${context}
//       END OF CONTEXT BLOCK
//       AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
//       If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
//       AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
//       AI assistant will not invent anything that is not drawn directly from the context.
//       AI assistant will always provide the page number.
//       AI assistant will always stick to the page number if the user states it.
//       `,
//     };

//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [
        
//         ...messages.filter((message: Message) => message.role === "user"),
//         prompt,
//       ],
//       stream: true,
      
//     });

//     // const stream = await OpenAIStream(response);
//     const stream = OpenAIStream(response, {
//       onCompletion: async (completion) => {
//         // save ai message into db
//         const prismaFetch = await fetch('http://localhost:3000/api/chat/chat-store', {
//         method: "POST",
//         body: JSON.stringify({ user: lastMessage.content, assistant: completion || '', chatId: chatId }),
//         headers: {
//         'Content-Type': 'application/json',
//     }
// }
// );
//       },
//     });
    
// return new StreamingTextResponse(stream);

//   } catch (error) {
//     console.log(error)
//   } 
// }
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

    import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { Configuration, OpenAIApi } from "openai";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import {UserSystemEnum } from "@prisma/client";
import { NextResponse } from "next/server";

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
    const newMessage = {
      role: 'system',
      content: 'none'
    }
    const context = await getContext(lastMessage.content, fileKey);
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
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      
      `,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
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

return new NextResponse(response.data.choices[0]?.message?.content || '', { status: 200 });

  } catch (error) {
    console.log(error)
  } finally {
    // Close the Prisma client when it's no longer needed
    prisma.$disconnect();
  }
}