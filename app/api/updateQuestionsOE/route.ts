
import { pusherServer } from '@/lib/pusher'
import { PrismaClient } from '@prisma/client'
interface Question {
    id: string;
    question: string;
    answer: string;
    activityId: string;
    options: null | any; // Replace 'any' with the actual type of 'options'
    percentageCorrect: number;
    isCorrect: null | any; // Replace 'any' with the actual type of 'isCorrect'
    questionType: string;
    userAnswer: string;
}
export async function POST(req: Request) {
  const { input, id } = await req.json();
  console.log(input)
const prisma = new PrismaClient();

try {
  pusherServer.trigger(id, 'incoming-questions', input);

//   const dataToUpdate: { questions: any } = {
//     questions: input,
//   };

//   await prisma.activity.updateMany({
//     where: {
//       uniqueId: id,
//     },
//     data: dataToUpdate,
//   });


    for (let i = 0; i < input.length; i++) {

        var update = await prisma.questionActivity.update({
            where: {
                id: input[i].id
            },
            data: {
                question: input[i].question,
                answer: input[i].answer,
                activityId: input[i].activityId,
                options: input[i].options, // Replace 'any' with the actual type of 'options'
                percentageCorrect: input[i].percentageCorrect,
                isCorrect: input[i].isCorrect, // Replace 'any' with the actual type of 'isCorrect'
                questionType: input[i].questionType,
                userAnswer: input[i].userAnswer,
            }
        })

        console.log(update)
    }

  return new Response(JSON.stringify({ success: true }));
} catch (error) {
  console.log(error);
} finally {
  prisma.$disconnect();
}
}