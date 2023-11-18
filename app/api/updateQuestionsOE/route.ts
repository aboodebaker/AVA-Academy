
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

 const activities = await prisma.activity.findMany({
  where: {
    uniqueId: id
  },
  include: {
    questions: true
  }
 })
console.log(activities)

    for (let i = 0; i < activities.length; i++) {
  for (let e = 0; e < input.length; e++) {  // Change i++ to e++
    try {
      const update = await prisma.questionActivity.update({
        where: {
          id: activities[i].questions[e].id
        },
        data: {
          question: input[e].question,
          answer: input[e].answer,
          options: input[e].options,
          percentageCorrect: input[e].percentageCorrect,
          isCorrect: input[e].isCorrect,
          questionType: input[e].questionType,
          userAnswer: input[e].userAnswer,
          canAnswer: input[e].canAnswer
        }
      });

      const updated = await prisma.questionActivity.findFirst({
        where: {
          id: input[e].id  // Change i to e
        }
      });
      console.log(updated);
      
    } catch (error) {
      console.log(error);
    }
  }
}
return new Response(JSON.stringify({ success: true }));


} catch (error) {
  console.log(error);
} finally {
  prisma.$disconnect();
}
}