import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { strict_output } from "@/lib/gpt";

export async function POST(req: Request, res: Response) {
  try {
    const {fileId} = await req.json();


    const games = await prisma.files.findUnique({
      where: {
        id: fileId,
      },
      include: {
        games: true,
      }
    });

    const activities = await prisma.activity.findMany({
        where: {
            fileId: fileId,
        },
        include: {
            performance: true,
        }
    })

    const game = [games, activities]


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
        strengths: "analyse the student's stengths. Do not only include things such as their ability to do work but also mention their skills such as memorisation, understanding and other skills but if there is not enough evidence in the topics alone state that it is a noticible feature. also Narratively describe the subjects and specific areas where the student consistently shows high performance, underpinning the analysis with data regarding 'percentageCorrect', 'isCorrect', and 'summary' when applicable.",
        weaknesses: "analyse the student's weaknesses. Do not only include things such as their weaknesses in their work but also mention their skills such as memorisation, understanding and other skills but if there is not enough evidence in the topics alone state that it is a noticible weakness",
        topicAnalysis: {
          topic1: 'give an analysis on what the student did wrong and how he can fix it.',
          topic2: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic3: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic4: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic5: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic6: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic7: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic8: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic9: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
          topic10: 'give an analysis on what the student did wrong and how he can fix it. Say none if there is no topic.',
        },
        summary:"Integrate the data to provide a comprehensive summary of the student's academic performance inside these topics. Do not make it to long nor too short.",
        improvement: "Offer recomendations on what to focus on, how they can focus on it and what can they do to improve.",
        achievements: "state the user's achievements in terms of academic skill and what they are noticibly good at within the topic",
        mark: "the user's estimated mark from your estimation"
      }
    )

    await prisma.filePerformance.create({
      data: {
        fileId: fileId,
        performanceData: performance,
        date: new Date(),
      }
    })

    return NextResponse.json({
      performance: performance,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}


const systemPrompt = `You are an AI Student Analyser. Here are your instuctons:

1. Extract the necessary data

2. Analyze the extracted data to discern the user's academic strengths, weaknesses, topic-level performance, and overall mastery of the subject matter.

3. Compile the analyzed data into a written report with the following structure:

**A. Strengths** 
   Title: "Strengths Identified"
   - Narratively describe the subjects and specific areas where the student consistently shows high performance, underpinning the analysis with data regarding 'percentageCorrect', 'isCorrect', and 'summary' when applicable.

**B. Areas for Improvement** 
   Title: "Opportunities for Growth"
   - Articulate the subjects and specific skills that data suggests require additional focus, extrapolated from recurring patterns where 'percentageCorrect' is low, including any 'options', 'userAnswer', and 'topicType' data that highlights a misunderstanding.

**C. Detailed topic Review** 
   Title: "Assessment of topic Responses"
   - Assess and interpret each topic-response interaction. Illuminate misunderstandings, correct interpretations, and any partial understanding reflected.

**D. Overall Performance Summary** 
   Title: "Performance Synopsis"
   - Integrate the data to provide a comprehensive summary of the student's academic performance across all analyzed subjects from the 'Activity' model.

**G. Suggestions for Improvement** 
   Title: "Personalized Improvement Plan"
   - Offer recommendations for enhancement based upon the entire dataset including mistakes identified and the related 'class', 'noteId', and 'fileId' to contextualize learning resources.

**H. Exceptional Accomplishments** 
   Title: "Notable Strengths"
   - Celebrate areas where the student exhibits strong capabilities or significant improvement, boosting confidence and motivation.

**I. Mark** 
   Title: "Mark"
   - Estimate the user's percent and grade based of his performance.

The AI Student Analyser is to draft a report using clear and concise language, sectioned into the prescribed titles above. Refrain from creating tables, charts, or bullet lists; instead, present findings in a well-articulated prose format suitable for educators and students. Each section of the report should flow logically into the next, building a detailed picture of the student's current standing and a path forward for academic development. DO NOT PUT QUOTATIONS IN THE JSON`
