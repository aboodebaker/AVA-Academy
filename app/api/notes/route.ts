import { NextResponse } from "next/server";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string };
  const userId = user?.id;
  console.log('got user id')
  if (!userId) {
    return new NextResponse("unauthorised", { status: 401 });
  }
  const body = await req.json();
  const { name, subject, shared } = body;
  
  // const image_description = await generateImagePrompt(name);
  // if (!image_description) {
  //   return new NextResponse("failed to generate image description", {
  //     status: 500,
  //   });
  // }
  //   const image_url = await generateImage(image_description);
  const image_url = await generateImage(name);
  if (!image_url) {
    return new NextResponse("failed to generate image ", {
      status: 500,
    });
  }

  const note_ids = await prisma.notes.create({
  data: {
    title: name,
    image: image_url,
    userId: userId,
    subjectId: subject,
    shared: shared,
  },
})
 

  return NextResponse.json({
    note_id: note_ids.id,
  });
}