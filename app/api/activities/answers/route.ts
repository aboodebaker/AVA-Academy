import { pusherServer } from '@/lib/pusher'
import { PrismaClient } from '@prisma/client'

export async function POST(req: Request) {
  const { id, stats, userId, questionNo } = await req.json()
  const prisma = new PrismaClient()
  console.log(stats)
  try {
    pusherServer.trigger(id, 'incoming-message', {stats: stats, userId: userId, number: questionNo})

  


  return new Response(JSON.stringify({ success: true }))
    
  } catch (error) {
    console.log(error)
  } finally {
    prisma.$disconnect()
  }
  
}