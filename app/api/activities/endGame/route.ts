// @ts-nocheck
import { prisma } from "@/lib/db";
import { endGameSchema } from "@/schemas/questions";
import { NextResponse } from "next/server";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { createChaptersSchema } from "@/validators/course";
import { getServerSession } from "next-auth";
import {authOptions} from '@/app/api/auth/[...nextauth]/route'

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { gameId } = endGameSchema.parse(body);
    const session = await getServerSession(authOptions);;

    const game = await prisma.activity.findUnique({
      where: {
        id: gameId,
      },
      include: {
        questions: true,
      }
    });

    const file = await prisma.files.findUnique({
      where: {
        id: game?.fileId
      }
    })


    if (!game) {
      return NextResponse.json(
        {
          message: "Game not found",
        },
        {
          status: 404,
        }
      );
    }

    const gameString = JSON.stringify(game);


    const performance = await strict_output(
      systemPrompt,
      `you are to analyse the student's perfromance here: ${gameString}`,
      {
        strengths: "analyse the student's stengths. Do not only include things such as their ability to do work but also mention their skills such as memorisation, understanding and other skills but if there is not enough evidence in the questions alone state that it is a noticible feature. also Narratively describe the subjects and specific areas where the student consistently shows high performance, underpinning the analysis with data regarding 'percentageCorrect', 'isCorrect', and 'summary' when applicable. If he has not got any strenths shown do not be afraid to say so or that you do not have enough data. Look at the questions and the users answers and say there strenghts and never contridict their weaknesses.",
        weaknesses: {
          title: "title of the weakness or weaknesses. It is the title of a course. eg.Respitory system",
          units: ["give 3 units that should inside the course. eg. ['function of the lungs', 'the structure of the lungs', 'common medical problems with the lungs']"],
          analysis: "This is what should be given to the student to help him understand his weaknesses. Make bullet points"
        },
        questionAnalysis: {
          question1: 'give an analysis on what the student did wrong and how he can fix it.',
          question2: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question3: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question4: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question5: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question6: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question7: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question8: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question9: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
          question10: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no question.',
        },
        summary:"Integrate the data to provide a comprehensive summary of the student's academic performance inside these questions. Do not make it to long nor too short.",
        subtopic: "state the subtopic. Usually it will be a subtopic of a module that these questions will be about so just name that if there is no further subtopics. Investigate the student's grasp on individual subtopics within the subject matter, referencing the 'questions' field and the associated 'summary' and 'performance' data.",
        topic: "identify the overall topic",
        improvement: "Offer recomendations on what to focus on, how they can focus on it and what can they do to improve.If he has not got any improvements needed do not be afraid to say so or that you do not have enough data",
        achievements: "state the user's achievements in terms of academic skill and what they are noticibly good at within the topic If he has not got any acomplishments do not be afraid to say so or that you do not have enough data",
        mark: "the user's estimated mark from your estimation"
      }
    )

    function removeNull(obj:any) {
      for (let key in obj) {
          if (obj[key] === null) {
              delete obj[key];
          } else if (typeof obj[key] === 'object') {
              removeNull(obj[key]);
          }
      }
  }

 removeNull(performance)
  let course = null

  if (performance.weaknesses) {

  const title = performance.weaknesses.title
  const units = performance.weaknesses.units

  let output_units = []
  let output_unit = null

  for (let i = 0; i < 3; i++) {
  output_unit = await strict_output(
      "You are an AI capable of curating course content, coming up with relevant chapter titles, and finding relevant youtube videos for each chapter. You are to only stick to the same title or topic given per unit.",
      new Array(5).fill(
        `It is your job to create a course about ${title} with the units being: ${units[i]}. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educationalvideo for each chapter. Each query should give an educational informative course in youtube. Always put double quotes`
      ),
      {
        title: "title of the unit Always put double quotes",
        chapters:
          "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object. Always put double quotes",
      }
    );

    output_units.push(output_unit)

  }

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

    
    course = await prisma.course.create({
      data: {
        name: title,
        image: course_image,
        userId: session.user.id,
        subjectId: file?.subjectid,
        fileId: file.id,
        show: false,
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
  }

    await prisma.activityPerformance.create({
      data: {
        activityId: gameId,
        performanceData: JSON.stringify(performance),
        date: new Date(),
      }
    })

    await prisma.activity.update({
      where: {
        id: gameId,
      },
      data: {
        timeEnded: new Date(),
      },
    });
    return NextResponse.json({
      message: "Game ended",
      performance: performance,
      gameId: course.id
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}



const systemPrompt = `You are an AI Student Analyser. Here are your instuctons:

1. Extract the necessary data from the database models 'Activity' and 'QuestionActivity' including, but not limited to, user ID, topic, gameType, question details, and performance metrics. The answer is the correct answer to the question while the userAnswer is the users answer .

2. Analyze the extracted data to discern the user's academic strengths, weaknesses, question-level performance, and overall mastery of the subject matter. NEVER BE AFRAID TO SAY THAT THEY HAVE NO STRENGTHS< WEAKNESSES, IMPOVEMENTS OR ACHIEVEMENTS.

3. Compile the analyzed data into a written report with the following structure:

**A. Strengths** 
   Title: "Strengths Identified"
   - Narratively describe the subjects and specific areas where the student consistently shows high performance, underpinning the analysis with data regarding 'percentageCorrect', 'isCorrect', and 'summary' when applicable.
   - analyse the student's stengths. Do not only include things such as their ability to do work but also mention their skills such as memorisation, understanding and other skills but if there is not enough evidence in the questions alone state that it is a noticible feature. also Narratively describe the subjects and specific areas where the student consistently shows high performance, underpinning the analysis with data regarding 'percentageCorrect', 'isCorrect', and 'summary' when applicable. If he has not got any strenths shown do not be afraid to say so or that you do not have enough data. Look at the questions and the users answers and say there strenghts and never contridict their weaknesses.
**B. Areas for Improvement** 
   Title: "Weaknesses"
   - In this area, title and units are going to be used by another AI to create a course on the topic. Each unit will get sent to the Course Creation AI and will make create 3 chapters per unit. In each chapter there will be a relavent youtube video, summary and questions on the video. All you are required to do is give the title of the course and the units for the course.
   - Title: This is the title of the course that will be made. it should be about the weaknesses of the student. (eg the student has an issue with the heart: title: The heart units: ['the structure of the heart', 'the function of the heart', 'common deseases']) 
   - Units: This is where the units for the course should be made. it should not be more than 6 words per unit.
   - Student analysis: Articulate the subjects and specific skills that data suggests require additional focus, extrapolated from recurring patterns where 'percentageCorrect' is low, including any 'options', 'userAnswer', and 'questionType' data that highlights a misunderstanding.
   analyse the student's weaknesses.Start with The student has a weakness in ... as seen in ... Do not only include things such as their weaknesses in their work but also mention their skills such as memorisation, understanding and other skills but if there is not enough evidence in the questions alone state that it is a noticible weakness. If he has not got any weaknesses shown do not be afraid to say so or that you do not have enough data. Look at the questions and the users answers and say there weaknesses and never contridict their strenghts.
   - If there is no weaknesses, make it weaknesses null.
**C. Detailed Question Review** 
   Title: "Assessment of Question Responses"
   - Assess and interpret each question-response interaction. Illuminate misunderstandings, correct interpretations, and any partial understanding reflected in the 'percentageCorrect' and 'isCorrect' fields.

**D. Overall Performance Summary** 
   Title: "Performance Synopsis"
   - Integrate the data to provide a comprehensive summary of the student's academic performance across all analyzed subjects from the 'Activity' model.

**E. Subtopic Proficiency** 
   Title: "Subtopic Proficiency Analysis"
   - Investigate the student's grasp on individual subtopics within the subject matter, referencing the 'questions' field and the associated 'summary' and 'performance' data.

**F. Topic Understanding** 
   Title: "Topic Mastery Insights"
   - Summarize the student's understanding of overarching topics, informed by the 'topic' field in 'Activity' and respective performance data.

**G. Suggestions for Improvement** 
   Title: "Personalized Improvement Plan"
   - Offer recommendations for enhancement based upon the entire dataset including mistakes identified and the related 'class', 'noteId', and 'fileId' to contextualize learning resources.

**H. Exceptional Accomplishments** 
   Title: "Notable Strengths"
   - Celebrate areas where the student exhibits strong capabilities or significant improvement, boosting confidence and motivation.

The AI Student Analyser is to draft a report using clear and concise language, sectioned into the prescribed titles above. Refrain from creating tables, charts, or bullet lists; instead, present findings in a well-articulated prose format suitable for educators and students. Each section of the report should flow logically into the next, building a detailed picture of the student's current standing and a path forward for academic development.`