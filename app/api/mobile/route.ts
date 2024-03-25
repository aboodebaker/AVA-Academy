// @ts-nocheck
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { compare } from 'bcrypt'

export const POST = async (request) => {
    const {type, data} = await request.json()

    if (type === 'register') {


  try {
    const { name, email, password, grade, classes } = data;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        grade: grade,
        class: classes,
        image: 'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small/user-profile-icon-free-vector.jpg',
      },
    });

    // Get the old user data (assuming this is retrieved dynamically)
    const registerUserComplete = await prisma.user.findFirst({
      where: {
        class: 'registerUser'
      }
    })

    const registerUser = registerUserComplete.id
    if (registerUser) {
    const oldUserFiles = await prisma.files.findMany({
      where: {
        userId: registerUser,
        grade: grade,
      },
      include: {
        Subject: true,
      },
    });

    const oldUserSubjects = await prisma.subject.findMany({
      where: {
        grade: grade,
      },
    });

    const oldUserActivities = await prisma.activity.findMany({
      where: {
        userId: registerUser,
        file: {
          grade: grade,
        },
        class: classes,
      },
      include: {
        questions: true,
      },
    });

    for (const oldSubject of oldUserSubjects) {
      // Create a new subject for the new user
      const newSubject = await prisma.subject.create({
        data: {
          name: oldSubject.name,
          grade: oldSubject.grade,
          image: oldSubject.image,
          userId: user.id,
          uniqueId: oldSubject.uniqueId,
        },
      });

      // Filter files for the current subject
      const subjectFiles = oldUserFiles.filter(
        (file) => file.subjectid === oldSubject.uniqueId
      );

      // Create files for the new user based on the old files
      for (const file of subjectFiles) {
        await prisma.files.create({
          data: {
            pdfName: file.pdfName,
            pdfUrl: file.pdfUrl,
            createdAt: file.createdAt,
            userId: user.id,
            fileKey: file.fileKey,
            subjectid: newSubject.id,
            edited: file.edited,
            chatpdf: file.chatpdf,
            grade: file.grade,
          },
        });
      }

      // Filter activities for the current subject
      const subjectActivities = oldUserActivities.filter(
  (activity) => subjectFiles.some(file => file.id === activity.fileId)
);

      // Create activities for the new user based on the old activities
      for (const activity of subjectActivities) {
        const newActivity = await prisma.activity.create({
          data: {
            uniqueId: activity.uniqueId,
            userId: user.id,
            timeStarted: activity.timeStarted,
            topic: activity.topic,
            timeEnded: activity.timeEnded,
            gameType: activity.gameType,
            summary: activity.summary,
            mpoints: activity.mpoints,
            noteId: null,
            fileId: activity.fileId,
          },
        });

        // Create questions for the new activity
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
            },
          });
        }
      }
    }
  }
    return NextResponse.json(
      {
        token: user.id,
        email: user.email,
        classes: user.class,
        grade: user.grade,
        name: user.name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      JSON.stringify({ error: 'An error occurred during user creation.' }),
      { status: 500 }
    );
  }
}
if (type === 'classes') {
      const { id } = data;

  const subjects = await prisma.subject.findMany({
  where: {
    userId: id
  }
});


  return NextResponse.json(subjects, {status: 200})
}

if (type === 'login') {
    const {email, password} = data

    const user = await prisma.user.findUnique({
          where: {
            email: email
          }
        })

        if (!user) {
          return NextResponse.json({error: "no user please register"}, {status: 404})
        }
        
        const isPasswordValid = await compare(
          password,
          user.password
        )

        if (!isPasswordValid) {
            return NextResponse.json({error: "Wrong password. Please try again"}, {status: 404})
        }

        return NextResponse.json({
          id: user.id,
          email: user.email,
          name: user.name,
          class: user.class,
          grade: user.grade,
        }, 
        {status: 200} 
        )
}

if (type === 'password') {
  const {password} = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  return NextResponse.json({
          password: hashedPassword
        }, 
        {status: 200} 
        )
}










else {
    return NextResponse("type not found", {status: 404})
}


};