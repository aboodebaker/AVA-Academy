// @ts-nocheck
import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import stringSimilarity from "string-similarity";
import { pusherServer } from '@/lib/pusher'
import { PrismaClient } from '@prisma/client'

export async function POST(req: Request, res: Response) {
  try {
    const { questionId, userInput, userId, questionNo } = await req.json();

    const question = await prisma.questionActivity.findUnique({
      where: { id: questionId },
    });
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (!question) {
      return NextResponse.json(
        {
          message: "Question not found",
        },
        {
          status: 404,
        }
      );
    }
    await prisma.questionActivity.update({
      where: { id: questionId },
      data: { userAnswer: userInput },
    });
    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() === userInput.toLowerCase().trim();
        console.log(isCorrect)
      await prisma.questionActivity.update({
        where: { id: questionId },
        data: { isCorrect },
      });

      console.log(userId)
      pusherServer.trigger(userId, `incoming-student-answers-${userId}`, { question: questionNo, correctAnswer: isCorrect, userName: user.name });
      return NextResponse.json({
        isCorrect: isCorrect,
      });


    } 
    
    
    else if (question.questionType === "open_ended") {
      let percentageSimilar = stringSimilarity.compareTwoStrings(
        question.answer.toLowerCase().trim(),
        userInput.toLowerCase().trim()
      );
      percentageSimilar = Math.round(percentageSimilar * 100);
      await prisma.questionActivity.update({
        where: { id: questionId },
        data: { percentageCorrect: percentageSimilar },
      });
      return NextResponse.json({
        percentageSimilar,
      });
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: error.issues,
        },
        {
          status: 400,
        }
      );
    }
  }
}
