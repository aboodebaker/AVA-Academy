import { pusherServer } from '@/lib/pusher'
import { PrismaClient } from '@prisma/client'

export async function POST(req: Request) {
  const { input, id } = await req.json()
  const prisma = new PrismaClient()
  try {
    pusherServer.trigger(id, 'incoming-message', input)

  await prisma.activity.updateMany({
    where: {
      uniqueId: id
    },
    data: {
      summary: input
    }
  })


  return new Response(JSON.stringify({ success: true }))
    
  } catch (error) {
    console.log(error)
  } finally {
    prisma.$disconnect()
  }
  
}