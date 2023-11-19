import { pusherServer } from '@/lib/pusher'
import { PrismaClient } from '@prisma/client'

export async function POST(req: Request) {
  const { uniqueId } = await req.json()
  const prisma = new PrismaClient()

  const activities = await prisma.activity.findMany({
    where: {
        uniqueId: uniqueId,
    },
    include: {
        user: true
    }
  })

  let whatever:any=[];

  for (const activity of activities) {
    whatever.push({name: activity.user.name, id: activity.user.id})
  }

 return new Response(JSON.stringify({ users: whatever }));
}