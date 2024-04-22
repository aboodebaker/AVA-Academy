// /api/chapter/getInto
// @ts-nocheck
import { prisma } from "@/lib/db";
import { strict_output } from "@/lib/gpts";
import {
  getQuestionsFromTranscript,
  getTranscript,
  searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Configuration, OpenAIApi } from "openai";
import { ca } from "date-fns/locale";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEYS,
});
const openai = new OpenAIApi(configuration);

const bodyParser = z.object({
  chapterId: z.string(),
});

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { chapterId } = bodyParser.parse(body);
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
    });

    const unit = await prisma.unit.findUnique({
      where: {
        id: chapter?.unitId
      }
    })
    try {
    const course = await prisma.course.update({
        where: {
          id: unit?.courseId
        },
        data: {
          show: true,
        }
      })
    } catch(error) {}
    if (!chapter) {
      return NextResponse.json(
        {
          success: false,
          error: "Chapter not found",
        },
        { status: 404 }
      );
    }
    const videoId = await searchYoutube(chapter.youtubeSearchQuery);
    let transcript = await getTranscript(videoId);
    let maxLength = 500;
    transcript = transcript.split(" ").slice(0, maxLength).join(" ");

    const model: string = "gpt-3.5-turbo-1106"
    const temperature: number = 1

    const response = await openai.createChatCompletion({
      temperature: temperature,
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an AI capable of summarising a youtube transcript. You never say sure or absolutely at the beggining and get straight into summarising the youtube transcript"
        },
        { 
          role: "user", 
          content: `Summarise in 250 words or less and do not talk about sponsors or anything unrelated to the main topic. Also, do not introduce what the summary is about. ${transcript}`
        }
      ],
    });

    let summary = response.data.choices[0].message?.content

    console.log(summary)

    const questions = await getQuestionsFromTranscript(
      transcript,
      chapter.name
    );

    await prisma.chapter.update({
      where: { id: chapterId },
      data: {
        videoId: videoId,
        summary: summary,
      },
    });

    
    try {
      await prisma.questionCourse.createMany({
      data: questions.map((question) => {
        let options = [
          question.answer,
          question.option1,
          question.option2,
          question.option3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          chapterId: chapterId,
        };
      }),
    });
    } catch (error) {
      console.log(error)
    }
    

    

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid body",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "unknown",
        },
        { status: 500 }
      );
    }
  }
}
