// /api/course/createChapters
// @ts-nocheck
import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpts";
import { getUnsplashImage } from "@/lib/unsplash";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import {authOptions} from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request, res: Response) {
  try {
    const session = await getServerSession(authOptions);;
    if (!session?.user) {
      return new NextResponse("unauthorised", { status: 401 });
    }
    const isPro = true;
    if (session.user.credits <= 0 && !isPro) {
      return new NextResponse("no credits", { status: 402 });
    }
    const body = await req.json();
    const { title, units } = createChaptersSchema.parse(body);

    let output_units = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter. You are to only stick to the same title or topic given per unit.",
      new Array(5).fill(
        `It is your job to create a course about ${title} with the units being: ${units}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educationalvideo for each chapter. Each query should give an educational informative course in youtube. Always put double quotes`
      ),
      {
        title: "title of the unit Always put double quotes",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object. Always put double quotes",
      }
    );

    console.log(output_units)

    const imageSearchTerm = await strict_output(
      "you are an AI capable of finding the most relevant image for a course",
      `Please provide a good image search term for the title of a course about ${title}. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results`,
      {
        image_search_term: "a good search term for the title of the course",
      }
    );

    const course_image = await getUnsplashImage(
      imageSearchTerm.image_search_term
    );

    
    const course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
        userId: session.user.id,
      },
    });

    for (const unit of output_units) {
      const title = unit.title;
      const prismaUnit = await prisma.unit.create({
        data: {
          name: title,
          courseId: course.id,
        },
      });
      await prisma.chapter.createMany({
        data: unit.chapters.map((chapter) => {
          return {
            name: chapter.chapter_title,
            youtubeSearchQuery: chapter.youtube_search_query,
            unitId: prismaUnit.id,
          };
        }),
      });
    }
    // await prisma.user.update({
    //   where: {
    //     id: session.user.id,
    //   },
    //   data: {
    //     credits: {
    //       decrement: 1,
    //     },
    //   },
    // });

    return NextResponse.json({ course_id: course.id });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error(error);
  }
}
