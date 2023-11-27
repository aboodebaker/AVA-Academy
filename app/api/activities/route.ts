// @ts-nocheck
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { LiaCloneSolid } from "react-icons/lia";
import { Configuration, OpenAIApi } from "openai";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/context";
import serverSession from '@/lib/serverSession';
import { pusherServer } from '@/lib/pusher'

    const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);


export async function POST(req: Request, res: Response) {
  try {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var randomInteger = getRandomInt(1, 1000000000);

    // Convert the random integer to a string
    var uniqueId = randomInteger.toString();

    const body = await req.json();
    const { topic, type, amount, selectedFileId, classs } = quizCreationSchema.parse(body);

    console.log('here')
    const usersWithFile = await prisma.user.findMany({
        where: {
            files: {
            some: {
                chatpdf: selectedFileId,
            },
            },
            class: {
              in: [classs, 'teacher', 'registerUser']
            },
        },
        include: {
            files: true,
        },
    });
    console.log('here')
    const teacherFile = await prisma.files.findFirst({
      where: {
            
            chatpdf: selectedFileId,
            User: {
            class: {
              equals: 'teacher'
            },
          }
        },
    })
const teacherUser = await prisma.user.findFirst({
      where: {
            class: {
              equals: 'teacher'
            },
        },
    })

    const teacherId = teacherUser.id
    const fileKey = teacherFile?.fileKey




    const messageContent =`You are a helpful AI that is able to generate a summary, main points and background information for this topic in the document: ${topic}. Format it nicely with bold headings and neat paragraphs and bullet points. Please refrain from saying anything such as sure, or i can help and get straight into the summary.`

    const message = {
        role: 'user',
        content: messageContent
    }
    const context = await getContext(`generate a summary, main points and background information for this topic in the document: ${topic}.`, fileKey);

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

    



    let chatData;
    let data;
    let game:any = null;

    try {
    const [chatResponse, questionResponse] = await Promise.all([
      await openai.createChatCompletion({
      model: "gpt-3.5-turbo-1106",
      messages: [
        prompt,
        message,       
      ],

    }),
        axios.post(
            `${process.env.BASE_URL}/api/questions`,
            {
                amount,
                topic,
                type,
                selectedFileId,
                userid: teacherId
            }
        ),
    ]);

    // Access the responses as needed
    chatData = chatResponse.data;
    chatData = chatData.choices[0].message?.content
    data = questionResponse.data;


    console.log('here')

    // Continue with the rest of your code using chatData and questionData
    } catch (error:any) {
        // Handle errors here
        console.error('Error:', error.message);
    }


    if (type === "mcq") {

        for (const user of usersWithFile) {
        // Assuming you want to use the user's file ID for the new activity
        const fileId = user.files.find(file => file.chatpdf === selectedFileId)?.id;

        // Create a new activity for the user
        game = await prisma.activity.create({
                data: {
                userId: user.id,
                uniqueId: uniqueId,
                fileId: fileId,
                topic: topic,
                gameType: type,
                timeStarted: new Date(),
                summary: chatData,
                class: classs,
                },
            });



        


      type mcqQuestion = {
        question: string;
        answer: string;
        option1: string;
        option2: string;
        option3: string;
      };

      const manyData = data.questions.map((question: mcqQuestion) => {
        // mix up the options lol
        const options = [
          question.option1,
          question.option2,
          question.option3,
          question.answer,
        ].sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          activityId: game.id,
          questionType: "mcq",
        };
      });

      await prisma.questionActivity.createMany({
        data: manyData,
      });


          const activit = await prisma.activity.findUnique({
      where: {
        id: game.id
      }, 
      include: {
        questions: true,
      }
    })

    await pusherServer.trigger(user.id, 'incoming-activities', activit);


    }





    } else if (type === "open_ended") {

        for (const user of usersWithFile) {
        // Assuming you want to use the user's file ID for the new activity
        const fileId = user.files.find(file => file.chatpdf === selectedFileId)?.id;

        // Create a new activity for the user
        game = await prisma.activity.create({
                data: {
                userId: user.id,
                uniqueId: uniqueId,
                fileId: fileId,
                topic: topic,
                gameType: type,
                timeStarted: new Date(),
                summary: chatData.choices[0].message?.content,
                class: classs,
                },
            });
      console.log('here')
        type openQuestion = {
          question: string;
          answer: string;
        };


      await prisma.questionActivity.createMany({
        data: data.questions.map((question: openQuestion) => {
          return {
            question: question.question,
            answer: question.answer,
            activityId: game.id,
            questionType: "open_ended",
            
          };
        }),
      });

      const activit = await prisma.activity.findUnique({
      where: {
        id: game.id
      }, 
      include: {
        questions: true,
      }
    })

    await pusherServer.trigger(user.id, 'incoming-activities', activit);
  }
}

    return NextResponse.json({ gameId: game.id }, { status: 200 });
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      
      return NextResponse.json(
        { error: error.issues },
        {
          status: 400,
        }
      );
    } else {
      return NextResponse.json(
        { error: "An unexpected error occurred." },
        {
          status: 500,
        }
      );
    }
  }
}
export async function GET(req: Request, res: Response) {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to create a game." },
        {
          status: 401,
        }
      );
    }
    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");
    if (!gameId) {
      return NextResponse.json(
        { error: "You must provide a game id." },
        {
          status: 400,
        }
      );
    }

    const game = await prisma.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        questions: true,
      },
    });
    if (!game) {
      return NextResponse.json(
        { error: "Game not found." },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      { game },
      {
        status: 400,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      {
        status: 500,
      }
    );
  }
}