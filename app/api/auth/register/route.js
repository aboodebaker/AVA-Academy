import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

export const POST = async (request) => {
  const { name, email, password, grade, classes} = await request.json();
  console.log(name, email, password, grade, classes )

  const hashedpassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedpassword,
      grade: grade,
      class: classes,
    }
  })

  // Find old user's files and activities
  const registerUser = '6558b8291fccb78a88ebd783'; // Replace with the old user's ID
  const oldUserFiles = await prisma.files.findMany({
    where: {
      userId: registerUser,
      grade: grade,
    }
  })

  const oldUserActivities = await prisma.activity.findMany({
    where: {
      userId: registerUser,
      file: {
        grade: grade,
      },
      class: classes
      
    }, 
    include: {
      questions: true
    }
  })

  // Import old user's files to the new user
  for (const file of oldUserFiles) {
    
    

    await prisma.files.create({
      data: {
        pdfName: file.pdfName,
        pdfUrl: file.pdfUrl,
        createdAt: file.createdAt,
        userId: user.id, // Use the new user's ID
        fileKey: file.fileKey,
        subject: file.subject,
        edited: file.edited,
        chatpdf: file.chatpdf,
        grade: file.grade,
      }
    });
  }

  // Import old user's activities to the new user
  for (const activity of oldUserActivities) {
    
    
    const newActivity = await prisma.activity.create({
      data: {
        uniqueId: activity.uniqueId,
        userId: user.id, // Use the new user's ID
        timeStarted: activity.timeStarted,
        topic: activity.topic,
        timeEnded: activity.timeEnded,
        gameType: activity.gameType,
        summary: activity.summary,
        mpoints: activity.mpoints,
        noteId: null,
        fileId: activity.fileId,
      }
    });

    // Import questions for the activity
    for (const question of activity.questions) {
      await prisma.questionActivity.create({
        data: {
          question: question.question,
          answer: question.answer,
          activityId: newActivity.id,
          options: question.options,
          percentageCorrect: question.percentageCorrect,
          isCorrect: question.isCorrect,
          questionType: question.questionType,
          userAnswer: question.userAnswer,
          canAnswer: question.canAnswer,
        }
      });
    }
  }

  return NextResponse.json(JSON.stringify({token: user.id, email: user.email, classes: user.class, grade: user.grade, name: user.name,}), {status: 200});
};
