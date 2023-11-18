// @ts-nocheck
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { LiaCloneSolid } from "react-icons/lia";

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








    const messageContent =`You are a helpful AI that is able to generate a summary, main points and background information for this topic in the document: ${topic}. Format it nicely with bold headings and neat paragraphs and bullet points.`

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




    let chatData;
    let data;
    let game:any = null;


    try {
    const [chatResponse, questionResponse] = await Promise.all([
        axios.post(
            'https://api.chatpdf.com/v1/chats/message',
            {
                sourceId: selectedFileId,
                messages: message,
            },
            config
        ),
        axios.post(
            `${process.env.BASE_URL}/api/questions`,
            {
                amount,
                topic,
                type,
                selectedFileId,
            }
        ),
    ]);

    // Access the responses as needed
    chatData = chatResponse.data;
    data = questionResponse.data;




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
                summary: chatData.content,
                class: classs,
                },
            });

            console.log(game)
        


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
                summary: chatData.content,
                class: classs,
                },
            });

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
