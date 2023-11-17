import { PrismaClient } from "@prisma/client";

export async function POST(req: Request) {
  const { note, activityId } = await req.json();
    const prisma = new PrismaClient()
    try {
        const fullNote = await prisma.notes.findUnique({
            where: {
                id:note
            }
        })
        await prisma.activity.update({
            where: {
                id: activityId,
            },
            data: {
                noteId: note
            }
        })
        return new Response(JSON.stringify({ note: fullNote }));
    } catch (error) {
        
    }
}

