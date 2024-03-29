// @ts-nocheck
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizCreationSchema } from "@/schemas/forms/quiz";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { LiaCloneSolid } from "react-icons/lia";
import serverSession from '@/lib/serverSession';

export async function POST(req: Request, res: Response) {
    const user = await serverSession()
  if (user.messages + 1 < user.messageLimit) {
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
    const user = session.user as { id: string };
    const userId = user.id;

    const { topic, type, amount, selectedFileId } = await req.json();

    const file = await prisma.files.findFirst({
      where: {
        userId: userId,
        chatpdf: selectedFileId,
      }
    })


    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: userId,
        topic,
        fileId: file?.id,
      },
    });
    
    console.log('here')

    const { data } = await axios.post(
      `${process.env.BASE_URL}/api/questions`,
      {
        amount,
        topic,
        type,
        selectedFileId,
        userId
      }
    );

    if (type === "mcq") {
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
          gameId: game.id,
          questionType: "mcq",
        };
      });

      await prisma.question.createMany({
        data: manyData,
      });
    } else if (type === "open_ended") {
      type openQuestion = {
        question: string;
        answer: string;
      };

      console.log(data.questions)
      
      data.questions.map(async (question: mcqQuestion) => {
      let q = await prisma.question.createMany({
        data: [
          {
            question: question.question,
            answer: question.answer,
            gameId: game.id,
            questionType: "open_ended",
          },
        ],
      });
      console.log(q)
    }
  )
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
    } else {
    return new NextResponse({error: 'Reached Message Limit'}, { status: 402 });
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