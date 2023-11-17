// pages/api/pusher-auth.js
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request, res: Response) {
  const {socketId, channel} = await req.json();

  const session = await getServerSession(authOptions)
  const user = session?.user as { id: string, name: string };
  const userId = user.id;

  // Get user information (you may need to implement user authentication)
  

  const auth = pusherServer.authorizeChannel(socketId, channel, {
    user_id: userId,
    user_info: {name: user.name},
  });

  return NextResponse.json(
      auth,
      {
          status: 200,
    }
    );
};
